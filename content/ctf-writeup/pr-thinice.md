---
title: "Thin Ice — PerfectRootCTF Writeup"
description: "Flag: r00t{sp11tk3yw13n3rh4rdw4r3l3ak}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{sp11t_k3y_w13n3r_h4rdw4r3_l3ak}`

---

## 1. Challenge Overview

> *"Our hardware does the heavy lifting. Your secrets are safe."*

FastCrypt sells HSM (Hardware Security Module) appliances. A whistleblower leaked
their key-generation source code, plus a public key, a device config file, and an
intercepted ciphertext from a production unit. We must recover the plaintext flag.

| File | What it is |
|---|---|
| `keygen.py` | FastCrypt's leaked RSA key-generation source |
| `public.pem` | RSA public key `(N, e)` from the target unit |
| `device.cfg` | Device config from the key-management server |
| `encrypted.b64` | Base64-encoded ciphertext (one RSA block) |

---

## 2. Background: RSA in 2 minutes

RSA encryption works like this:

- Pick two (or more) primes, multiply them into a modulus: `N = p * q * r`
- Compute `phi(N) = (p-1) * (q-1) * (r-1)` (Euler's totient — counts numbers
  coprime to N)
- Choose a **public exponent** `e` and a **private exponent** `d` such that:
  ```
  e * d ≡ 1 (mod phi(N))        "≡" means: congruent — e*d and 1 differ by a
                                multiple of phi(N).  In other words:
  e * d = 1 + k * phi(N)        for some integer k
  ```
- Encrypt: `c = m^e mod N` — anyone can do this (e and N are public)
- Decrypt: `m = c^d mod N` — only the holder of the private exponent d can do this

The security of RSA rests on: **you cannot recover d from (N, e) without
factoring N**, and factoring a large N is computationally infeasible.

This challenge's whole premise — "Split-Key RSA" with a **small d** and a
**leaked prime p** — destroys that security in a spectacular way.

---

## 3. Recon: Reading the files

### 3.1 `keygen.py` — the leaked source

Reading the source (and its docstring), we learn:

1. **Three-prime modulus:** `N = p * q * r`
   - `p` — a **128-bit** "system prime", burned into the unit's OTP flash at
     manufacture, **shared across all units in a production batch**, and
     **exposed to the key management server** (see `device.cfg: hw_device_id`).
   - `q, r` — **256-bit** "session primes", generated fresh per key, never
     leave the HSM.
2. **A hard hardware limit on the private exponent:**
   ```python
   HARDWARE_EXPONENT_BOUND = 2 ** 120
   ...
   d = random.randrange(lo, hi)    # lo = 2^119, hi = 2^120 - 1
   ```
   So `d` is at most 120 bits, chosen in `[2^119, 2^120)`.
3. The public exponent is derived from d: `e = inverse(d, phi)` — i.e.
   `e * d ≡ 1 (mod phi(N))`.

