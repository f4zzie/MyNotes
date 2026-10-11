---
title: "Related Party — PerfectRootCTF Writeup"
description: "Flag: r00t{fr4nkl1nr31t3rr3l4t3dm3ss4g3s}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{fr4nkl1n_r31t3r_r3l4t3d_m3ss4g3s}`

---

## 1. Challenge Overview

> *"Each regional endpoint receives a cryptographically distinct ciphertext.
> Reuse is architecturally impossible."*

RouteSecure™ encrypts a message for delivery, but applies a "regional
adjustment" before re-encrypting for the regional endpoint. The transcript
contains two ciphertexts derived from the **same source message** — and the
routing module documenting the adjustment is public.

| Field | Meaning |
|---|---|
| `N`, `e` | RSA public key (e = 3) |
| `C1` | `m^e mod N` — originating endpoint |
| `C2` | `(m + offset)^e mod N` — EU-WEST regional delivery |

The file is titled "Déjà Vu" — two ciphertexts, related plaintexts.

---

## 2. The scheme (`message_router.py`)

```python
REGION_OFFSETS = {
    "EU-WEST":    (2**65 - 49),     # known, public parameter!
    ...
}

def adjust(self, plaintext_int):
    return (plaintext_int + self.offset) % self.N

C1 = m^e mod N
C2 = (m + offset)^e mod N        # same message, shifted by a KNOWN constant
```

The "regional adjustment" is a **linear shift in the plaintext domain** with a
**documented, public offset**. This is the textbook setup for the
**Franklin–Reiter related-message attack**.

---

## 3. The math

We know `e = 3`, the offset `a = 2⁶⁵ − 49`, and:

```
C1 = m³      (mod N)
C2 = (m+a)³  (mod N)
```

Both `m` and `m+a` are roots of two polynomials:

```
f(x) = x³ − C1
g(x) = (x+a)³ − C2
```

Both polynomials have `x − m` as a factor in `Z_N[x]` (substitute `x = m`:
`f(m) = m³ − C1 ≡ 0`, `g(m) = (m+a)³ − C2 ≡ 0`).

Franklin–Reiter's key observation: since `gcd(e, ...) = 1` conditions are met
(e = 3, and the shift `a` is coprime to N), the polynomial GCD

```
gcd( x³ − C1 , (x+a)³ − C2 )   over  Z_N[x]
```

is **exactly** the linear factor `x − m`. Its root is the plaintext.

> Why it works: if the gcd had a common root other than `m`, the attack
> conditions would collapse — with `e` prime to N's group orders and `a`
> invertible, the two polynomials share only `x − m`.

---

## 4. The solve (Python)

Polynomials are coefficient lists, ascending degree. Division by a **monic**
polynomial works over any ring, so Euclid's algorithm runs fine in `Z_N[x]`:

```python
import re

log  = open('intercept.txt').read()
N, e, C1, C2 = (int(re.search(rf'^\s*{v}\s*=\s*(0x[0-9a-fA-F]+)', log, re.M).group(1), 16)
                for v in ['N', 'e', 'C1', 'C2'])
a = 2**65 - 49                       # EU-WEST offset (public)

# f(x) = x^3 - C1 ;  g(x) = (x+a)^3 - C2
f = [(-C1) % N, 0, 0, 1]
g = [(a**3 - C2) % N, (3*a*a) % N, (3*a) % N, 1]

def poly_divmod(A, B, N):
    """Divide A by monic B over Z_N. Returns (quotient, remainder)."""
    A = list(A)
    while len(A) >= len(B) and A:
        lead = A[-1]
        deg  = len(A) - len(B)
        for i in range(len(B)):
            A[i + deg] = (A[i + deg] - lead * B[i]) % N
        while A and A[-1] == 0:
            A.pop()
    return [], A

def poly_gcd(A, B, N):
    A, B = list(A), list(B)
    while B:
        lc = B[-1]
        inv = pow(lc, -1, N)         # make divisor monic
        B = [(c * inv) % N for c in B]
        _, r = poly_divmod(A, B, N)
        A, B = B, r
    return A

gcd = poly_gcd(f, g, N)              # degree 1: c0 + c1*x
m = (-gcd[0] * pow(gcd[1], -1, N)) % N

assert pow(m, 3, N)      == C1       # verification
assert pow(m + a, 3, N)  == C2

print(m.to_bytes((m.bit_length() + 7) // 8, 'big').decode())
```

Output:

```
r00t{fr4nkl1n_r31t3r_r3l4t3d_m3ss4g3s}
```

Verified: `m³ ≡ C1 (mod N)` and `(m+a)³ ≡ C2 (mod N)` ✓

---

## 5. Key takeaways

1. **Linear "adjustments" in the plaintext domain are not adjustments at all.**
   A known affine relationship between two plaintexts (here `m` and `m + a`)
   lets an attacker recover both from just the ciphertexts — Franklin–Reiter
   works for any small `e` with known related messages.
2. **Deterministic RSA without randomization is broken by construction.** Each
   encryption must be randomized (OAEP, etc.) so that even identical messages
   produce unrelated ciphertexts.
3. **Documenting security parameters publicly** (the "regional offsets") — when
   the scheme is flawed — gives attackers the last missing piece. Here the
   offset `a` was right in the source.
4. The flag's own name says it: *frankl1n_r31t3r_r3l4t3d_m3ss4g3s*.

---

*Challenge: Related Party (Déjà Vu) — PerfectRootCTF · Solved: 2026-07-31*
