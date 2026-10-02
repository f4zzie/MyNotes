# Safaricom CTF — Three Encores (Crypto, 300 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Crypto**, difficulty **300 pts**,
> and the target is `http://54.72.82.22:8420`. All commands and outputs below were
> captured live against that service.

## 1. Challenge Overview

"Three Encores" is a **300 pt crypto** challenge that gives you one JSON file,
`programme.json`, containing three "deliveries". Each delivery is a set of RSA
numbers `(n, e, c)`. The goal is to notice that the three deliveries share the same
small exponent **and the same ciphertext**, recover the original message, and submit
the `safctf{...}` value inside it to the service.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- **python3** — already on Kali. This challenge needs big-integer arithmetic, so a
  short explained script is genuinely required (you cannot compute 1536-bit `n`
  values reliably in a normal calculator).
- No account, no VPN. The service listens on a raw IP/port.
- **Time estimate:** 40–70 minutes for a beginner. The math is the hard part; the
  commands are trivial.

## 3. Reconnaissance

1. Fetch the landing page and the one download:

```bash
curl -s -i http://54.72.82.22:8420/ | head -5
curl -s http://54.72.82.22:8420/downloads/programme.json -o programme.json
```

Expected output (trimmed):

```http
HTTP/1.1 200 OK
Server: Werkzeug/3.1.9 Python/3.11.16
```

**Why this matters:** the page is titled **Three Encores** and offers a single
`programme.json`. "Encore" and "three" hint that the file has three related
entries — and that the repetition is the point.

[SCREENSHOT: the Three Encores landing page with its download link]

2. Pretty-print the JSON so you can read it:

```bash
python3 -m json.tool programme.json | head -30
```

Expected output (trimmed — your numbers will differ):

```json
{
  "deliveries": [
    {
      "n": "0x600db7eb...a0886402bbae23ed",
      "e": 3,
      "c": "0x15b1f932...df47cadeaddd65"
    },
    {
      "n": "0xb3e72b40...278971131fb",
      "e": 3,
      "c": "0x15b1f932...df47cadeaddd65"
    },
    {
      "n": "0x8069dc4e...8d718b21738c0",
      "e": 3,
      "c": "0x15b1f932...df47cadeaddd65"
    }
  ]
}
```

**Why this matters:** three observations jump out — the exponent is **`e = 3`** for
all three deliveries, the moduli `n` are **different**, and the ciphertext `c` is
**identical** in all three. That last one is the "value was reused" the hint warns
about, and it is the whole vulnerability.

3. Confirm the three ciphertexts match exactly (do not trust your eyes on truncated
   output):

```bash
python3 - <<'PY'
import json
d = json.load(open("programme.json"))["deliveries"]
print("moduli distinct:", len({x["n"] for x in d}) == 3)
print("ciphertexts identical:", len({x["c"] for x in d}) == 1)
print("exponent(s):", {x["e"] for x in d})
PY
```

Expected output:

```
moduli distinct: True
ciphertexts identical: True
exponent(s): {3}
```

**What to look for:** this confirms the three congruences
`m^3 = c (mod n1)`, `m^3 = c (mod n2)`, `m^3 = c (mod n3)` all describe **the same
message** `m`.

## 4. Identifying the Vulnerability

The vulnerability is a misuse of **RSA with a small exponent and no padding**, which
enables the **Håstad broadcast attack**.

Quick background: RSA encrypts a message `m` as `c = m^e mod n`. The modulus `n` is
huge, so normally "mod n" wraps the result and hides the message. But if the **same
message** is encrypted under the **same small exponent** with several different
moduli, there is a theorem (the Chinese Remainder Theorem, CRT) that lets you combine
the three ciphertexts into a single number equal to `m^3 mod (n1·n2·n3)`. Because
`n1·n2·n3` is *enormous* compared with `m^3` for a short message, the modular wrap
never happens — so you get `m^3` exactly, and a plain integer cube root gives `m`.

**Analogy:** imagine telling the same short secret to three people, each of whom
reports only "the secret times itself three times, minus a multiple of my personal
big number." If you ask all three, you can figure out the exact product because the
secret is small enough that none of their personal numbers actually mattered.

The sign that tipped me off during reconnaissance was the pair `e = 3` with an
**identical ciphertext** across three **different moduli** — a textbook broadcast
setup.

## 5. Exploitation Step by Step

1. **Understand the plan before running anything.**

   - Combine `[c, c, c]` over moduli `[n1, n2, n3]` with CRT to obtain `m^3`
     (mod `n1·n2·n3`). Since `m` is short, `m^3 < n1·n2·n3`, so this is the plain
     integer `m^3`.
   - Take the integer cube root. If it comes out exact (`root**3 == m3`), we have
     recovered `m`.
   - Print `m` as text.

   This work is pure big-integer arithmetic, so a short script is the only practical
   tool. Big integers are just "numbers too large for a normal calculator"; Python
   handles them natively.

2. **Run the recovery script.** Each block is commented so you can follow the math:

