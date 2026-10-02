# Fancy Details — Beginner Writeup (EXIF Clue → Encrypted Archive)

> **Assumptions stated up front:** The service was event-local and may be offline now; all
> requests, filenames, and the flag below are the real ones from the solve. The intended
> path uses only command-line tools a beginner can copy-paste — **no Python needed**.

---

## 1. Challenge Overview

**Fancy Details** is a **Forensics** challenge from the **Safaricom CTF (safctf)**. A small
"travel photography" website hands you two downloads: a **photo** and an **encrypted
archive**. The goal is to find a hidden clue in the photo's hidden data, use it to **decrypt
the archive**, and read the flag inside.

- Category: **Forensics (metadata + crypto)**
- Difficulty: **Medium (300 points)**
- Service: `http://54.72.82.22:8210` (event-local; may be offline after the CTF)
- Flag: `safctf{245ccf0110f6422d41671064cee8da68}`

The method starts in Section 3 — no spoilers here.

---

## 2. What You Need Before Starting

Everything here is command-line and beginner-safe. Budget **30 to 50 minutes**.

**Tools:**

- **curl** — download files from the web:
  ```
  sudo apt install curl
  ```
- **exiftool** — reads **metadata** (hidden info stored *inside* a photo file):
  ```
  sudo apt install libimage-exiftool-perl
  ```
- **openssl** — does encryption/decryption; already on Kali. If missing:
  ```
  sudo apt install openssl
  ```
- **binwalk** (optional) — scans a file for other files hidden inside it:
  ```
  sudo apt install binwalk
  ```
- **file**, **tr**, **rev**, **tar** — already installed on every Linux system.

**Accounts / VPN:** none. Just download the two files over HTTP.

---

## 3. Reconnaissance

**Step 1 — Open the site and see what it offers.** Visiting `http://54.72.82.22:8210` shows
a photography page with two download links: **`photo.jpg`** and **`archive.tar.gz.enc`**.

[SCREENSHOT: the Fancy Details homepage showing the photo.jpg and archive.tar.gz.enc links]

**Step 2 — Download both files with curl.**

```
curl -s -o photo.jpg            http://54.72.82.22:8210/downloads/photo.jpg
curl -s -o archive.tar.gz.enc   http://54.72.82.22:8210/downloads/archive.tar.gz.enc
```

**Step 3 — Ask Linux what each file actually is.** The `file` command inspects a file's
contents (not just its name) and names the format.

```
file photo.jpg archive.tar.gz.enc
```

Output:

```
photo.jpg:          JPEG image data, JFIF standard 1.01, Exif Standard ...
archive.tar.gz.enc: openssl enc'd data with salted password
```

In plain English: one is a normal **JPEG photo**, the other is a file that was **encrypted
by OpenSSL** using a password. That `.tar.gz.enc` name means "a `.tar.gz` archive that was
then encrypted." We need the **password** to open it — and a photo rarely ships beside an
encrypted file by accident, so the password is probably hidden *in the photo*.

**Step 4 — Read the photo's metadata.** **Metadata** is extra information stored inside a
file that you don't see in the picture itself — camera model, GPS, timestamps, author, etc.
On a JPEG this is called **EXIF**. We read it with **exiftool**:

```
exiftool photo.jpg
```

Representative output (trimmed to the interesting line):

```
Artist                          : qebjffnc
GPS Latitude                    : 52 deg 28' 48.00"
GPS Longitude                   : 1 deg 53' 24.00"
Image Size                      : 1024x1024
```

[SCREENSHOT: exiftool output with the Artist field "qebjffnc" highlighted]

**Why this matters:** almost every field looks normal, but **`Artist: qebjffnc`** is
gibberish — it's not a real name. In forensics, the thing that *doesn't belong* is usually
the clue. That odd string is what we investigate next.

**Step 5 — Sanity-check that nothing is simply appended to the image.** Sometimes files are
hidden by gluing them onto the end of a photo. `binwalk` scans for that:

```
binwalk photo.jpg
```

Output (only the JPEG/EXIF structures, nothing extra):

```
DECIMAL   HEXADECIMAL   DESCRIPTION
0         0x0           JPEG image data, JFIF standard 1.01
30        0x1E          TIFF image data (EXIF)
```

Nothing is smuggled inside the image. So the clue is purely that odd **Artist** string.

---

## 4. Identifying the Vulnerability

This isn't a "server bug" vulnerability — it's a **forensics puzzle** with two concepts:
**metadata hiding** and **weak secret handling**.

