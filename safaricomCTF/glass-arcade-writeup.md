# Glass Arcade — Beginner Writeup (Reversing an Android App + AES-GCM)

> **Note:** This is a *mobile reversing + crypto* challenge, not a classic web bug.
> We download an Android app, **read its own source code** to learn how it unlocks a
> secret, then **reproduce that unlock ourselves**. You do **not** need to write Python
> — we do the maths in **CyberChef** (a point-and-click tool in your browser). There is
> one tiny optional Python one-liner, clearly justified, plus a full optional solver at
> the very end.
>
> **Assumption:** the challenge only gave a service URL, so I assume the target is
> `http://54.72.82.22:8380`. Swap in whatever host your event provides.

---

## 1. Challenge Overview

**Glass Arcade** is a **mobile / crypto** challenge from the **Safaricom CTF (safctf)**,
worth **300 points**. The website ("COMEBACK KIT") hands you a small **Android app
(`.apk`)** and a small **`session.json`** file. The **goal** is to figure out how the app
turns that `session.json` into a hidden message, do the same calculation yourself, and
submit the result to get the flag.

- Category: **Mobile reversing + AES-GCM decryption**
- Difficulty: **Medium (300 points)**
- Service: `http://54.72.82.22:8380`
- The hint — *"Everything looks transparent from the outside"* — is the whole idea:
  the app is like **glass**, we can see straight through it to its logic.

Do not worry if "AES-GCM" means nothing to you yet — we explain it as we go.

---

## 2. What You Need Before Starting

A **Linux machine** (Kali is perfect) and roughly **45 to 90 minutes** as a beginner.

- **curl** — download files from the server.
  ```
  sudo apt install curl
  ```
- **unzip** — an `.apk` file is secretly just a `.zip`, so we can open it.
  ```
  sudo apt install unzip
  ```
- **jadx** — turns an Android app back into readable Java-ish code.
  ```
  sudo apt install jadx
  ```
- **xxd** — shows a file's raw bytes as hex (ships with `vim-common`/base system).
- **A web browser** for **CyberChef** — no install, just open
  `https://gchq.github.io/CyberChef/`. This is where we do the crypto by clicking.
- **python3** (already on Kali) — used for exactly **one** short line, and optionally the
  full solver at the end.

---

## 3. Reconnaissance

**Step 1 — Look at the front page and find the downloads.**
```
curl -s http://54.72.82.22:8380/ | grep -o '/downloads/[^"]*'
```
Expected output:
```
/downloads/glass-arcade.apk
/downloads/session.json
```
This tells us the challenge gives us **two files**: the app itself and a small data file.

[SCREENSHOT: the browser showing the "COMEBACK KIT" page with the two download links]

**Step 2 — Download both files.**
```
curl -s http://54.72.82.22:8380/downloads/glass-arcade.apk -o glass-arcade.apk
curl -s http://54.72.82.22:8380/downloads/session.json -o session.json
cat session.json
```
Expected output:
```
{
  "account": "cc8914d136ec62f6",
  "build": 3,
  "transfer": "P9noumCVAhimnBVdDcWUyA=="
}
```
Plain English: `transfer` looks like **Base64** (letters/digits ending in `==`), `build`
is the number **3**, and `account` is some id. We do not yet know how they are used — the
app's code will tell us.

**Step 3 — Peek inside the app.** An `.apk` is just a ZIP archive, so unzip it:
```
unzip -o glass-arcade.apk -d glass-apk
find glass-apk -maxdepth 2 -type f
```
Representative output:
```
glass-apk/AndroidManifest.xml
glass-apk/classes.dex
glass-apk/assets/session.bin      <-- an encrypted blob (72 bytes)
glass-apk/META-INF/...
```
Two things matter: **`classes.dex`** (the compiled program logic) and
**`assets/session.bin`** (a tiny binary file the app ships with — almost certainly the
encrypted secret).

