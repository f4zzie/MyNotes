---
title: "Trinity — PerfectRootCTF Writeup"
description: "Flag: r00t{h4st4dbr04dc4ststr1pl3th3fun}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{h4st4d_br04dc4sts_tr1pl3_th3_fun}`

---

## 1. Challenge Overview

> *"One image. Three device classes. Zero padding."*

ArmourBit distributes the **same firmware image** to all device classes,
encrypting it for each class with that class's RSA key. We captured three
encrypted packages (`firmware_A/B/C.enc`) and three public keys
(`device_A/B/C.pub`).

| File | Contents |
|---|---|
| `key_spec.txt` | ArmourBit's public key specification |
| `device_{A,B,C}.pub` | RSA public keys for the three device classes |
| `firmware_{A,B,C}.enc` | The **same** message encrypted for each class |

---

## 2. Recon: what the spec tells us

`key_spec.txt` is the smoking gun:

```
Exponent   3    Hardware constraint... e=3 burnt into OTP.
...
C = M^e mod N        (e = 3 for all Type-I devices)
The same firmware image M is sent to all enrolled device classes...
There is no per-device padding or randomisation applied before encryption.
```

- `e = 3` for **all** device classes (confirmed: `e == 3` for A, B, C)
- The **same message `M`** encrypted to each
- **No padding** — textbook RSA

This is the textbook setup for **Håstad's broadcast attack**.

---

## 3. The attack: why 3 is a crowd

We hold three equations in one unknown `M`:

```
c_A = M^3 mod N_A
c_B = M^3 mod N_B
c_C = M^3 mod N_C
```

The Chinese Remainder Theorem lets us find a value `x` such that:

```
x ≡ c_A (mod N_A)    x ≡ c_B (mod N_B)    x ≡ c_C (mod N_C)
```

By CRT uniqueness, `x ≡ M^3 (mod N_A·N_B·N_C)`.

Now the crucial bound: if the message is smaller than each modulus
(`M < min(N_A, N_B, N_C)`, true for firmware payloads), then:

```
M^3 < N_A · N_B · N_C
```

So `M^3` is the **least non-negative representative** of `x` — i.e.,
`x = M^3` as a plain integer, not just a residue. Take the integer cube root:

```
M = ∛x
```

Done. One CRT + one cube root = the plaintext. **e ciphertexts recover the
message whenever `e` recipients share a padded-less message** — a single
broadcast is enough; you don't need to factor any modulus.

> With e = 3 and only 2 ciphertexts you can't do this directly (M³ could
> wrap around N_A·N_B) — you need `k ≥ e` recipients. Here we have exactly 3.

---

## 4. The solve (Python)

```python
from Crypto.PublicKey import RSA
import base64

# Load keys and ciphertexts
keys, cs = [], []
for letter in 'ABC':
    pub = RSA.import_key(open(f'device_{letter}.pub').read())
    c   = int.from_bytes(base64.b64decode(open(f'firmware_{letter}.enc').read()), 'big')
    keys.append(pub); cs.append(c)

Na, Nb, Nc = [k.n for k in keys]
ca, cb, cc = cs
assert all(k.e == 3 for k in keys)          # low exponent confirmed

# CRT: x = M^3 mod (Na*Nb*Nc)
Mprod = Na * Nb * Nc
M1, M2, M3 = Mprod // Na, Mprod // Nb, Mprod // Nc
x = (ca * M1 * pow(M1, -1, Na) +
     cb * M2 * pow(M2, -1, Nb) +
     cc * M3 * pow(M3, -1, Nc)) % Mprod

# Exact integer cube root (Newton's method on integers)
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

m = iroot3(x)
assert m**3 == x                             # perfect cube -> message recovered

flag = m.to_bytes((m.bit_length() + 7) // 8, 'big')
print(flag.decode())
```

Output:

```
r00t{h4st4d_br04dc4sts_tr1pl3_th3_fun}
```

Verified against all three public keys: `pow(m, 3, N_A) == c_A`,
`pow(m, 3, N_B) == c_B`, `pow(m, 3, N_C) == c_C` ✓

---

## 5. Key takeaways

1. **Small exponents + broadcast = disaster.** If the same unpadded message is
   sent to `e` or more recipients with the same small exponent, the plaintext
   is recovered by CRT + integer root — no factoring involved.
2. **Padding exists for a reason.** PKCS#1 v1.5 / OAEP randomize each
   encryption so broadcasts aren't equivalent; Håstad's attack is why.
3. **Read the spec.** `e=3`, "no padding", "same image to all classes" — the
   spec practically names the attack for you.
4. Watch out for implementation traps: use an **exact integer cube root**
   (Newton's method), not float `n ** (1/3)` — float precision loses ~2^970
   worth of exactness on 3072-bit numbers and the correction loop never
   terminates.

---

*Challenge: Trinity — PerfectRootCTF · Solved: 2026-07-31*
