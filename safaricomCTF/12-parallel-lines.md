# Safaricom CTF — Parallel Lines (Crypto, 350 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Crypto**, difficulty **350 pts**,
> and the target is `http://54.72.82.22:8430`. All commands and outputs below were
> captured live against that service.

## 1. Challenge Overview

"Parallel Lines" is a **350 pt crypto** challenge that ships a zip with two encrypted
files (`export-a.bin`, `export-b.bin`), a **known plaintext** (`memo.txt`), and a
"spool" file that describes how one of the exports was shuffled. The goal is to undo
the shuffle, recover the random **keystream** by XOR-ing the known memo against
`export-a`, then use that same keystream to decrypt `export-b` and read its flag.
The hint "two paths run side by side" is about the two exports sharing one keystream.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- **unzip, file, xxd, wc** — `sudo apt install unzip file xxd coreutils` (all present on Kali).
- **python3** — already on Kali. XOR and byte shuffling are quick to do by hand in a
  calculator for one byte, but impractical for 153 bytes, so a short explained script
  is used.
- No account, no VPN. The service listens on a raw IP/port.
- **Time estimate:** 40–70 minutes for a beginner. The tricky part is getting the
  permutation direction right.

## 3. Reconnaissance

1. Look at the landing page and grab the archive:

```bash
curl -s -i http://54.72.82.22:8430/ | head -5
mkdir -p ~/pl && cd ~/pl
curl -s http://54.72.82.22:8430/downloads/lookbook.zip -o lookbook.zip
unzip -o lookbook.zip
ls -la
```

Expected output (trimmed):

```http
HTTP/1.1 200 OK
Server: Werkzeug/3.1.9 Python/3.11.16
```

```
memo.txt
export-a.bin
export-b.bin
spool.json
```

**Why this matters:** four files. `memo.txt` looks like ordinary text (so it is a
**known plaintext**), the two `.bin` files are our ciphertexts, and `spool.json`
describes a shuffle.

[SCREENSHOT: the Parallel Lines landing page and the unzipped files]

2. Read the "known plaintext":

```bash
cat memo.txt; echo; wc -c memo.txt export-a.bin export-b.bin
```

Expected output:

```
Studio memo: sample garments arrive Tuesday. Keep the silver rack clear. ................................................................................
     153 memo.txt
     153 export-a.bin
      64 export-b.bin
```

**Why this matters:** `memo.txt` is **exactly the same length (153 bytes)** as
`export-a.bin`. That is the classic setup for a **known-plaintext XOR** attack: if
`export-a = plaintext XOR keystream`, then `plaintext XOR export-a = keystream`. The
trailing dots are padding to reach the same length.

3. Look at the two binary files and the spool config:

```bash
xxd export-a.bin | head -6
xxd export-b.bin | head -6
python3 -m json.tool spool.json | head -20
```

Expected output (trimmed):

```
00000000: e900 6424 5561 931b f6a2 4791 c778 8b4c  ..d$Ua....G..x.L
...
00000000: 5c72 3bd3 d2c5 84bd 7001 426a 56f9 ce22  \r;.....p.BjV.."
...
{
  "nonce": "ba2cbe7787a82ddb",
  "spool_order": [13, 134, 119, 55, 142, 29, 130, ...],
  "maintenance": "late rehearsal export"
}
```

**Why this matters:** `spool_order` is a list of 153 numbers. If you sort it, it is
exactly the numbers `0..152` in some order — a **permutation**. That means the bytes
of `export-a` were shuffled before storage, and we have to put them back before the
XOR will line up.

4. Confirm the permutation:

```bash
python3 - <<'PY'
import json
P = json.load(open("spool.json"))["spool_order"]
print("length:", len(P), "min:", min(P), "max:", max(P))
print("is a permutation of 0..152:", sorted(P) == list(range(153)))
PY
```

Expected output:

```
length: 153 min: 0 max: 152
is a permutation of 0..152: True
```

**What to look for:** `True` tells us every position 0–152 appears exactly once.
This is the "spool order" used to shuffle the ciphertext.

