---
title: "Trusted Courier — Writeup"
description: "Challenge: Trusted Courier (crypto series, tier 1/4, difficulty: easy)"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Challenge:** Trusted Courier (crypto series, tier 1/4, difficulty: easy)
**Category:** Cryptography — SHA-256 Length Extension Attack (secret-prefix MAC)
**Target:** `labs-intervarsity.ctfzone.com:30008`
**Flag:** `r00t{l3ngth_3xt3nsi0n_str1k3s_ag41n}`

---

## 1. Story / Goal

> HQ-Dispatch runs a courier manifest authority. Every manifest that reaches a
> warehouse is stamped with an authentication tag so staff can trust it hasn't
> been tampered with in transit. Standard manifests only ever carry standard
> clearance — vault release requires a manifest explicitly marked with special
> authorization, and only HQ-Dispatch is supposed to be able to produce one of
> those. You've intercepted a live, currently-valid manifest and its tag. Can
> you get the warehouse to release the vault anyway?

In short: we are given a **valid (secret-prefix MAC) tagged message** and we must
forge a *new* message that (a) still passes MAC verification and (b) contains the
exact text `AUTH:VAULT-RELEASE=TRUE`.

---

## 2. Reconnaissance

The service is an HTTP server on `labs-intervarsity.ctfzone.com:30008`.
Fetching the root page (`GET /`) reveals a "Manifest authentication service"
with two endpoints:

| Method | Path        | Purpose                                                                 |
|--------|-------------|-------------------------------------------------------------------------|
| GET    | `/manifest` | Returns the currently valid manifest (plain + hex) and its auth tag.     |
| POST   | `/verify`   | Body `{"message_hex": "...", "tag": "..."}` — checks the MAC and answers |
|        |             | whether the manifest is valid and whether it authorizes vault release.   |

### Step 1 — fetch the live manifest

```
$ curl http://labs-intervarsity.ctfzone.com:30008/manifest
```

```json
{
  "message": "COURIER-MANIFEST|FROM:HQ-DISPATCH|TO:WAREHOUSE-07|PACKAGE:PX-8823|ITEMS:14|STATUS:PENDING-REVIEW|CLEARANCE:STANDARD",
  "message_hex": "434f55524945522d4d414e49464553547c46524f4d3a48512d44495350415443487c544f3a57415245484f5553452d30377c5041434b4147453a50582d383832337c4954454d533a31347c5354415455533a50454e44494e472d5245564945577c434c454152414e43453a5354414e44415244",
  "note": "This manifest is authenticated with a keyed tag: tag = SHA256(secret_key || message). The secret key is held only by HQ-Dispatch.",
  "tag": "be235dc331a2578c31293662a2fde0171c82871880dc1e930c25dfecb0991218"
}
```

The `note` field hands us the crucial detail:

```
tag = SHA256(secret_key || message)
```

This is the **secret-prefix MAC** construction: `MAC(k, m) = H(k || m)`.

### Step 2 — probe the verifier

Sending back the *original* valid manifest verifies fine, but is not authorized:

```
$ curl -s -X POST http://...:30008/verify \
    -H 'Content-Type: application/json' \
    -d '{"message_hex":"434f...44415244","tag":"be235dc331a2578c...1218"}'
```

```json
{"authorized": false, "reason": "Manifest valid but carries standard clearance only.", "status": "VERIFIED"}
```

So the tag is genuinely checked (a wrong tag yields `"REJECTED"` / `"invalid MAC"`),
and *standard-clearance* manifests never authorize the vault. To win we must submit
a forged message that:

1. passes `SHA256(secret_key || message)` verification, and
2. contains the exact text `AUTH:VAULT-RELEASE=TRUE`.

---

## 3. The Vulnerability

### 3.1 Why `H(k || m)` is a broken MAC

SHA-256 is a **Merkle–Damgård** hash. It processes the message in 64-byte (512-bit)
blocks through a **compression function** `C(state, block)`:

1. Start with a fixed public IV (8 × 32-bit words).
2. For each 64-byte block: `state = C(state, block)`.
3. Before hashing, the message is **padded** so its length is a multiple of 64 bytes:
   - append byte `0x80`
   - append `0x00` bytes until the length ≡ 56 (mod 64)
   - append an 8-byte **big-endian length** field (the message length in bits)

The digest is simply the final 256-bit state.

The critical consequence: **the digest is the internal state**. If we know
`SHA256(secret || message)` and we know (or can guess) `len(secret)`, we can
"continue" the hash computation from that exact state — no key needed.

### 3.2 The attack recipe

1. We know `tag = state_after(secret || message)` and the exact bytes of `message`.
2. We guess the key length `L` (brute-force a plausible range, e.g. 1–64).
3. Compute the SHA-256 padding `P` for the hypothetical input `secret || message`,
   which has length `L + len(message)`:
   ```
   P = 0x80 || 0x00... || uint64_be((L + len(message)) * 8)
   ```