```
ls -l glass-apk/assets/session.bin        # 72 bytes
```

[SCREENSHOT: terminal showing the unzipped file list with classes.dex and assets/session.bin]

---

## 4. Identifying the Vulnerability

The "vulnerability" here is **client-side secrets** (also called *security through
obscurity*). The developer put the decryption key logic **and** the encrypted secret
**inside the app** and assumed nobody would look. But anything shipped to your device can
be read by you — the app is **transparent**, exactly like the hint says.

**Analogy:** imagine a diary with a combination lock, but the instructions for picking the
lock are printed on the back cover. The lock looks secure, yet everything an attacker needs
is right there in your hands.

What tipped us off during recon:
- A **tiny** app (~5 KB) with a bundled **`assets/session.bin`** blob → the secret travels
  *with* the app.
- Decompiling (next section) shows the strings **`AES/GCM/NoPadding`** and **`SHA-256`** →
  the app decrypts that blob itself, so the key must be derivable from data we already have.

We do not attack a server here; we simply **re-run the app's own calculation** by hand.

---

## 5. Exploitation Step By Step

### Step 1 — Decompile the app and read the one important function

```
jadx -d glass-src glass-apk/classes.dex
```
Open `glass-src/` and find the class **`com.glass.arcade.Lobby`** (jadx-gui works too:
`jadx-gui glass-arcade.apk`). The method **`visit(String transfer)`** is the whole
challenge. In plain English it does five things, in order:

1. **Base64-decode** the `transfer` string → 16 raw bytes.
2. Build a 16-byte **seed** by combining those bytes with two hardcoded number lists.
3. **key = SHA-256( seed + the text "glass-arcade/3" )** → a 32-byte AES key.
   (The `3` is the `build` number from `session.json`.)
4. **AES-GCM decrypt** `assets/session.bin` using that key.
5. Show the decrypted text on screen.

[SCREENSHOT: jadx showing the decompiled Lobby.visit method]

The two hardcoded lists (they appear as `const/16` pairs in the code) are:
```
C = [80,188,119,129,216,120,184,214,52,215,69,26,20,60,225,175]
D = [ 0,  7, 14, 21, 28, 35, 42, 49,56, 63,70,77,84,91, 98,105]   # goes up by 7
```
and for each position **i**, the seed byte is:
```
seed[i] = ( (C[i] - D[i])  XOR  transfer_bytes[i] )  AND 0xFF
```

### Step 2 — Produce the 16-byte seed (one justified Python line)

Doing "subtract, then XOR, then keep the low byte" for 16 positions **by hand is very
error-prone**, so this is the one place we lean on a single Python line. It only turns the
`transfer` value + the two lists into the seed; nothing is hidden:
```
python3 -c "C=[80,188,119,129,216,120,184,214,52,215,69,26,20,60,225,175];D=[0,7,14,21,28,35,42,49,56,63,70,77,84,91,98,105];import base64;t=base64.b64decode('P9noumCVAhimnBVdDcWUyA==');print(bytes(((C[i]-D[i])^t[i])&0xff for i in range(16)).hex())"
```
Expected output (our **seed** in hex):
```
6f6c81d6dcc08cbd5a04ea90cd24eb8e
```

### Step 3 — Turn the seed into the AES key with CyberChef (SHA-256)

The key is `SHA-256(seed + "glass-arcade/3")`. The text `glass-arcade/3` in hex is
`676c6173732d6172636164652f33`. So glue the seed hex and that text's hex together, then
hash the raw bytes.

In CyberChef (`https://gchq.github.io/CyberChef/`):
1. **Input box:** paste `6f6c81d6dcc08cbd5a04ea90cd24eb8e676c6173732d6172636164652f33`
2. Drag in the operation **"From Hex"** (turns the text into raw bytes).
3. Drag in **"SHA2"** and set size **256**.