**Define the terms (first time):**

- **EXIF metadata** = hidden descriptive fields inside a photo. Anyone can write anything
  into them, so a challenge author can stash a clue in a field like **Artist**.
- **ROT13** = the simplest "cipher": shift each letter 13 places in the alphabet
  (A↔N, B↔O, …). It's not real security — it's just light obfuscation to hide text from a
  casual glance.
- **OpenSSL "salted" encryption** = OpenSSL turns a password into an encryption key, mixing
  in a random **salt** so the same password gives different output each time. The file
  begins with the word `Salted__`, which is why `file` recognized it.
- **PBKDF2** = "Password-Based Key Derivation Function 2." It hashes the password many
  times (an **iteration count**) to turn it into the key. More iterations = slower = harder
  to brute-force. You must use the **same iteration count** to decrypt that was used to
  encrypt.

**The clue chain:** the `Artist` field `qebjffnc` is ROT13 text. Decoding it reveals the
archive password. The "trap" is in the decryption **settings**: the archive was made with a
**non-default PBKDF2 iteration count**, so the obvious decrypt commands fail even with the
correct password — which fools you into thinking the password is wrong.

**What tipped us off:**

1. A photo delivered next to an encrypted archive → the photo likely carries the key.
2. One EXIF field (`Artist`) is gibberish → it's encoded, not a real value.
3. `file` said the archive is "openssl enc'd with salted password" → we know exactly which
   tool and format decrypts it.

---

## 5. Exploitation Step by Step

**Step 1 — Decode the EXIF clue with ROT13.** `tr` ("translate") swaps characters; this
pattern maps A–Z and a–z through a 13-shift, which is ROT13.

```
echo "qebjffnc" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

Output:

```
drowssap
```

That reads like **"password" spelled backwards**. Reverse it to be sure:

```
echo "drowssap" | rev
```

Output:

```
password
```

So the candidate password is simply **`password`**. (The author's little joke: a clue that
decodes to the word "password.")

[SCREENSHOT: terminal showing qebjffnc -> drowssap -> password]

**Step 2 — First decrypt attempt (the obvious one).** For modern OpenSSL files you add
`-pbkdf2`. The flag "`-d`" means decrypt.

```
openssl enc -d -aes-256-cbc -pbkdf2 -pass pass:password \
  -in archive.tar.gz.enc -out arc.tar.gz
```

Expected output:

```
bad decrypt
... ossl_cipher_unpadblock:bad decrypt ...
```

**"bad decrypt" does not necessarily mean the password is wrong.** It means *the derived key
didn't fit* — which also happens when the **iteration count** doesn't match. Keep the
password; change the settings.

**Step 3 — Also rule out the legacy key method.** Older OpenSSL files use an MD5-based key
derivation instead of PBKDF2. Try it so you know it's not that:

```
openssl enc -d -aes-256-cbc -md md5 -pass pass:password \
  -in archive.tar.gz.enc -out arc.tar.gz
```

Expected output:

```
*** WARNING : deprecated key derivation used.
bad decrypt
```

Still "bad decrypt." So it's PBKDF2 — just with a different iteration count than the default.

**Step 4 — Try a higher PBKDF2 iteration count.** OpenSSL's default is **10000**. Authors
often bump this to a round number like **100000**. We tell OpenSSL the count with
`-iter`:

```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -pass pass:password \
  -in archive.tar.gz.enc -out arc.tar.gz
