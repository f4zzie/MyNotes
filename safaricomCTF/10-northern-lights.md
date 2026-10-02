# Safaricom CTF — Northern Lights (Forensics / Crypto, 200 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Forensics / Crypto**, difficulty
> **200 pts**, and the target is `http://54.72.82.22:8370`. All commands and outputs
> below were captured live against that service.

## 1. Challenge Overview

"Northern Lights" is a **200 pt forensics** challenge built around an **iPhone
backup** export. The zip contains the usual iOS backup files, a small Swift snippet
describing the app's encryption, and one encrypted blob. The goal is to work out
which keychain entry the app used, rebuild its encryption key, decrypt the blob, and
submit the recovered value to the service to unlock the flag.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- **unzip, file, xxd, strings, sqlite3** — `sudo apt install unzip file xxd sqlite3 binutils`
- **python3** — already on Kali. We use it only for two short, explained snippets:
  reading the Apple plist files and doing the AES-GCM decryption.
- No account, no VPN. The service listens on a raw IP/port.
- **Time estimate:** 45–75 minutes for a beginner. Reading the two Apple file formats
  (plist and the iOS backup layout) is the hardest part.

## 3. Reconnaissance

1. Look at the landing page:

```bash
curl -s -i http://54.72.82.22:8370/ | head -5
```

Expected output:

```http
HTTP/1.1 200 OK
Server: Werkzeug/3.1.9 Python/3.11.16
Content-Type: text/html; charset=utf-8
```

**Why this matters:** the page is titled **Northern Lights** and offers a download
called `device-export.zip`. A "device export" from a phone strongly suggests we are
looking at a mobile backup.

[SCREENSHOT: the Northern Lights landing page with its download link]

2. Fetch the export:

```bash
mkdir -p ~/nl && cd ~/nl
curl -s http://54.72.82.22:8370/downloads/device-export.zip -o device-export.zip
file device-export.zip
unzip -o device-export.zip
find . -type f
```

Expected output (trimmed):

```
device-export.zip: Zip archive data ...
  inflating: Manifest.db
  inflating: Keychain.plist
  inflating: Library/Preferences/com.northern.lights.plist
  inflating: d4/d443ff447a8bfaa462b13d797ce4b9ad0142c607
  inflating: Persistence.swift
```

**Why this matters:** `Manifest.db`, `Keychain.plist`, and the `d4/...` file are the
classic shape of an **iOS backup**. `Persistence.swift` is the app source snippet
that will explain the crypto, and `com.northern.lights.plist` holds the app's
settings.

3. Read the Swift snippet — this is the roadmap:

```bash
cat Persistence.swift
```

Expected output:

```swift
// Key = PBKDF2-SHA256(keychain.v_Data + UTF8(account), prefs.salt, prefs.iterations, 32)
// Store: nonce[12] + AES.GCM.sealed + tag[16]
```

**Why this matters:** it names every input we need: a keychain field `v_Data`, the
prefs `account`, `salt`, and `iterations`, and it says the blob layout is
`nonce[12] ‖ sealed ‖ tag[16]` for **AES-GCM**.

4. Check the encrypted blob's size:

```bash
xxd d4/d443ff447a8bfaa462b13d797ce4b9ad0142c607
```

Expected output:

```
00000000: 2e46 654b 6bbe ee78 7801 9441 740c e108  .FeKk..xx..At...
00000010: fc56 2add 4cbc da3a 7e56 5243 58f7 5456  .V*.L..:~VRCX.TV
00000020: 26d4 dd60 09e2 c793 9d18 ef50 14aa bec4  &..`.......P....
00000030: 4d25 795f 2496 e2ee 99c8 2ba3 ce23 631b  M%y_$.....+..#c.
00000040: e25b 037e bb69 22f8                      .[.~.i".
```

**What to look for:** **72 bytes** total — the same size as the Comeback Pocket blob
(if you solved that one). 12 bytes nonce + 44 bytes ciphertext + 16 bytes tag.

[SCREENSHOT: xxd of the d4/... blob showing 72 bytes]

## 4. Identifying the Vulnerability

Like its sibling challenge, this is a **data-exposure / weak-secret** design flaw,
not a code crash. The app encrypts the blob with a key derived from the **keychain
`v_Data` plus the account name**. But those values are shipped in the *same export*
as the encrypted blob, so anyone holding the backup can rebuild the key. The crypto
( PBKDF2 + AES-GCM ) is fine; the mistake is using non-secret material as the secret.

**Analogy:** this is a safe with a very strong lock, but the combination is written
on a card that is taped to the safe door. The lock is not the weak point; the
storage of the combination is.

The signs that tipped me off during reconnaissance: the Swift snippet named the exact
inputs, and the two plist files handed them over — but with a twist, which is the
next section.

## 5. Exploitation Step by Step

1. **Dump the app settings.** The `.plist` files here are Apple binary property
   lists, which `cat` turns into gibberish. Python's `plistlib` (standard library)
   reads them cleanly:

```bash
cd ~/nl && python3 - <<'PY'
import plistlib
p = plistlib.load(open("Library/Preferences/com.northern.lights.plist","rb"))
for k, v in p.items():
    print(k, "=", v)
PY
```

Expected output:

```
account = 18485ad7d74ed05fad7e518b
iterations = 24000
salt = b'\x00\x07\x8d(\xe7\x1f\x06\x97\x1fE\xd9\x14\xa5\xbb3\x87'
```

**Why this matters:** we now have `account`, `iterations` (24000), and the `salt`
(shown as raw bytes). The only missing piece is the keychain `v_Data`.

2. **Dump the keychain entries.** There are many keychain items; we want the one whose
   `acct` matches the prefs `account` *and* whose `svce` is the app:

```bash
cd ~/nl && python3 - <<'PY'
import plistlib
kc = plistlib.load(open("Keychain.plist","rb"))
for item in kc["items"]:
    print(item["acct"], item["svce"], item["v_Data"].hex())
PY
```

Expected output (trimmed — note the decoys):

```
1ca253ca2195642963e59e17 preview 47be3da0...
3f9f2a6f1d76c5109e15603e preview 4be5c165...
...
18485ad7d74ed05fad7e518b com.northern.lights 8093f80ee6ea08331dab7a447ef56af0054517ab3b757074f94cd970ace4d235
```

**What to look for:** the last line matches the `account` from the prefs and has
`svce = com.northern.lights`. Its `v_Data` is the value we need. **Do not** use a
`preview` row — those are decoys.

3. **Derive the key and decrypt the blob.** The layout is
   `nonce[12] ‖ ciphertext ‖ tag[16]`, and the key recipe from the Swift snippet is
   `PBKDF2-SHA256(v_Data + account, salt, iterations, 32)`. This needs AES-GCM, so a
   short script is genuinely required (Python ships PBKDF2 and AES-GCM support):

```bash
cd ~/nl && python3 - <<'PY'
import plistlib, hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

prefs = plistlib.load(open("Library/Preferences/com.northern.lights.plist","rb"))
kc    = plistlib.load(open("Keychain.plist","rb"))
item  = [i for i in kc["items"] if i["acct"] == prefs["account"]][0]
blob  = open("d4/d443ff447a8bfaa462b13d797ce4b9ad0142c607","rb").read()

key = hashlib.pbkdf2_hmac("sha256",
                          item["v_Data"] + prefs["account"].encode(),
                          prefs["salt"], prefs["iterations"], 32)
nonce, rest = blob[:12], blob[12:]
print(AESGCM(key).decrypt(nonce, rest, None))
PY
```

Expected output:

```
b'safctf{5068e894-3542-4574-ad65-1a5bfddd75eb}'
```

**What to look for:** the decrypted bytes are the **internal answer**. As with
Comeback Pocket, this is not yet the final flag.

[SCREENSHOT: the decrypted Northern Lights answer printed in the terminal]

4. **Submit the answer** to the service:

```bash
curl -s -X POST http://54.72.82.22:8370/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"safctf{5068e894-3542-4574-ad65-1a5bfddd75eb}"}'
```

Expected output:

```json
{"message":"safctf{3fd96340be891c629f7e3f3a42202743}","ok":true}
```

**What to look for:** `"ok":true`, and a *new* `safctf{...}` in `message`. That is
the real flag. A wrong answer is refused (`"ok":false`), same as the other gate
challenges.

### Advanced Alternative (optional)

The full key-scanning script I originally ran, which also prints the derived key so
you can compare — handy when you are not sure which keychain entry to use:

```python
import plistlib, hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

prefs = plistlib.load(open("Library/Preferences/com.northern.lights.plist","rb"))
kc    = plistlib.load(open("Keychain.plist","rb"))
blob  = open("d4/d443ff447a8bfaa462b13d797ce4b9ad0142c607","rb").read()
nonce, tag, ct = blob[:12], blob[-16:], blob[12:-16]

key = hashlib.pbkdf2_hmac("sha256",
        item["v_Data"] + prefs["account"].encode(), prefs["salt"], prefs["iterations"], 32) \
      if (item := [i for i in kc["items"] if i["acct"] == prefs["account"]][0]) else None
print("key", key.hex())
print("plaintext", AESGCM(key).decrypt(nonce, ct + tag, None))
```

## 6. Capturing the Flag

Two values matter here:

- The **decrypted internal answer**:
  `safctf{5068e894-3542-4574-ad65-1a5bfddd75eb}`
- The **real flag** returned by `/submit`:
  `safctf{3fd96340be891c629f7e3f3a42202743}`

Submit the second one. Always read the `message` field of the `/submit` response.

## 7. Why This Works (Beginner Explanation)

PBKDF2 takes a short "password" and stretches it into a strong 256-bit key by
hashing it many times; AES-GCM then both encrypts and authenticates the data, so a
wrong key fails rather than returning junk. That machinery is solid. The bug is that
the "password" — the keychain `v_Data` plus the account name — travels in the same
zip as the encrypted blob. Anyone who has the backup has the password.

This pattern matters far beyond CTFs. iOS and Android backups are frequently
collected during investigations and often end up on shared drives. If an app's local
encryption key is stored in a file that lands in that backup, then the encryption
provides no real protection. The correct design keeps the key in hardware-backed
secure storage (Secure Enclave / Keychain with device binding) and excludes it from
backups, so the ciphertext is worthless without the physical device.

## 8. Common Mistakes and Dead Ends

- **Using the wrong keychain item.** Most entries have `svce = preview` and are
  decoys. Match on **both** `acct == prefs.account` **and** `svce == com.northern.lights`.
- **Reading `.plist` files with `cat`.** They are Apple binary plists; use Python's
  `plistlib` (or `plutil` on macOS). `cat` only shows mojibake.
- **Getting the GCM layout wrong.** It is `nonce(12) ‖ ciphertext ‖ tag(16)`, and
  GCM wants `ciphertext + tag` as one argument. Passing the tag separately causes an
  `InvalidTag` error.
- **Submitting the decrypted value instead of the `/submit` response.** The internal
  answer unlocks the gate; the *flag* is the value inside `message` with `"ok":true`.
- **Wasting time on `Manifest.db`/the `d4/` path.** The iOS "Manifest.db" layout is a
  nice detail but here the file is just the encrypted blob; the real path is
  prefs → keychain → blob.

## 9. How to Defend Against This

- **Keep key material out of backups.** Store the key in the platform keystore with
  "this device only / not backed up" protection.
- **Do not derive keys from identifiers that ship with the data** (account names,
  device IDs). Use a user passphrase or a hardware secret as the root secret.
- **Encrypt with authenticated modes** (AES-GCM / ChaCha20-Poly1305) and fail closed
  on tag mismatch — this one already does.
- **Audit what a full device export actually contains** before collecting or sharing
  backups; treat them as sensitive data with a retention policy.
- **Rotate secrets** if a backup containing key material ever leaves a trusted device.

## 10. Key Takeaways

- An iOS backup looks like `Manifest.db` + `Keychain.plist` + `Library/Preferences/*.plist`
  + hashed blob paths.
- Read binary `.plist` files with `plistlib`, not `cat`.
- Match keychain entries on both `acct` and `svce`; decoys are common.
- Key recipe: `PBKDF2-SHA256(v_Data + account, salt, iterations, 32)`; blob layout:
  `nonce[12] ‖ ct ‖ tag[16]`.
- Save to your cheatsheet:
  `python3 -c "import plistlib;print(list(plistlib.load(open('Keychain.plist','rb'))['items'][0].items()))"`
- **Internal answer:** `safctf{5068e894-3542-4574-ad65-1a5bfddd75eb}`
- **Flag:** `safctf{3fd96340be891c629f7e3f3a42202743}`

Great job — you followed a Swift comment all the way to a decrypted iOS backup
secret.
