---
title: "Shared Grounds — PerfectRootCTF Writeup"
description: "Flag: r00t{c0mm0ngr0und1sd4ng3r0ust3rr1t0ry}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{c0mm0n_gr0und_1s_d4ng3r0us_t3rr1t0ry}`

---

## 1. Challenge Overview

> *KeyCorp runs a multi-tenant document encryption platform... A network tap
> caught two encrypted versions of the same classified memo — one sent to
> Department A, one to Department B.*

| File | Description |
|---|---|
| `infrastructure.py` | KeyCorp's leaked key-management source |
| `dept_a.pem` / `dept_b.pem` | Department A/B RSA public keys |
| `dept_a.b64` / `dept_b.b64` | Two encryptions of the **same** memo |

Goal: recover the memo `m` given `c_A = m^eA mod N` and `c_B = m^eB mod N`.

---

## 2. Recon: reading the source

`infrastructure.py` reveals the design:

```python
MODULUS_BITS  = 2048
EXPONENT_BITS = 17          # exponents are 17-bit primes

def generate_modulus(...):  # p, q fresh; N = p*q, one modulus per pool
def issue_exponent_pair(phi_N, bits=EXPONENT_BITS):
    while True:
        e = getPrime(bits)          # random 17-bit prime exponent
        if GCD(e, phi_N) == 1:
            d = inverse(e, phi_N)
            return e, d
```

**The fatal design flaw:** the `KeyManager` keeps a **single shared modulus `N`**
(`self._N`, loaded once from a pool) and issues *different exponents* `e` to
each department:

```python
e, d = issue_exponent_pair(self._phi)   # same phi, same N for everyone
```

Each department encrypts with the **same N** but its own `e`. When the same
plaintext `m` is encrypted under two different public exponents, the plaintext
can be recovered **without factoring N** — this is the **common modulus attack**.

---

## 3. Confirming the setup

```python
from Crypto.PublicKey import RSA
import base64

pubA = RSA.import_key(open('dept_a.pem').read())
pubB = RSA.import_key(open('dept_b.pem').read())

print(pubA.n == pubB.n)        # True  — same 2048-bit modulus!
print(pubA.e, pubB.e)          # 94543, 82231  (17-bit primes)
from math import gcd
print(gcd(pubA.e, pubB.e))     # 1  — coprime exponents
```

- `N` is identical for both departments
- `e_A = 94543`, `e_B = 82231`, `gcd = 1`

This is exactly the common modulus attack's precondition.

---

## 4. The math: why the attack works

We have:

```
c_A = m^eA mod N
c_B = m^eB mod N
```

Since `gcd(e_A, e_B) = 1`, Bézout's identity guarantees integers `a, b` with:

```
a · e_A + b · e_B = 1
```

Raise the ciphertexts to those powers and multiply:

```
c_A^a · c_B^b  ≡  (m^eA)^a · (m^eB)^b
               ≡  m^(a·eA + b·eB)
               ≡  m^1
               ≡  m        (mod N)
```

Done — the plaintext falls out directly. One of `a, b` will be negative;
a negative exponent means the modular inverse (`c^(-|x|) = (c⁻¹)^|x| mod N`).

For this key pair: `32493·94543 − 37358·82231 = 1`, i.e. `a = 32493, b = −37358`.

---

## 5. The solve (Python)

```python
from Crypto.PublicKey import RSA
import base64

pubA = RSA.import_key(open('dept_a.pem').read())
pubB = RSA.import_key(open('dept_b.pem').read())
N, eA, eB = pubA.n, pubA.e, pubB.e

cA = int.from_bytes(base64.b64decode(open('dept_a.b64').read()), 'big')
cB = int.from_bytes(base64.b64decode(open('dept_b.b64').read()), 'big')

def egcd(x, y):                       # extended Euclid: returns (g, a, b)
    if y == 0:
        return x, 1, 0
    g, s, t = egcd(y, x % y)
    return g, t, s - (x // y) * t

g, a, b = egcd(eA, eB)                # a*eA + b*eB = gcd(eA, eB) = 1
assert g == 1

# cB^b with negative b  ->  (cB⁻¹)^|b|
m = (pow(cA, a, N) * pow(pow(cB, -1, N), -b, N)) % N

# verification: m must re-encrypt to both ciphertexts
assert pow(m, eA, N) == cA
assert pow(m, eB, N) == cB

flag = m.to_bytes((m.bit_length() + 7) // 8, 'big')
print(flag.decode())
```

Output:

```
r00t{c0mm0n_gr0und_1s_d4ng3r0us_t3rr1t0ry}
```

---

## 6. Key takeaways

1. **Never reuse a modulus across keys** when the same message might be
   encrypted under multiple exponents. The common modulus attack breaks it
   completely — no factorization required.
2. **Audit key-management infrastructure:** a "shared pool" design that issues
   (N, e) pairs from one modulus is a textbook vulnerability. Each key pair
   needs its own N (i.e., its own p, q).
3. **Bézout's identity is a Swiss-army knife in crypto:** any time you hold two
   encryptions of the same message under coprime exponents and a shared modulus,
   the plaintext is one `egcd` away.
4. The `\x01\x00` prefix in the plaintext is challenge-author formatting
   padding; the flag is the content between braces.

---

*Challenge: Shared Grounds — PerfectRootCTF · Solved: 2026-07-31*