```

This time there is **no error** — the command succeeds silently. Confirm the result is a
real archive:

```
file arc.tar.gz
```

Output:

```
arc.tar.gz: gzip compressed data, ...
```

A valid **gzip** archive. The password *was* `password` all along; the only trick was the
iteration count.

[SCREENSHOT: terminal showing the -iter 100000 decrypt succeeding and file reporting gzip data]

**Step 5 — Extract the archive.** `tar` unpacks it; `xzf` means "extract, gzip, file."

```
tar xzf arc.tar.gz
ls
```

Output:

```
arc.tar.gz   nested1.tar
```

Inside is **another** archive, `nested1.tar`. Unpack that one too:

```
tar xf nested1.tar
ls
```

Output:

```
arc.tar.gz   flag.txt   nested1.tar
```

There's our **`flag.txt`**.

---

## 6. Capturing the Flag

Read the extracted file:

```
cat flag.txt
```

Output:

```
safctf{245ccf0110f6422d41671064cee8da68}
```

**That's the flag:** `safctf{245ccf0110f6422d41671064cee8da68}`. It came from `flag.txt`
inside the nested tar, which came from decrypting `archive.tar.gz.enc` with the password
hidden (ROT13'd) in the photo's EXIF **Artist** field.

---

## 7. Why This Works (Beginner Explanation)

Photos carry a lot of invisible baggage. Every JPEG has an **EXIF** block — a little
notebook glued to the picture holding the camera, date, GPS, and author. You never see it
while looking at the image, but tools like **exiftool** read it instantly. A CTF author can
scribble a secret into any field, and the challenge becomes "did you think to open the
notebook?"

The second half is about how passwords become encryption keys. You can't encrypt with the
word "password" directly — software first stretches it into a proper key using a function
like **PBKDF2**, repeated thousands of times. Both sides must agree on the recipe: the
cipher (**AES-256-CBC**), the salt (stored in the file), and the **iteration count**. Get
the recipe wrong and you get "bad decrypt" — which *feels* like a wrong password but isn't.
Learning to separate "wrong password" from "wrong settings" is the real lesson.

In the real world this matters both ways. Companies leak secrets by shipping files with
revealing EXIF/metadata still attached (home addresses from photo GPS, internal usernames in
document properties). And defenders rely on strong key-derivation settings — high iteration
counts — precisely so that even a known-weak password like "password" is expensive to attack.

---

## 8. Common Mistakes and Dead Ends

- **Giving up at "bad decrypt" and assuming the password is wrong.** This is the big one.
  The password `password` was correct the whole time; only the `-iter` value was off. When
  OpenSSL says "bad decrypt," change the **settings** (iteration count, `-md`, cipher)
  before you doubt the password.
- **Brute-forcing with a wordlist and trusting a weak success check.** We briefly tried a
  rockyou brute that flagged a "hit" on `120489` because the output started with the gzip
  magic bytes **`1f 8b`** — pure coincidence (two bytes match by chance fairly often). The
  fix was to verify **three** bytes `1f 8b 08` *and* actually confirm the key derivation,
  which killed the false positive. Lesson: your "did it work?" test must be strict.
- **Only reading the obvious EXIF fields.** Beginners glance at camera model and stop. Run
  full `exiftool` output and hunt for the field that looks *wrong* (here, a gibberish
  `Artist`).
- **Forgetting the archive is nested.** The first `tar` gives another `.tar`. If you stop at
  the first extraction you'll think there's no flag. Keep unpacking until you hit a plain
  file.

---

## 9. How to Defend Against This

- **Strip metadata before publishing files.** Run `exiftool -all= file.jpg` (or an equivalent
  scrubber) so photos don't leak author names, GPS, or secrets.
- **Never hide secrets in metadata or encoding.** ROT13 and "hidden" EXIF fields are
  obfuscation, not security — anyone with free tools reads them in seconds.
- **Don't rely on weak passwords, even behind strong crypto.** `password` is the first word
  any attacker tries. Use long, random passphrases for anything that matters.
- **Use strong, standard key-derivation settings** (PBKDF2 with a high iteration count, or
  better, scrypt/argon2) — but understand this only buys time; it never rescues a guessable
  password.
- **Treat "encrypted blob + the key material nearby" as a design smell.** If the key can be
  recovered from something shipped alongside the ciphertext, the encryption is theater.

---

## 10. Key Takeaways

- **Always open the metadata.** `exiftool file.jpg` is a 2-second check that solves a
  surprising number of forensics challenges.
- **"bad decrypt" ≠ "wrong password."** Try `-pbkdf2`, then `-iter 100000` (and other round
  numbers), then `-md md5`, before abandoning a password you have good reason to trust.
- **ROT13 by hand:** `echo "text" | tr 'A-Za-z' 'N-ZA-Mn-za-m'` — and `rev` to reverse a
  string. Worth saving to your cheatsheet.
- **Decrypt-and-unpack combo to remember:**
  ```
  openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -pass pass:PASS -in file.enc -out out.tar.gz
  tar xzf out.tar.gz
  ```
- **Verify your "success" strictly** (check real file magic / use `file`) so a lucky-looking
  byte match doesn't send you chasing a false flag.

You just chained **metadata forensics** and **real-world crypto** into one solve — that's
exactly how professionals pull secrets out of "innocent" files. Keep opening the notebook;
the clue is almost always hiding in plain sight. 🚩