## 4. Identifying the Vulnerability

Two weaknesses combine here:

1. **Keystream reuse.** The same random **keystream** was XOR-ed against two different
   messages (`export-a` and `export-b`) — the "parallel lines". In a stream cipher you
   must never reuse the keystream, because `c1 XOR c2 = m1 XOR m2`, and if you know
   one message you recover the other.
2. **A known plaintext was handed to us.** `memo.txt` is the plaintext of `export-a`,
   so we can recover the keystream directly and apply it to `export-b`.

The shuffle (`spool_order`) is a minor obstacle: it means the stored bytes are out of
order, so we must un-permute before XOR. The sign that tipped me off was the memo
being exactly 153 bytes, matching `export-a`.

**Analogy:** imagine two letters written with the same "invisible ink" pattern. If you
hold one letter up to the light (you already know what it says), you can read the ink
pattern and then decode the second letter. Reusing the ink is the mistake.

## 5. Exploitation Step by Step

1. **Work out what the permutation means.** `spool.json` says the stored byte
   `export-a[i]` actually belongs to logical position `spool_order[i]`. In other
   words:

   ```
   real_ciphertext[ spool_order[i] ] = export-a.bin[i]
   ```

   After putting every byte back, we have the true ciphertext stream.

2. **Recover the keystream and decrypt `export-b`.** The script below does exactly the
   two steps you would do by hand for a single byte — XOR is reversible, and the
   permutation just moves bytes:

```bash
cd ~/pl && python3 - <<'PY'
import json

memo = open("memo.txt","rb").read()      # the known plaintext (153 bytes)
a    = open("export-a.bin","rb").read()  # shuffled ciphertext (153 bytes)
b    = open("export-b.bin","rb").read()  # target ciphertext (64 bytes)
P    = json.load(open("spool.json"))["spool_order"]

# 1. Un-shuffle: real_ciphertext[P[i]] = a[i]
real_c = bytearray(len(a))
for i, pos in enumerate(P):
    real_c[pos] = a[i]

# 2. keystream = known_plaintext XOR ciphertext   (XOR undoes itself)
keystream = bytes(m ^ c for m, c in zip(memo, real_c))

# 3. Decrypt the target with the recovered keystream
plaintext = bytes(x ^ k for x, k in zip(b, keystream))
print(plaintext)
PY
```

Expected output:

```
b'Collection receipt: safctf{0983d7d0-b930-468f-ac25-ecc6feecc856}'
```

**What to look for:** readable English plus a `safctf{...}` value. That is the
**internal answer**; the trailing bytes to be sure the XOR worked should all be
printable ASCII.

[SCREENSHOT: terminal showing the recovered "Collection receipt" plaintext]

3. **If the output looks like garbage, try the other permutation direction.** I
   initially tried applying `spool_order` forwards (`keystream[P[i]]`) and permuting
   the memo instead, and both produced unreadable bytes. Only
   `real_c[P[i]] = a[i]` produced 64/64 printable characters. This trial-and-error is
   normal: a permutation has two directions, and the wrong one is just noise.

4. **Submit the recovered answer** to unlock the real flag:

```bash
curl -s -X POST http://54.72.82.22:8430/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"safctf{0983d7d0-b930-468f-ac25-ecc6feecc856}"}'
```

Expected output:

```json
{"message":"safctf{8d6447b3f694f59efef1f015f58d04a7}","ok":true}
```

**What to look for:** `"ok":true` and a *new* `safctf{...}` in `message`. That is the
final flag.

### Advanced Alternative (optional)

The original exploration script. It tries all four plausible combinations (forward
and inverse permutation, plus permuting the memo) and prints how "printable" each
result is — a quick way to see which direction is correct:

```python
import json
memo = open("memo.txt","rb").read()
a    = open("export-a.bin","rb").read()
b    = open("export-b.bin","rb").read()
P    = json.load(open("spool.json"))["spool_order"]; n = len(P)
Pinv = [0]*n
for i, p in enumerate(P): Pinv[p] = i

def score(pt): return sum(32 <= c < 127 for c in pt), pt

ks = bytes(x ^ y for x, y in zip(a, memo))
print("A (ks[P[i]])   ", score(bytes(b[i] ^ ks[P[i]]      for i in range(len(b)))))
print("B (ks[Pinv[i]])", score(bytes(b[i] ^ ks[Pinv[i]]    for i in range(len(b)))))
realc = bytearray(n)
for i in range(n): realc[P[i]] = a[i]
ks2 = bytes(x ^ y for x, y in zip(realc, memo))
print("C (unshuffle)  ", score(bytes(b[i] ^ ks2[i]       for i in range(len(b)))))
```

## 6. Capturing the Flag

Two values matter here:

- The **internal answer** from `export-b.bin`:
  `safctf{0983d7d0-b930-468f-ac25-ecc6feecc856}`
- The **real flag** returned by `/submit`:
  `safctf{8d6447b3f694f59efef1f015f58d04a7}`

Submit the second one.

## 7. Why This Works (Beginner Explanation)

XOR is its own inverse: `(m XOR k) XOR k = m`. A stream cipher takes a secret random
keystream `k` and XORs it with the message. That is secure **only if `k` is used
once**. When the same `k` is reused for a second message, anyone who knows one of the
plaintexts can compute `k = plaintext XOR ciphertext` and decrypt everything else
protected by that keystream. Here the developers even included the first plaintext,
`memo.txt`, and it matched the ciphertext's length exactly.

The shuffle (`spool_order`) was meant to confuse a casual reader, but a permutation
reveals nothing about the secret — you can always undo it once you know the mapping.
Real-world lessons: this is the flaw behind WEP, reused one-time pads, and many
"encryption" schemes that accidentally repeat random values. The golden rule is
**never reuse a nonce/keystream**.

## 8. Common Mistakes and Dead Ends

- **Applying the permutation in the wrong direction.** `real_c[P[i]] = a[i]` works;
  `ks[P[i]]` does not. If your output is garbage, flip the direction.
- **Forgetting that XOR is symmetric.** You do not need a "decrypt" function — the
  same XOR operation both encrypts and decrypts.
- **Assuming `export-b` is the same length as `export-a`.** It is only 64 bytes, so
  you slice the first 64 bytes of the keystream. Slicing the wrong end (or the whole
  thing) produces wrong output.
- **Overlooking `memo.txt`.** The trailing dots look like formatting, but the file
  has to be exactly 153 bytes to align with `export-a`. Do not trim it.
- **Submitting the internal answer instead of the `/submit` response.** The recovered
  `safctf{...}` opens the gate; the flag is the value inside `message`.

## 9. How to Defend Against This

- **Never reuse a keystream or nonce** with a stream cipher or with AES-GCM/CTR.
  Generate a fresh random nonce for every message.
- **Do not ship the plaintext of an encrypted export** — known plaintext turns a
  reused keystream into a one-line break.
- **Prefer vetted AEAD constructions** (AES-GCM, ChaCha20-Poly1305) and rely on the
  library to manage nonces, rather than rolling your own XOR stream.
- **Do not treat shuffling/obfuscation as security.** A permutation is not a secret;
  use real cryptography for confidentiality.
- **Rotate keys** if a nonce ever repeats, since all messages under that key must be
  considered compromised.

## 10. Key Takeaways

- A ciphertext and a **known plaintext of the same length** is a keystream-recovery
  gift: `keystream = plaintext XOR ciphertext`.
- XOR is self-inverse — the same operation encrypts and decrypts.
- `spool_order` is a permutation; undo it with `real[P[i]] = shuffled[i]`.
- Save to your cheatsheet:
  `python3 -c "import sys;m=open('memo.txt','rb').read();a=open('export-a.bin','rb').read();print(bytes(x^y for x,y in zip(m,a)).hex())"`
- **Internal answer:** `safctf{0983d7d0-b930-468f-ac25-ecc6feecc856}`
- **Flag:** `safctf{8d6447b3f694f59efef1f015f58d04a7}`

You just broke a stream cipher by spotting a reused keystream — that is a genuinely
professional instinct. Keep going.