```bash
cd /tmp && python3 - <<'PY'
import json
from math import prod

# --- 1. Load the three (n, c) pairs -------------------------------------
d = json.load(open("programme.json"))["deliveries"]
ns = [int(x["n"], 16) for x in d]
c  = int(d[0]["c"], 16)          # same c in all three deliveries

# --- 2. CRT: combine x ≡ c (mod n_i) into one value mod prod(n_i) -------
# For two residues this is: x = c + n1 * k, solve k so it also fits mod n2.
def crt(residues, moduli):
    x, M = 0, prod(moduli)
    for r, m in zip(residues, moduli):
        Mi = M // m                       # product of the other moduli
        x = (x + r * Mi * pow(Mi, -1, m)) % M
    return x

m_cubed = crt([c, c, c], ns)

# --- 3. Exact integer cube root (no floats; they would lose precision) --
def icbrt(n):
    lo, hi = 0, 1
    while hi ** 3 <= n:
        hi *= 2
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if mid ** 3 <= n:
            lo = mid
        else:
            hi = mid - 1
    return lo

m = icbrt(m_cubed)
print("exact cube root:", m ** 3 == m_cubed)
print(m.to_bytes((m.bit_length() + 7) // 8, "big"))
PY
```

Expected output:

```
exact cube root: True
b'programme:safctf{dadb56ae-eede-422e-87cb-744462cdfda0}'
```

**What to look for:** `exact cube root: True` is the confirmation that the modular
wrap never happened (our CRT value *is* the true `m^3`). The bytes line shows the
message, with a `programme:` prefix and the `safctf{...}` value we need.

[SCREENSHOT: terminal showing "exact cube root: True" and the recovered message]

3. **Submit the recovered answer** to unlock the real flag:

```bash
curl -s -X POST http://54.72.82.22:8420/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"safctf{dadb56ae-eede-422e-87cb-744462cdfda0}"}'
```

Expected output:

```json
{"message":"safctf{0471ad15e84bb9f630e394e49dde85a9}","ok":true}
```

**What to look for:** `"ok":true` plus a *new* `safctf{...}` in `message`. That is
the final flag. A wrong answer returns `"ok":false`, so the gate is real.

### Advanced Alternative (optional)

If you want a single copy-paste block, here is the same recovery compressed. It is
optional; the commented version above is the one to learn from.

```python
import json
from functools import reduce
d = json.load(open("programme.json"))["deliveries"]
ns = [int(x["n"], 16) for x in d]; c = int(d[0]["c"], 16)
M = reduce(lambda a, b: a * b, ns)
x = sum(c * (M // m) * pow(M // m, -1, m) for m in ns) % M
r = int(round(x ** (1 / 3)))          # starting guess
while r ** 3 > x: r -= 1
while (r + 1) ** 3 <= x: r += 1
print(r.to_bytes((r.bit_length() + 7) // 8, "big"))
```

## 6. Capturing the Flag

Two values matter here:

- The **recovered message** from the JSON: `safctf{dadb56ae-eede-422e-87cb-744462cdfda0}`
- The **real flag** returned by `/submit`: `safctf{0471ad15e84bb9f630e394e49dde85a9}`

Paste the second one into the scoreboard.

## 7. Why This Works (Beginner Explanation)

RSA is normally safe because the modulus `n` is a number hundreds of digits long, so
`m^e mod n` wraps around and destroys the pattern. That protection only exists while
the wrap actually happens. Here the message is short, the exponent is only 3, and the
same message is sent three times under three different moduli. Combining the three
reports with CRT reconstructs `m^3` with no wrapping left, and a cube root finishes
the job. Small exponent + reused message + no padding = broken.

In the real world this is why modern RSA is never used "raw": it always uses
padding (OAEP) and a large public exponent (65537). The padding randomises each
ciphertext, so the same plaintext never produces the same ciphertext twice, which
defeats broadcast attacks. This class of bug has appeared in real products that
implemented their own crypto or chose `e = 3` for speed.

## 8. Common Mistakes and Dead Ends

- **Assuming a wrong `e`.** Read `e` from the JSON rather than assuming; it happens to
  be 3 here, but the attack requires a small exponent.
- **Only two moduli.** Håstad's broadcast attack needs `e` deliveries when the
  exponent is `e` — with `e = 3` you need **three**. Two is not enough.
- **Using floating-point cube roots.** A normal `x ** (1/3)` loses precision on huge
  numbers and gives off-by-one answers. Use the integer root loop, then verify
  `root ** 3 == m_cubed`.
- **Forgetting the `programme:` prefix.** The decrypted bytes are
  `programme:safctf{...}`; strip everything up to `safctf` when submitting.
- **Submitting the decrypted value instead of the `/submit` result.** The recovered
  `safctf{...}` opens the gate; the flag is in the `message` field.

## 9. How to Defend Against This

- **Never use raw RSA.** Always apply a proper padding scheme (OAEP for encryption).
- **Use a large public exponent** such as 65537; do not choose `e = 3` for speed.
- **Never encrypt the same plaintext with the same key and no randomisation** —
  padding must include fresh randomness each time.
- **Do not re-use a single message across multiple keys** when the sender controls
  the choice; avoid broadcast-style protocols built on textbook RSA.
- **Prefer vetted crypto libraries** and standard hybrid encryption (RSA-OAEP or
  ECIES to wrap a symmetric key) instead of hand-rolled schemes.

## 10. Key Takeaways

- `e = 3` + same ciphertext + different moduli = **Håstad's broadcast attack**.
- CRT combines congruences; the result is `m^e` with no modular reduction when the
  message is short.
- Always use an **integer** root, then verify with `root ** e == value`.
- Save to your cheatsheet:
  `python3 -c "import json;d=json.load(open('programme.json'))['deliveries'];print({x['e'] for x in d}, len({x['c'] for x in d}))"`
- **Recovered message:** `safctf{dadb56ae-eede-422e-87cb-744462cdfda0}`
- **Flag:** `safctf{0471ad15e84bb9f630e394e49dde85a9}`

You just used a real cryptanalytic attack — the math only *looked* scary. Take the
win.
