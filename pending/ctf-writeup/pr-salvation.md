---
title: "Broadcast II (Salvation) — PerfectRootCTF Writeup"
description: "Flag: r00t{p4dd1ngd035nts4v3y0ufr0mh4st4d}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{p4dd1ng_d035nt_s4v3_y0u_fr0m_h4st4d}`

---

## 1. Challenge Overview

> *"We added padding. We're safe now."* — ArmourBit Security Advisory, marked RESOLVED

The sequel to **Trinity**: after the Håstad broadcast break, ArmourBit patched the
server to add per-device-class padding before RSA encryption (e = 3, same
firmware image to all classes). We have the patched source and three captured
ciphertexts. Recover the firmware.

| File | Description |
|---|---|
| `firmware_server.py` | The "patched" distribution server |
| `device_{A,B,C}.pub` | RSA public keys (e = 3, ~1280-bit N) |
| `firmware_{A,B,C}.enc` | Padded firmware encrypted per class |

---

## 2. The "fix" (`firmware_server.py`)

```python
PADDING_BASE = 256

def pad_firmware(firmware_int, device_class):
    padded = device_class * PADDING_BASE + firmware_int   # linear padding!
    return padded

# class A: m + 256      class B: m + 512      class C: m + 768
```

The padding is a **small linear offset** added to the message. The claim: "each
class now receives a uniquely offset firmware integer, defeating a naive
broadcast attack that assumes identical inputs."

**Flaw 1 — the offset is tiny.** `m` is a ~345-bit firmware integer; adding 256,
512, or 768 changes almost nothing about its size.

**Flaw 2 — the padding doesn't even reach the modulus.** The math that matters:

```
C_i = (m + 256·i)³  mod N_i
```

If `(m + 256·i)³ < N_i`, the `mod N_i` operation is a **no-op** — the
ciphertext is an exact integer cube. Here:

```
m ≈ 345 bits  →  (m + 768)³ ≈ 1033 bits
N ≈ 1279 bits
```

`1033 < 1279` → **every ciphertext is an exact cube.** The "defeated" broadcast
attack is back, and this time you don't even need the CRT.

---

## 3. The solve (Python)

```python
from Crypto.PublicKey import RSA
import base64

def iroot3(n):
    """Exact integer cube root via Newton's method."""
    if n < 2:
        return n
    x = 1 << ((n.bit_length() + 2) // 3)
    while True:
        y = (2 * x + n // (x * x)) // 3
        if y >= x:
            break
        x = y
    return x

for letter, offset in zip('ABC', (256, 512, 768)):
    pub = RSA.import_key(open(f'device_{letter}.pub').read())
    c   = int.from_bytes(base64.b64decode(open(f'firmware_{letter}.enc').read()), 'big')
    root = iroot3(c)
    assert root**3 == c, "not an exact cube"          # the attack condition
    m = root - offset
    print(m.to_bytes((m.bit_length() + 7) // 8, 'big').decode())
```

Output (identical for all three classes):

```
r00t{p4dd1ng_d035nt_s4v3_y0u_fr0m_h4st4d}
```

---

## 4. Why this matters

1. **Padding size must be tuned against the modulus.** A linear padding of
   256·i on a 345-bit message under a 1279-bit modulus with e=3 keeps the
   padded cube below N — no wrap, exact cube, instant recovery.
2. **Deterministic RSA encryption of a low-entropy/known message is broken
   regardless of padding.** The real fix is **randomized padding** (OAEP),
   where each ciphertext gets fresh randomness, not a fixed offset.
3. **"Unique ciphertexts" ≠ "secure".** The advisory's stated goal (no two
   identical ciphertexts) does nothing about recovering the plaintext.
4. Same key parameters as the previous release (e=3) — the audit missed that
   the exponent was the real problem, not the message sharing.

---

*Challenge: Broadcast II (Salvation) — PerfectRootCTF · Solved: 2026-07-31*
