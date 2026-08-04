---
title: "Copenhagen — PerfectRootCTF Writeup"
description: "Flag: r00t{sh0rtp4dd3lt4hunt}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{sh0rt_p4d_d3lt4_hunt}`

---

## 1. Challenge Overview

> *"Every transmission is unique. Replay is impossible. Two devices, two
> ciphertexts, zero information leakage."* — UnicastSec™ Security Bulletin

Cast Security™ encrypts firmware for each IoT device, blending a **per-
transmission nonce** into the plaintext so identical firmware yields different
ciphertexts. We captured two ciphertexts (same firmware, two devices, same
broadcast window) and the public encoding spec.

| Field | Description |
|---|---|
| `N`, `e` | RSA public key (e = 3, 1024-bit N) |
| `C_dev1` / `C_dev2` | Ciphertexts for device 1 / 2 (same plaintext) |

---

## 2. The encoding (`encoding_spec.py`)

```python
NONCE_BITS = 16
encoded = (plaintext << NONCE_BITS) | nonce    # nonce < 2^16
ciphertext = pow(encoded, 3, N)
```

The plaintext is shifted 16 bits and a random 16-bit nonce is OR'd into the
low bits. Device 1 and device 2 get:

```
m1 = 65536·m + n1     m2 = 65536·m + n2     (m1 and m2 differ only in low 16 bits)
C1 = m1³ mod N        C2 = m2³ mod N
```

---

## 3. The flaw: the ciphertexts never reach the modulus

The plaintext `m` (with flag) is ~225 bits, so:

```
encoded ≈ 241 bits   →   encoded³ ≈ 723 bits
N       = 1024 bits
```

`723 < 1024` → the `mod N` step is a **no-op**. Each ciphertext is the exact
integer cube of its encoded value, so one integer cube root per ciphertext
recovers everything — including the nonces.

---

## 4. The solve (Python)

```python
import re
from math import isqrt

log = open('capture.txt').read()
N, e, C1, C2 = (int(re.search(rf'^\s*{v}\s*=\s*(0x[0-9a-fA-F]+)', log, re.M).group(1), 16)
                for v in ['N', 'e', 'C_dev1', 'C_dev2'])

def iroot3(n):
    if n < 2:
        return n
    x = 1 << ((n.bit_length() + 2) // 3)
    while True:
        y = (2 * x + n // (x * x)) // 3
        if y >= x:
            break
        x = y
    return x

for name, c in [('C_dev1', C1), ('C_dev2', C2)]:
    enc = iroot3(c)                       # exact cube: no modular reduction
    assert enc**3 == c
    nonce = enc & 0xFFFF
    pt    = enc >> 16
    print(name, '| nonce =', nonce, '| plaintext bits =', pt.bit_length())
    print('   plaintext:', pt.to_bytes((pt.bit_length() + 7) // 8, 'big').decode())
```

Output:

```
C_dev1 | nonce = 13330 | plaintext bits = 225
   plaintext: r00t{sh0rt_p4d_d3lt4_hunt}
C_dev2 | nonce = 59064 | plaintext bits = 225
   plaintext: r00t{sh0rt_p4d_d3lt4_hunt}
```

Both devices received the same firmware — the flag names the intended-but-
unnecessary attack: a *short pad delta* hunt (Franklin–Reiter over the 2¹⁶
delta space).

---

## 5. Why this matters

1. **Nonces don't fix weak RSA.** A 16-bit nonce changes the low bits of the
   encoded value, but the encoded value is still tiny — the cube never wraps
   the modulus, so "unique ciphertexts" leak the exact plaintext structure.
2. **The size relationship is everything.** Encryption without modular wrap is
   just arithmetic; ensure the padded/encoded message occupies close to the
   full modulus width, and use randomized padding (OAEP).
3. Even without the exact-cube shortcut, the challenge's intended path
   (short-pad/Franklin-Reiter with unknown 16-bit delta) would still break:
   the delta space of 2¹⁶ is trivially searchable, and the resultant-based
   gcd would expose m1.
4. Recurring theme in this series (Trinity, Salvation, Copenhagen): tiny
   tweaks — padding, nonces — never survive contact with `e = 3`.

---

*Challenge: Copenhagen — PerfectRootCTF · Solved: 2026-07-31*