4. Craft the forged message:
   ```
   forged = message || P || "AUTH:VAULT-RELEASE=TRUE"
   ```
   When the server computes `SHA256(secret || forged)`, it first hashes
   `secret || message || P` — which is exactly the original input plus its own
   padding, i.e. an exact multiple of 64 bytes. At that point its internal state
   is *identical* to the state we already know from the leaked tag.
5. Start a SHA-256 computation **from that leaked state** (instead of the IV),
   set the running byte counter to `(L + len(message) + len(P))`, and hash the
   appended `AUTH:VAULT-RELEASE=TRUE` text plus its final padding. The resulting
   digest is a **valid tag** for the forged message.

The attacker never learns the key — they only "resume" the hash where it left off.

---

## 4. The Exploit

No hashpump/hashpumpy was available on the box, so I implemented the SHA-256
compression function and length extension from scratch in Python.

### 4.1 Self-check

Before attacking, validate the engine with a known-answer test: extending from the
empty hash with `known_len = 0` and appending `b"hello"` must equal
`SHA256(padding(0) || b"hello")`:

```python
expected = hashlib.sha256(sha256_padding(0) + b'hello').hexdigest()
got = length_extend(empty_sha256_digest, 0, b'hello')
assert expected == got
```

### 4.2 Length extension core

```python
def length_extend(known_hash_hex, known_len, append):
    # Unpack the known digest — this IS the internal state
    state = list(struct.unpack('>8I', bytes.fromhex(known_hash_hex)))

    # Where the real hash computation "currently" is:
    # original bytes (secret+message) + their own padding
    total = known_len + len(sha256_padding(known_len))

    # Continue: hash append + final padding (length field covers everything)
    data = append + sha256_padding(total + len(append))
    for i in range(0, len(data), 64):
        state = compress(state, data[i:i+64])
    return ''.join('%08x' % w for w in state)
```

### 4.3 Brute-forcing the key length

We don't know `len(secret)`, so we try every plausible length (1–64). For each:

```python
for secret_len in range(1, 65):
    known_len = secret_len + len(manifest)
    forged_msg = manifest + sha256_padding(known_len) + b'AUTH:VAULT-RELEASE=TRUE'
    tag = length_extend(known_tag, known_len, b'AUTH:VAULT-RELEASE=TRUE')
    # POST to /verify; stop when status != REJECTED
```

Note: forged bytes are transmitted as hex (the `0x80`/`0x00` padding bytes are
binary — hex encoding is mandatory).

### 4.4 Running it

```
$ python3 length_ext.py
[+] SHA-256 length-extension implementation self-check passed
secret_len= 1  tag=b90f9b9ff8cf930d... -> REJECTED
secret_len= 2  tag=b90f9b9ff8cf930d... -> REJECTED
...
secret_len=17  tag=dd39e617c2cbf21c... -> VERIFIED
{
  "authorized": true,
  "flag": "r00t{l3ngth_3xt3nsi0n_str1k3s_ag41n}",
  "status": "VERIFIED"
}
[+] AUTHORIZED! secret_len=17
```

### 4.5 The winning payload

- **Secret length:** 17 bytes
- **Forged message (hex):**
  ```
  434f55524945522d4d414e49464553547c46524f4d3a48512d44495350415443487c
  544f3a57415245484f5553452d30377c5041434b4147453a50582d383832337c49
  54454d533a31347c5354415455533a50454e44494e472d5245564945577c434c45
  4152414e43453a5354414e44415244  | original manifest
  800000000000000000000000000000000000000000000000000000000000000000
  0000000000000000000000000000000000000000000000000000000420          | SHA-256 padding for 17+105=122 bytes (length field 0x3d0 bits = 0x420)
  415554483a5641554c542d52454c454153453d54525545                        | "AUTH:VAULT-RELEASE=TRUE"
  ```
- **Forged tag:** `dd39e617c2cbf21c237cf093154074dbf250426337d5e083d1fff27196392014`

Submitting that pair yields `authorized: true` and the flag.

---

## 5. Flag

```
r00t{l3ngth_3xt3nsi0n_str1k3s_ag41n}
```

---

## 6. Mitigations (what HQ-Dispatch should have done)

1. **Never use `H(key || message)` as a MAC.** The standard fix is
   **HMAC** (`HMAC-SHA256`), which is resistant to length extension because it
   does two keyed hash passes and never exposes an intermediate state.
2. Alternatively use SHA-256/384 with **message padding before the key**
   (`H(message || key)`), or append the key (`H(message || key)`) — both defeat
   length extension — though HMAC is the industry standard.
3. Include an explicit version/format field and parse strictly: even with a valid
   MAC, reject messages containing binary garbage (padding bytes) — the server
   should not blindly accept arbitrary appended bytes.

---

## 7. Files

- `length_ext.py` — full exploit: self-contained SHA-256 + length extension +
  key-length brute force + verifier interaction.