Expected **key** (hex) in the output:
```
cd097113b5603025cc04b022a5bddd9cc8673e9ed4994abf1246f8b5643a9950
```

[SCREENSHOT: CyberChef with "From Hex" + "SHA2 256" producing the 64-char key]

### Step 4 — Read the encrypted blob's bytes and split them

AES-GCM needs three pieces from `session.bin`: a 12-byte **nonce** (a one-time number), the
**ciphertext**, and a 16-byte **tag** (an integrity check) at the very end.

```
xxd -p glass-apk/assets/session.bin | tr -d '\n'; echo
```
Representative output (72 bytes = 144 hex characters):
```
d9d72859b38348d224a53c7906c41c57fdf5cc8b79689d048a05c19164ef9213d6273876415a1a4fc080c16cbeaef57755e4cc56a52b74114211338b6d6a2564de959509960d2771
```
Split it like this (count in hex characters, 2 per byte):
- **nonce** = first 12 bytes → `d9d72859b38348d224a53c79`
- **tag** = last 16 bytes → `4211338b6d6a2564de959509960d2771`
- **ciphertext** = everything in between (44 bytes) →
  `06c41c57fdf5cc8b79689d048a05c19164ef9213d6273876415a1a4fc080c16cbeaef57755e4cc56a52b7411`

### Step 5 — Decrypt with AES-GCM in CyberChef

Start a fresh CyberChef tab and build this recipe:
1. Drag in **"AES Decrypt"**.
2. **Key:** paste the key hex from Step 3, and set the dropdown next to it to **HEX**.
3. **IV:** paste the **nonce** hex (`d9d72859b38348d224a53c79`), dropdown **HEX**.
4. **Mode:** choose **GCM**.
5. **GCM Tag** field: paste the **tag** hex (`4211338b6d6a2564de959509960d2771`).
6. **Input:** set the input type to **HEX** and paste the **ciphertext** hex.

Expected output (the decrypted message):
```
safctf{3e6a8997-13d3-4615-9b47-0e41d40c9dee}
```

[SCREENSHOT: CyberChef "AES Decrypt" (GCM) showing the safctf{...} plaintext]

**Important twist:** this `safctf{...}` is **not the final flag**. It looks exactly like
one, but it is an **answer token** we must hand back to the server. (See the next section.)

---

## 6. Capturing the Flag

The front page's own JavaScript submits answers to **`/submit`** as JSON. Send the token we
just decrypted:
```
curl -s -X POST http://54.72.82.22:8380/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"safctf{3e6a8997-13d3-4615-9b47-0e41d40c9dee}"}'
```
Expected output — the **real flag**:
```
{"message":"safctf{318223415bd0e96e2f63b0dd88eacf2d}","ok":true}
```

**Flag:** `safctf{318223415bd0e96e2f63b0dd88eacf2d}`

[SCREENSHOT: terminal showing the /submit response with ok:true and the real flag]

---

## 7. Why This Works (Beginner Explanation)

Software you install runs on **your** device, which means every instruction and every
bundled file is yours to inspect. The app tried to hide a secret by scrambling the key
(subtract-and-XOR) and encrypting a blob — but it also **shipped the recipe** to unscramble
it. Reading the code (jadx) and replaying the maths (CyberChef) is all it takes.

Back to the diary analogy: the lock (AES-GCM) is genuinely strong, but the **key was derived
from values printed inside the same book**. Strong crypto with a discoverable key is no
protection at all.

In the real world this is why mobile apps must **never** store API keys, encryption keys, or
"premium unlock" secrets in the client. Attackers routinely decompile apps to pull out
hardcoded credentials. The lesson: secrets belong on a server you control, never baked into
something you hand to the user.

---

## 8. Common Mistakes and Dead Ends

- **Submitting the decrypted `safctf{3e6a8997-...}` as the flag.** It is a decoy that *looks*
  like a flag; it is really the **answer token**. You must POST it to `/submit` to receive
  the actual flag. This trips up almost everyone first time.
