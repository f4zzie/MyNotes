---
title: "Blind Spot — PerfectRootCTF Writeup"
description: "Flag: r00t{bl1nds1gn4tur3s4r3n0ts0bl1nd}"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag:** `r00t{bl1nd_s1gn4tur3s_4r3_n0t_s0_bl1nd}`

---

## 1. Challenge Overview

> *"SignBot processes thousands of signing requests per day. It has never
> signed an unauthorized document."*

SignBot is an HSM-backed signing service that applies a per-session **mask** to
document hashes before signing. A leaked session log shows a restricted
document hash was signed anyway. We must reconstruct the **authorization
payload** (the document hash the bot actually signed) and decode the flag.

| Field | Meaning |
|---|---|
| `N`, `e` | RSA public key |
| `session_nonce` | masked input that was actually submitted to the HSM |
| `unmask_token` | per-session value logged for audit |
| `bot_response` | HSM output for this session |

---

## 2. Understanding the protocol (`signbot.py`)

```python
def prepare(self, document_hash: int):
    mask = random.randrange(2, self.N)
    masked_input  = pow(mask, self.e, self.N) * document_hash % self.N
    unmask_token  = inverse(mask, self.N)
    return masked_input, unmask_token

def hsm_sign(self, value: int):
    return pow(value, self.d, self.N)         # d is secret

def recover_signature(bot_response, unmask_token, N):
    return bot_response * unmask_token % N    # strip the mask
```

So for a document hash `h`:

```
masked_input = mask^e · h  (mod N)     ← what gets sent to the HSM
bot_response = masked_input^d          = (mask^e · h)^d
             = mask^(e·d) · h^d        = mask · h^d  (mod N)   since e·d ≡ 1 (mod φ(N))
signature    = bot_response · mask⁻¹  = h^d  (mod N)           the true signature
```

The "mask" is pure theater: it's a multiplicative blinding factor. RSA is a
multiplicative cipher, so masks *survive* the signing operation — the HSM
computes `h^d` regardless of the mask, and the mask cancels out algebraically.

---

## 3. The attack: RSA blinding (and unblinding)

The service was *configured to refuse* signing the restricted hash. But the
protocol is blind: the bot signs **whatever masked value** it receives, and
the client (or a malicious caller) can:

1. Take a forbidden hash `h`
2. Blind it: `h' = r^e · h (mod N)` for random `r` (here the service's own
   masking does this with `r = mask`)
3. Get the bot to sign `h'` → `s' = (h')^d = r · h^d (mod N)`
4. Unblind: `h^d = s' · r⁻¹ (mod N)` — a valid signature on `h`!

The bot "never signed an unauthorized document" — but it signed an
*authorized-looking* (masked) value whose signature **is** the unauthorized one.

---

## 4. Reconstructing the payload from the log

We don't have `mask`, but we have `unmask_token = mask⁻¹`. Because RSA
exponentiation is multiplicative:

```
session_nonce  = mask^e · h            (mod N)
⇒ h             = session_nonce · mask^(-e)
                = session_nonce · unmask_token^e   (mod N)
```

Similarly, the true signature on the forbidden hash:

```
signature = bot_response · unmask_token  (mod N)
```

And the whole thing verifies with the public key.

---

## 5. The solve (Python)

```python
import re

log = open('session_log.txt').read()
vals = {}
for name in ['N', 'e', 'session_nonce', 'unmask_token', 'bot_response']:
    m = re.search(rf'^\s*{name}\s*=\s*(0x[0-9a-fA-F]+)', log, re.M)
    vals[name] = int(m.group(1), 16)

N, e    = vals['N'], vals['e']
nonce   = vals['session_nonce']
unmask  = vals['unmask_token']
resp    = vals['bot_response']

# 1. Reconstruct the masked (forbidden) document hash:
#    nonce = mask^e · h  ⇒  h = nonce · (mask⁻¹)^e = nonce · unmask^e
h = nonce * pow(unmask, e, N) % N

# 2. Reconstruct the true signature the bot was 'incapable' of producing:
#    resp = (mask^e·h)^d = mask · h^d  ⇒  h^d = resp · mask⁻¹ = resp · unmask
sig = resp * unmask % N

# 3. Verify: a valid RSA signature satisfies sig^e ≡ h (mod N)
assert pow(sig, e, N) == h
print('signature valid!')

payload = h.to_bytes((h.bit_length() + 7) // 8, 'big')
print(payload.decode())
```

Output:

```
signature valid!
r00t{bl1nd_s1gn4tur3s_4r3_n0t_s0_bl1nd}
```

---

## 6. Key takeaways

1. **RSA blinding ≠ security.** A multiplicative mask over RSA never changes
   what the signer effectively signs: `(m·r^e)^d = m^d · r`. Any scheme that
   "masks" inputs before an RSA private-key operation is vulnerable to the
   unblinding attack unless the signature is separately protected (e.g.,
   with a proof of knowledge of the underlying hash, or by hashing the message
   with a domain separator inside the HSM).
2. **Signing services must be non-blind:** the HSM should sign only a
   canonical, authenticated value it can itself verify — never a caller-
   supplied opaque blob.
3. **In the log:** everything needed to undo the mask was right there —
   `unmask_token = mask⁻¹` makes both the hash and the signature recoverable
   with two modular exponentiations.
4. The `\x01\x00` prefix is the challenge author's plaintext-formatting padding;
   the flag is the content between braces.

---

*Challenge: Blind Spot — PerfectRootCTF · Solved: 2026-07-31*