**Already suspicious:** a private exponent of only 120 bits is *tiny*. This
instantly smells like a small-private-exponent attack (Wiener's attack). But
read on — there's an even more devastating shortcut here.

### 3.2 `public.pem` — the public key

Parsing the PEM:

```
N  — 638-bit modulus   (3 primes: 128 + 256 + 256 ≈ 640 bits ✓)
e  — 511-bit public exponent
```

### 3.3 `device.cfg` — the leak within the leak

```
hw_device_id = 0x910e4130380ead292217fc70bd714929
```

That's a 128-bit hex value — exactly the size of the "system prime" `p`.
And the docstring in `keygen.py` tells us `p` is *deliberately exposed* to the
key management server ("see device.cfg: hw_device_id"). So:

```python
p = 0x910e4130380ead292217fc70bd714929
```

### 3.4 `encrypted.b64` — the ciphertext

80 bytes = 640-bit space, one single RSA block:
`c = m^e mod N`.

---

## 4. The Vulnerability: why this design is broken

### Step 1 — The small exponent d

`d < 2^120`. This is the classic setup for **Wiener's attack**, which recovers
`d` from the continued fraction expansion of `e/N` when
`d < N^(1/4)/3`. Here `N^(1/4)` is about `2^160`, so `d ≈ 2^120` is well within
range. (The flag literally hints at this: `...w13n3r...`.)

### Step 2 — The leaked prime p is far more fatal

Remember the fundamental RSA relation:

```
e * d = 1 + k * phi(N)
```

with `phi(N) = (p - 1)(q - 1)(r - 1)`.

Now, `(p - 1)` **divides** `phi(N)` exactly — it's one of its three factors.
Therefore the whole equation is also true **modulo (p-1)**:

```
e * d ≡ 1  (mod p - 1)
```

This congruence alone pins down `d` — *provided d is small enough*:

- `d < 2^120` (hardware limit from `keygen.py`)
- `p - 1` is a 128-bit number, so `p - 1 ≥ 2^127`
- `2^120 < 2^127`, therefore **`d < p - 1`**

But `e * d ≡ 1 (mod p-1)` says `d ≡ e^{-1} (mod p-1)`, and the solution of a
congruence modulo `m` is **unique in the range `[0, m)`**. Since `d` is smaller
than `p - 1`, it IS that unique solution:

```
d = e^{-1}  mod (p - 1)      ← exactly, no guessing, no search, no Wiener CF
```

**That's it.** The 120-bit hardware "security" bound combined with the leaked
128-bit system prime means we can compute the private exponent with a single
modular inverse. The HSM's "heavy lifting" hardware did nothing to help.

> Why this fails: the "split" design splits the *modulus* into primes but only
> exposes the *smallest* piece of information that completely destroys the key.
> Any one factor of `phi(N)` being leakable + a small `d` = total key recovery.
> The correct design would use a full-size `d` (like `e = 65537`, `d` ≈ N), so
> that leaking `p` alone doesn't recover `d`.

---

## 5. The Solution (Python)

```python
#!/usr/bin/env python3
import base64
from Crypto.PublicKey import RSA

# 1. Load the public key (N, e)
pub  = RSA.import_key(open('public.pem').read())
N, e = pub.n, pub.e

# 2. The "system prime" leaked in device.cfg as hw_device_id
p = 0x910e4130380ead292217fc70bd714929
assert N % p == 0          # sanity check: p really divides N

# 3. Load the ciphertext
c = int.from_bytes(base64.b64decode(open('encrypted.b64').read()), 'big')

# 4. THE ATTACK:
#    e*d ≡ 1 (mod phi(N))  and  (p-1) | phi(N)  =>  e*d ≡ 1 (mod p-1)
#    d < 2^120 < p-1  =>  d is uniquely e^{-1} mod (p-1)
d = pow(e, -1, p - 1)      # Python 3.8+ modular inverse

# 5. Decrypt: m = c^d mod N
m = pow(c, d, N)
assert pow(m, e, N) == c   # sanity check: round-trips to the same ciphertext

# 6. Convert the integer back to bytes and print
flag = m.to_bytes((m.bit_length() + 7) // 8, 'big')
print(flag.decode())
```

Output:

```
r00t{sp11t_k3y_w13n3r_h4rdw4r3_l3ak}
```

---

## 6. Step-by-step "why the code works"

1. `RSA.import_key(...)` parses the PEM into the modulus `N` and exponent `e`.
2. We read `p` straight out of `device.cfg` — the challenge handed us one of the
   three prime factors, *by design* ("exposed to the key management server").
3. `pow(e, -1, p - 1)` computes the modular inverse of `e` modulo `p - 1`.
   Because of the math in §4, this value **is** the secret `d`.
4. `pow(c, d, N)` does modular exponentiation: `c^d mod N = m`. This is the
   exact same operation the HSM performs in hardware — we just do it in software.
5. The integer `m` is turned back into bytes; the `\x01\x00` prefix is leftover
   padding from the challenge's plaintext formatting, and the flag follows.

---

## 7. Lessons Learned

1. **A small private exponent `d` is catastrophic.** RSA is only secure when
   `d` is almost as large as `N`. Bounds like "d < 2^120" are not a feature —
   they are an invitation to Wiener's attack (and worse).
2. **Leaking even one prime factor of N is fatal** when combined with a small
   exponent — a single modular inverse recovers the whole private key.
3. **Read every file carefully.** The vulnerability was hiding in plain sight:
   `device.cfg` literally contains the hex of `p`, and `keygen.py`'s docstring
   tells you it's shared and exposed.
4. **Always audit crypto implementations** — custom "proprietary" schemes
   ("Split-Key RSA") are virtually always weaker than standard, well-tested
   ones. Use standard RSA with `e = 65537` and a full-size `d`.

---

*Challenge: Thin Ice — PerfectRootCTF · Solved: 2026-07-31*