- **Mixing up the GCM nonce and tag.** In `session.bin` the **first 12 bytes** are the
  nonce (IV) and the **last 16 bytes** are the tag. Swap them and CyberChef just errors or
  returns garbage.
- **Forgetting to append `glass-arcade/3` before hashing.** The key is
  `SHA-256(seed + "glass-arcade/3")`, not `SHA-256(seed)`. Miss the suffix and the AES
  decrypt fails. (The `3` comes from `build` in `session.json`.)
- **Re-encoding Base64/hex wrong.** Make sure CyberChef inputs are set to **HEX** where we
  say HEX; a stray newline or the wrong radix produces the wrong key.

---

## 9. How to Defend Against This

- **Never ship secrets in a mobile/desktop client.** Keys, tokens, and "unlock" values must
  live on a server the user cannot read.
- **Do the sensitive work server-side.** If a message must be decrypted, have the server do
  it after authenticating the user, and return only what the user is allowed to see.
- **Treat obfuscation as speed-bump, not security.** Subtract-and-XOR key scrambling only
  slows an attacker by minutes; assume any client-side algorithm is fully known.
- **Use per-user server-issued tokens** with expiry, instead of a single secret baked into
  every copy of the app.
- **Add tamper/response checks server-side** so a leaked client secret alone is not enough
  to unlock protected data.

---

## 10. Key Takeaways

- **An `.apk` is a ZIP** — `unzip` it, then **`jadx`** turns `classes.dex` into readable
  code. This two-command combo opens almost any Android challenge.
- **CyberChef is your no-code crypto lab:** `From Hex`, `SHA2`, and `AES Decrypt (GCM)` let
  you reproduce an app's maths with zero scripting.
- **GCM layout cheat:** `nonce(12 bytes) ‖ ciphertext ‖ tag(16 bytes)`. Split before you
  decrypt.
- **A string that looks like a flag may be an *answer*.** When a site has a `/submit`
  endpoint, feed your find to it before giving up.
- Cheatsheet to save:
  ```
  curl -s URL/downloads/file -o file          # grab materials
  unzip -o app.apk -d app && jadx -d src app/classes.dex   # read the code
  xxd -p blob.bin | tr -d '\n'                # bytes as hex for CyberChef
  curl -s -X POST URL/submit -H 'Content-Type: application/json' -d '{"answer":"..."}'
  ```

You just reverse-engineered a real Android app and reproduced AES-GCM by clicking — that is
a genuinely professional skill. Keep going; the next one will feel easier.

---

## Advanced Alternative (Optional — Full Python Solver)

If you are comfortable with Python, the entire challenge is a few lines. This is **optional**
and only shown so you can see the whole calculation in one place. It needs the `cryptography`
package (`pip install cryptography`).

```python
import base64, hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# 1) rebuild the seed from session.json's "transfer"
C = [80,188,119,129,216,120,184,214,52,215,69,26,20,60,225,175]
D = [0,7,14,21,28,35,42,49,56,63,70,77,84,91,98,105]
t = base64.b64decode("P9noumCVAhimnBVdDcWUyA==")
seed = bytes(((C[i]-D[i]) ^ t[i]) & 0xFF for i in range(16))

# 2) key = SHA-256(seed + "glass-arcade/3")
key = hashlib.sha256(seed + b"glass-arcade/3").digest()

# 3) AES-GCM decrypt assets/session.bin (nonce = first 12 bytes)
blob = open("glass-apk/assets/session.bin", "rb").read()
nonce, ct = blob[:12], blob[12:]
print(AESGCM(key).decrypt(nonce, ct, None).decode())
# -> safctf{3e6a8997-13d3-4615-9b47-0e41d40c9dee}  (the ANSWER token; POST to /submit)
```
Then submit the token to `/submit` (Section 6) to get the real flag
`safctf{318223415bd0e96e2f63b0dd88eacf2d}`.





