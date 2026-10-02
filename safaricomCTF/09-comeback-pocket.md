# Safaricom CTF — Comeback Pocket (Forensics / Crypto, 150 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Forensics / Crypto**, difficulty
> **150 pts**, and the target is `http://54.72.82.22:8360`. All commands and outputs
> below were captured live against that service.

## 1. Challenge Overview

"Comeback Pocket" is a **150 pt forensics** challenge that hands you a phone backup
file (`pocket.ab`) plus a short piece of the app's source code (`Session.java`). The
goal is to open the backup, find the one active session record, use its identifiers
to rebuild an encryption key, decrypt a small binary blob, and then submit the value
you recovered to the service. The hint ("a recovery screen that may not exist in
this build") is a nudge that the decrypted value is an *internal* answer, not the
final flag.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- **file, xxd, strings, sqlite3, unzip/tar** — `sudo apt install file xxd sqlite3 binutils`
- **python3** — already on Kali. We only use *very* short snippets; every line is
  explained.
- No account, no VPN. The service listens on a raw IP/port.
- **Time estimate:** 45–75 minutes for a beginner. The backup format and the crypto
  are the two tricky parts; take them one at a time.

## 3. Reconnaissance

1. Look at the home page to see what the challenge offers:

```bash
curl -s -i http://54.72.82.22:8360/ | head -5
```

Expected output:

```http
HTTP/1.1 200 OK
Server: Werkzeug/3.1.9 Python/3.11.16
Content-Type: text/html; charset=utf-8
```

**Why this matters:** the page is titled **Comeback Pocket** and offers two
downloads. The name `pocket` and the `.ab` extension are the big clues — this looks
like an Android app artefact.

[SCREENSHOT: the Comeback Pocket landing page with its download links]

2. Download both provided files:

```bash
curl -s http://54.72.82.22:8360/downloads/Session.java -o Session.java
curl -s http://54.72.82.22:8360/downloads/pocket.ab     -o pocket.ab
```

3. Read the source snippet — it is deliberately short and tells you how the key is
   built:

```bash
cat Session.java
```

Expected output:

```java
// Application export: persistence adapter
SecretKey load(String uid,String device,byte[] salt) {
 return PBKDF2WithHmacSHA256(uid+":"+device,salt,12000,256);
}
// pass.bin: 12-byte IV, AES/GCM ciphertext, 16-byte tag.
```

**Why this matters:** this single comment block describes the entire crypto scheme:
derive a 256-bit key with **PBKDF2-HMAC-SHA256**, using the password
`uid + ":" + device`, a salt, and 12000 rounds. Then decrypt `pass.bin`, which is
laid out as `12-byte IV ‖ ciphertext ‖ 16-byte tag` (**AES-GCM**).

4. Identify the backup file:

```bash
file pocket.ab
```

Expected output:

```
pocket.ab: Android Backup, version 5, Compressed, Not-Encrypted
```

**Why this matters:** it is an **Android Backup** container. That format is easy to
unpack: a few header text lines, then a **zlib-compressed tar** archive. Since it is
*Not-Encrypted*, we do not need a password to open it.

[SCREENSHOT: terminal showing `file pocket.ab` returning "Android Backup, version 5"]

## 4. Identifying the Vulnerability

This is not a code bug — it is a **data-exposure / weak-secret** challenge, and
knowing the class helps you plan. The app "protects" a secret with an encryption key
derived from two things (`uid` and `device`) plus a salt. But **all three of those
values are shipped inside the same backup as the encrypted file**. That means anyone
who has the backup can rebuild the key. The design flaw is that the "password" to
the crypto is not actually secret; it is derivable from data lying next to the
ciphertext.

**Analogy:** it is like locking a box and taping the key to the bottom of the box.
The lock is a real, strong lock (PBKDF2 + AES-GCM are fine algorithms) — the problem
is where they kept the key.

The signs that tipped me off: (a) the source snippet literally names the inputs to
the key derivation, and (b) `session.xml` and `accounts.db` inside the backup
happily hand over those exact inputs.

## 5. Exploitation Step by Step

1. **Unpack the Android Backup.** The `.ab` format is `4` header lines followed by a
   zlib stream. There is no standard CLI tool pre-installed for this, so we use a
   4-line Python snippet (Python's `zlib` is the standard library — nothing to
   install). Each line just: read the file, skip 4 lines, inflate the rest, write a
   `.tar`:

```bash
python3 - <<'PY'
import zlib
data = open('pocket.ab','rb').read()
head = 0
for _ in range(4):                 # skip "ANDROID BACKUP", "5", "1", "none"
    head = data.index(b'\n', head) + 1
open('pocket.tar','wb').write(zlib.decompress(data[head:]))
PY
file pocket.tar
```

Expected output:

```
pocket.tar: POSIX tar archive
```

**Why this matters:** we turned the opaque `.ab` into a normal tar archive we can
explore with tooling you already know.

2. **List and extract the tar:**

```bash
tar tvf pocket.tar
mkdir -p pocket && tar xf pocket.tar -C pocket
find pocket -type f
```

Expected output:

```
apps/com.comeback.pocket/db/accounts.db
apps/com.comeback.pocket/sp/session.xml
apps/com.comeback.pocket/f/pass.bin
apps/com.comeback.pocket/_manifest
```

**What to look for:** `accounts.db` (who the users are and their devices),
`session.xml` (settings, including the salt), and `pass.bin` (the encrypted secret).

[SCREENSHOT: `tar tvf` output listing the four extracted files]

3. **Read the settings file** to get the salt and the round count:

```bash
cat pocket/apps/com.comeback.pocket/sp/session.xml
```

Expected output:

```xml
<map>
  <string name="installation">member-2dea8614a9</string>
  <string name="s">67beb4eff155c1bff95be68fd8c2e4e0</string>
  <int name="rounds" value="12000" />
</map>
```

**What to look for:** `s` is the **salt** (a random value mixed into the key
derivation), and `rounds` is the iteration count (`12000`), matching `Session.java`.

4. **Query the accounts database** for the *active* row. (sqlite3 is a tiny
   command-line database client; you already know `cat`, this is the same idea for
   a database file.)

```bash
sqlite3 -header pocket/apps/com.comeback.pocket/db/accounts.db \
  "select * from accounts where active=1;"
```

Expected output:

```
uid|active|device
member-2dea8614a9|1|4e13eb4f120b8f4709ee20e57a597758
```

**What to look for:** exactly one row has `active = 1`. Its `uid` and `device` are
the two halves of the PBKDF2 password (`uid + ":" + device`). This is the pair we
will decrypt `pass.bin` with.

5. **Look at the encrypted blob's size and layout:**

```bash
xxd pocket/apps/com.comeback.pocket/f/pass.bin
```

Expected output (trimmed):

```
00000000: b56e 41b1 dc6f 3939 60cc 1808 317e 250e  .nA..o99`...1~%.
...
00000040: f23d 91e2 0270 5aa4                      .=...pZ.
```

**What to look for:** the file is **72 bytes**. Split it by the rule from
`Session.java`: **12 bytes IV** (first line), then the ciphertext, then **16 bytes
tag** (last two lines). So IV = `b56e41b1dc6f393960cc1808`, tag =
`4575cc8ebe22d9ebf23d91e202705aa4`, and everything between is the ciphertext.

6. **Derive the key and decrypt.** PBKDF2 and AES-GCM cannot be done by hand, so this
   is the one place a short script is genuinely required. Python's standard library
   has PBKDF2 and a tiny helper for GCM, so the snippet stays short and readable.
   Each line is explained with a comment:

```bash
cd /tmp && python3 - <<'PY'
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

uid, device = "member-2dea8614a9", "4e13eb4f120b8f4709ee20e57a597758"
salt = bytes.fromhex("67beb4eff155c1bff95be68fd8c2e4e0")
blob = open("pocket/apps/com.comeback.pocket/f/pass.bin","rb").read()

key = hashlib.pbkdf2_hmac("sha256", (uid+":"+device).encode(), salt, 12000, 32)
iv, rest = blob[:12], blob[12:]                 # 12-byte nonce, then cipher+tag
plaintext = AESGCM(key).decrypt(iv, rest, None) # GCM wants cipher+tag together
print(plaintext)
PY
```

Expected output:

```
b'safctf{ddd6569c-7655-4aa8-84e8-cd7f4acd4f78}'
```

**What to look for:** `b'...'` is Python showing a bytes value. The text inside is the
decrypted **internal answer**. This value is *not* the final flag — it is the key to
the challenge's submit gate.

7. **Submit the answer to unlock the real flag:**

```bash
curl -s -X POST http://54.72.82.22:8360/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"safctf{ddd6569c-7655-4aa8-84e8-cd7f4acd4f78}"}'
```

Expected output:

```json
{"message":"safctf{408e83b586354238e5a8e968a74b8b64}","ok":true}
```

**What to look for:** `"ok":true` and a *new* `safctf{...}` in `message` — that is the
real flag. To prove the gate is genuine and not simply echoing input, send a wrong
answer:

```bash
curl -s -X POST http://54.72.82.22:8360/submit \
  -H 'Content-Type: application/json' -d '{"answer":"test"}'
```

Expected output:

```json
{"message":"The request could not be completed.","ok":false}
```

[SCREENSHOT: the successful /submit response showing ok:true and the flag]

### Advanced Alternative (optional)

The full script I originally ran, kept for reference. It also tries several
plausible key-derivation inputs so you can see how to think about a wrong guess:

```python
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

uid    = "member-2dea8614a9"
device = "4e13eb4f120b8f4709ee20e57a597758"
salt   = bytes.fromhex("67beb4eff155c1bff95be68fd8c2e4e0")
data   = open("pocket/apps/com.comeback.pocket/f/pass.bin","rb").read()
iv, tag, ct = data[:12], data[-16:], data[12:-16]

for name, pw, s in [
    ("uid:device + hex salt", (uid + ":" + device), salt),
    ("uid:device + ascii salt", (uid + ":" + device), b"67beb4eff155c1bff95be68fd8c2e4e0"),
]:
    key = hashlib.pbkdf2_hmac("sha256", pw.encode(), s, 12000, 32)
    try:
        print(name, AESGCM(key).decrypt(iv, ct + tag, None))
    except Exception as e:
        print(name, "failed:", e)
```

## 6. Capturing the Flag

Two values matter here, so do not mix them up:

- The **decrypted internal answer** from `pass.bin`:
  `safctf{ddd6569c-7655-4aa8-84e8-cd7f4acd4f78}`
- The **real flag**, returned by `/submit`:
  `safctf{408e83b586354238e5a8e968a74b8b64}`

The one you paste into the scoreboard is the second one — the value from the
`message` field where `"ok": true`.

## 7. Why This Works (Beginner Explanation)

PBKDF2 is a "stretch" function: it turns a short password into a strong-looking key
by hashing it thousands of times. AES-GCM then encrypts and *authenticates* the data,
so if the key is wrong the decryption fails loudly instead of returning garbage.
These are good tools. The problem is that this app used *data shipped next to the
ciphertext* — the `uid`, the `device`, and the salt — as the password. Whoever holds
the backup automatically holds everything needed to rebuild the key. Real encryption
only helps when the key is protected by something the attacker does not have, like a
passphrase the user types in.

In the real world, this is the classic "encrypted but the key is stored beside the
data" mistake. It shows up in apps that encrypt local databases or config files but
derive the key from values also stored on the device. Testers call the result
"encryption at rest with a recoverable key." The fix is to tie the key to a secret
that never touches the disk, such as the device keystore or a user passphrase.

## 8. Common Mistakes and Dead Ends

- **Submitting the decrypted value as the final flag.** `safctf{ddd...}` is an
  internal answer. The service *rejects* nothing about it, but it is not the flag the
  scoreboard wants. Always read the `message` field from `/submit`.
- **Splitting `pass.bin` wrongly.** The layout is `IV(12) ‖ ciphertext ‖ tag(16)`.
  If you feed the tag into the ciphertext (or forget it), GCM raises an
  `InvalidTag` error. GCM wants `ciphertext + tag` as one argument.
- **Using the wrong account row.** There are ~30 rows in `accounts.db`, but only one
  has `active = 1`. Using a different `uid`/`device` pair silently derives the wrong
  key.
- **Stopping at the `.ab` extension.** Opening it with `tar`/`unzip` directly fails;
  it is an Android Backup, so you must strip the 4 header lines and zlib-inflate
  first.

## 9. How to Defend Against This

- **Never derive a key from values stored next to the ciphertext.** Use a user
  passphrase or a hardware-backed keystore secret instead.
- **Treat exported backups as public.** Anything you ship in a backup will eventually
  be read by someone; do not include secrets or key material in it.
- **Use a per-install random salt *and* a device-bound secret** stored in the OS
  keystore, so copying the backup to another machine is not enough.
- **Rotate keys and expire backups** so an old export cannot decrypt today's data.
- **Authenticate the ciphertext** (AES-GCM/ChaCha20-Poly1305) and log decryption
  failures, so tampering is detectable.

## 10. Key Takeaways

- `file` identifies an **Android Backup**; strip 4 lines then `zlib`-inflate to get
  a tar.
- `sqlite3 -header db "select * from accounts where active=1;"` finds the live record
  fast.
- `PBKDF2-HMAC-SHA256(password, salt, rounds, 32)` is the key derivation here; read
  the source snippet to learn the password format.
- AES-GCM layout to memorise: `nonce[12] ‖ ciphertext ‖ tag[16]`, decrypted as
  `decrypt(iv, ct+tag)`.
- Save to your cheatsheet:
  `python3 -c "import zlib;d=open('f.ab','rb').read();i=0;[i:=d.index(b'\n',i)+1 for _ in range(4)];open('f.tar','wb').write(zlib.decompress(d[i:]))"`
- **Internal answer:** `safctf{ddd6569c-7655-4aa8-84e8-cd7f4acd4f78}`
- **Flag:** `safctf{408e83b586354238e5a8e968a74b8b64}`

Nice work — you just recovered a real encrypted secret from a phone backup and used
it to open the door to the flag.
