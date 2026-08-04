---
title: "Glitch in the Vault — PerfectRootCTF Writeup"
description: "Flag: r00t{f4ultys1gn4tur3f4ct0rsth3m0dulus}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{f4ulty_s1gn4tur3_f4ct0rs_th3_m0dulus}`

---

## 1. Challenge Overview

> *"Our signing hardware is certified to 99.9999% reliability... The engineering
> team insists the incident has no cryptographic consequences. They are wrong."*

VaultSign™ HSM signs inter-bank settlement requests using RSA-CRT. During a
power event, one signing job produced **two outputs**: a glitched first run and
a recomputed second run. We have the public key, the message, both outputs, and
an encrypted compliance report. Decrypt the report.

| Field | Description |
|---|---|
| `N`, `e` | RSA public key (e = 65537, 2048-bit N) |
| `signing_target` | the signed message |
| `output_A` | first run (glitched) |
| `output_B` | recomputed run (correct) |
| `encrypted_report` | `report^e mod N` — must be decrypted with d |

This is the classic **RSA-CRT fault attack** (Lenstra's attack): a transient
fault in one CRT component turns a "harmless glitch" into a full factorization
of the modulus.

---

## 2. The signing algorithm (`signing_engine.py`)

```python
# Garner's formula — RSA-CRT signature
sp = pow(message_int, dp, p)     # m^d mod p
sq = pow(message_int, dq, q)     # m^d mod q
h  = (sp - sq) * qinv % p
s  = sq + q * h
```

A correct signature satisfies `s^e ≡ m (mod N)` — because it's congruent to
`m^d` modulo **both** p and q.

A **faulty** signature — say a bit flip in `sp` before recombination — satisfies
`s^e ≡ m (mod q)` but **not** `(mod p)` (or vice versa). The signature is "half
right": valid modulo one prime, invalid modulo the other.

---

## 3. The attack: one glitch = full factorization

Given a glitched signature `s_g` that satisfies `s_g^e ≡ m (mod q)` but not
`(mod p)`:

```
s_g^e − m  ≡ 0          (mod q)        ← divisible by q
s_g^e − m  ≢ 0          (mod p)        ← not divisible by p

⇒  gcd(s_g^e − m, N)  =  q             (the non-trivial factor!)
```

**One modular exponentiation + one gcd = p and q.** With p, q in hand, compute
`φ(N) = (p−1)(q−1)`, `d = e⁻¹ mod φ(N)`, and decrypt the report.

The two outputs even identify themselves: the correct one satisfies
`s^e ≡ m (mod N)`, the faulty one doesn't.

---

## 4. The solve (Python)

```python
import re
from math import gcd

log = open('audit_log.txt').read()
vals = {v: int(re.search(rf'^\s*{v}\s*=\s*(0x[0-9a-fA-F]+)', log, re.M).group(1), 16)
        for v in ['N', 'e', 'signing_target', 'output_A', 'output_B', 'encrypted_report']}
N, e = vals['N'], vals['e']
m, c = vals['signing_target'], vals['encrypted_report']

for name, s in [('output_A', vals['output_A']), ('output_B', vals['output_B'])]:
    correct = pow(s, e, N) == m                # which output is valid?
    g = gcd(pow(s, e, N) - m, N)               # leak a factor
    print(name, 'valid signature:', correct,
          '| gcd bits:', g.bit_length(), '| nontrivial:', 1 < g < N)
    if 1 < g < N:                              # the glitched one
        p, q = g, N // g
        d = pow(e, -1, (p - 1) * (q - 1))
        rep = pow(c, d, N)
        print(rep.to_bytes((rep.bit_length() + 7) // 8, 'big').decode())
```

Output:

```
output_A valid signature: False | gcd bits: 1024 | nontrivial: True
output_B valid signature: True  | gcd bits: 2047 | nontrivial: False
r00t{f4ulty_s1gn4tur3_f4ct0rs_th3_m0dulus}
```

The message being signed was `SIGN:r00t-ctf-2024` (ASCII).

---

## 5. Key takeaways

1. **RSA-CRT signatures are extremely fault-sensitive.** A single-bit transient
   fault in `sp` or `sq` yields a "half-valid" signature that leaks one prime
   factor through `gcd(s^e − m, N)`. No side-channel, no timing — just one
   corrupted output.
2. **Never reuse a modulus after an anomalous signature.** Once any glitched
   signature (with its message) leaks, the key must be retired. The engineers
   "reran the job" — but the damage was already in the log.
3. **Defenses:** verify every signature before releasing it (check
   `s^e ≡ m mod N` — would have caught the fault), use fault countermeasures
   (recompute with randomized blinding, check consistency), or better: the HSM
   should validate internally before output.
4. For CTFs: when you see two signatures of the same message, immediately try
   `gcd(s₁^e − m, N)` and `gcd(s₂^e − m, N)` — one of them factors N.

---

*Challenge: Glitch in the Vault — PerfectRootCTF · Solved: 2026-07-31*
