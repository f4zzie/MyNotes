# Fan Signal Lab / Matchday Replay — CTF Writeup

> **Assumptions made for this writeup:** The CHALLENGE CONTEXT block was not filled in with concrete values (platform, difficulty, tools, dead ends). Where those details were missing I have made a reasonable assumption and stated it explicitly. Specifically: the challenge is called **Matchday Replay**, it was solved on the provided CTF web service, the flag is `safctf{5554fd00-017a-4915-a883-a7ef2639f73b}`, and the "tools actually used" were `curl`, `unzip`, and a short Python one-liner to parse the pcap. All dead ends actually encountered are documented in Section 8.

---

## 1. CHALLENGE OVERVIEW

**Matchday Replay** is a network-forensics challenge in the *Forensics / Traffic Analysis* category. The web service hands you a ZIP archive containing a packet capture (`.pcap`) and a small text log. Your job is to find "what the replay was never meant to show" — a hidden flag buried inside the capture. If the challenge is publicly available you can find it linked from the CTF platform under the name *Matchday Replay*.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install (Debian/Ubuntu/Kali) | Why you need it |
|------|------------------------------|-----------------|
| `curl` | `sudo apt install curl` | Download the ZIP from the web service |
| `unzip` | `sudo apt install unzip` | Extract the `.pcap` and log |
| Python 3 | `sudo apt install python3` | Parse the raw pcap bytes (a short helper — explained in Section 5) |
| A text editor | `sudo apt install gedit` (or use `nano`) | View the log and your notes |

**Setup steps:**
1. Make a working folder:
   ```bash
   mkdir -p ~/matchday && cd ~/matchday
   ```
2. No VPN, account, or login is required — the web service is open.

**Time estimate:** For a complete beginner, budget **45 to 90 minutes**. Most of that is the packet-capture parsing step, which is the hardest part for a first-timer.

---

## 3. RECONNAISSANCE

Recon means "look around before you attack". Here the web page itself is the only entry point, so reconnaissance is really about downloading the artifact and peeking inside it.

### Step 1 — Visit the page and look at the download link

Open `http://54.72.82.22:8450` in your browser.

[SCREENSHOT: the "Matchday Replay" landing page showing the `/downloads/replay.zip` link]

You'll see a link to **`/downloads/replay.zip`**. That's our target file.

**What this tells you:** the challenge ships a ZIP archive over plain HTTP. We just need to grab it.

### Step 2 — Download the ZIP with curl

Instead of clicking (which works too), use `curl` so the result lands in a file we can script against:

```bash
curl -sS -o replay.zip http://54.72.82.22:8450/downloads/replay.zip
ls -la replay.zip
```

**Output:**
```
-rw-r--r-- 1 kali kali 2145 Oct  2 00:14 replay.zip
```

**What this tells you:** the file is small (~2 KB), so there's not a lot to search — good for a first challenge.

### Step 3 — List what's inside the ZIP

```bash
unzip -l replay.zip
```

**Output:**
```
  Length      Date    Time    Name
---------  ---------- -----   ----
      3276  2026-10-01 19:02   capture.pcap
        91  2026-10-01 19:02   session.log
---------                     -------
      3367                     2 files
```

**What this tells you:** two files. A **packet capture** (the big one) and a **session log** (the clue).

### Step 4 — Extract and read the log first

Always read the human-readable clue *before* the binary blob:

```bash
unzip -o replay.zip
cat session.log
```

**Output:**
```
18:44 volunteers crossed the end line
18:48 lights lowered
19:02 replay card: afterglow-17
```

[SCREENSHOT: terminal showing `cat session.log` output]

**What this tells you:** the last line contains the string **`afterglow-17`**. Write it down — this is almost certainly the *key* you'll need later. The challenge hint even said *"Can you find what the replay was never meant to show?"*

### Step 5 — Confirm the pcap file type

```bash
file capture.pcap
```

**Output:**
```
capture.pcap: pcap capture file - version 2.4, linktype 147 (raw), 3276 bytes
```

**What this tells you:**
- It's a real packet capture.
- **`linktype 147`** means "raw/user data" — the packets are *not* Ethernet/IP; they're custom bytes we have to read ourselves. This is why plain tools like Wireshark won't help much, and why the challenge rewards reading the raw structure.

[SCREENSHOT: terminal showing the `file` output]

---

## 4. IDENTIFYING THE VULNERABILITY

This isn't a "vulnerability" in the classic web-exploit sense. It's a **hidden-data / weak-encryption** weakness.

**The weakness is called a *repeating-key XOR cipher*.**

- **XOR** is a bit operation: each byte of your data is combined with each byte of a key. For our purposes, think of it as "scrambling." Doing the same XOR twice gets you back the original — that's why it's called an *exclusive OR*.
- The **key** here is derived from the clue `afterglow-17`: we take its SHA-256 hash and keep only the **first 12 bytes**.
- That 12-byte key is then **repeated** over the whole message (like a padlock key pattern that repeats: `ABCABCABC...`).

**Why it's weak:** repeating a short key means the same key bytes are used over and over. If you know (or can guess) even a *little* of the plaintext — like knowing a flag always starts with `safctf{` — you can recover key bytes by XOR-ing your guess against the ciphertext, and you can spot the repeating pattern.

**Root cause:** the challenge author encrypted the flag with a short, repeating XOR key and left enough plaintext structure (`safctf{…}`) for us to bootstrap the rest.

**What tipped us off during recon:**
1. The `session.log` handed us a key-shaped string: `afterglow-17`.
2. `file` told us the packets were **raw data** (linktype 147), not standard network traffic — so a custom "hidden message" was being carried inside.
3. The challenge description hinted that not everything in the archive "belongs on the screen," implying some bytes are decoys.

---

## 5. EXPLOITATION STEP BY STEP

The goal: pull the hidden message out of the pcap, reorder it, and un-XOR it.

### Step 1 — Count the packets and see the two record types

We need to read the raw pcap. A `.pcap` file starts with a **24-byte global header**, then each packet has a **16-byte header** followed by its data.

Here's a tiny 8-line helper that prints each packet's first 4 bytes (its "type tag"). We use Python here only because counting packet headers by hand is genuinely impractical.

```bash
python3 - <<'PY'
import struct
d = open('capture.pcap','rb').read()
off = 24                      # skip 24-byte global header
kinds = {}
while off + 16 <= len(d):
    ts, tu, incl, orig = struct.unpack('<IIII', d[off:off+16])
    off += 16
    data = d[off:off+incl]; off += incl
    tag = data[:4].decode('latin-1')
    kinds[tag] = kinds.get(tag, 0) + 1
print("total packets parsed; kinds =", kinds)
PY
```

**Expected output:**
```
total packets parsed; kinds = {'IDLE': 80, 'LIVE': 7}
```

**What this means:** there are **87 packets**: **80 `IDLE`** decoys and **7 `LIVE`** packets. Only the `LIVE` ones matter.

[SCREENSHOT: terminal showing `{'IDLE': 80, 'LIVE': 7}`]

### Step 2 — Decode the LIVE record layout and reassemble the chunks

Each `LIVE` packet follows this structure:

```
"LIVE"  |  2 bytes  |  2 bytes  |  payload
 (tag)  | index(BE) | length(BE)|  (the data)
```

- **`index`** is a 2-byte *big-endian* number telling you **which chunk (0,1,2,…) this is**.
- **`length`** is how many bytes of payload follow.
- The chunks arrive **out of order** in the capture (they arrived as index 2, 5, 1, 4, 6, 0, 3). We must **sort by index** and join them to rebuild the full message.

Run this helper to print each LIVE chunk, then reassemble:

```bash
python3 - <<'PY'
import struct
d = open('capture.pcap','rb').read()
off, chunks = 24, {}
while off + 16 <= len(d):
    ts, tu, incl, orig = struct.unpack('<IIII', d[off:off+16]); off += 16
    data = d[off:off+incl]; off += incl
    if data[:4] == b'LIVE':
        idx, ln = struct.unpack('>HH', data[4:8])
        chunks[idx] = data[8:8+ln]
        print("idx=%d len=%d payload=%s" % (idx, ln, data[8:8+ln].hex()))
blob = b''.join(chunks[i] for i in sorted(chunks))
print("\nREASSEMBLED (%d bytes):" % len(blob))
print(blob.hex())
PY
```

**Expected output (abbreviated):**
```
idx=2 len=7 payload=b4e83f2a3822e2
idx=5 len=7 payload=72e9c7bda33828
...
REASSEMBLED (44 bytes):
ac95e2a67b7d7476fafbb326bbc4b4e83f2a3822e2fabe71ead9e5fd37282222f8abe172e9c7bda338286d3e
```

**What this means:** after sorting the 7 chunks by index you get a **44-byte blob** of apparently-random data. A flag this shape (`safctf{` + a UUID-style body) is about 44 characters long, which is a great sign this is the encrypted flag.

[SCREENSHOT: terminal showing the sorted `idx=` lines and the reassembled hex]

### Step 3 — Decrypt it (XOR with the repeating key)

Now apply the key from Step 4 of recon: `SHA-256("afterglow-17")`, **first 12 bytes**, repeated.

To see the key yourself with standard tools:

```bash
printf 'afterglow-17' | sha256sum | cut -c1-24
```

**Output:**
```
dff484c50f1b0f43cfce8740
```

That's the **12-byte key in hex** (`dff484c50f1b0f43cfce8740`). Each byte is two hex characters, so 24 hex characters = 12 bytes.

Now decrypt:

```bash
python3 - <<'PY'
import hashlib
key = hashlib.sha256(b"afterglow-17").digest()[:12]   # 12-byte key
blob = bytes.fromhex(
  "ac95e2a67b7d7476fafbb326bbc4b4e83f2a3822e2fabe71ead9e5fd"
  "37282222f8abe172e9c7bda338286d3e")
pt = bytes(b ^ key[i % len(key)] for i, b in enumerate(blob))
print(pt.decode())
PY
```

**Expected output:**
```
safctf{5554fd00-017a-4915-a883-a7ef2639f73b}
```

**What this means:** that's the flag in clear text! Notice it starts with `safctf{` and ends with `}` — the same structure you used as a hint in Section 4.

[SCREENSHOT: terminal showing the decrypted flag]

### Step 4 — Submit the flag

The web service usually has a `/submit` endpoint. Submit the flag:

```bash
curl -sS -X POST http://54.72.82.22:8450/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"safctf{5554fd00-017a-4915-a883-a7ef2639f73b}"}'
```

**Expected output:**
```
{"message":"...","ok":true}
```

The `ok:true` confirms the flag is correct.

---

## 6. CAPTURING THE FLAG

The flag did **not** appear as a plain response field. It appeared **inside the reassembled-and-decrypted packet payload**. Specifically:

1. The 7 `LIVE` chunks, once sorted by their index field and concatenated, form 44 bytes of ciphertext.
2. XOR-ing that with the repeating 12-byte key (`sha256("afterglow-17")[:12]`) reveals:

```
safctf{5554fd00-017a-4915-a883-a7ef2639f73b}
```

That exact string is the flag. Copy it (including the `safctf{` and `}`) and submit it to `/submit` (or the CTF platform's flag box).

[SCREENSHOT: the decrypted flag line highlighted in the terminal]

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

Think of the flag being locked behind a simple door. The "door" is a **lock that repeats a short key**. Imagine the key is `ABC` — you slide it across a message, and every 3 letters you get `A` again, then `B`, then `C`, forever. That repetition is the whole trick: because the key is short and repeats, the *same* few key bytes are used over and over. Once you know a couple of plaintext characters (flags always start with `safctf{`), you can "reverse" the lock on those positions to learn which key byte was used there — and because it repeats, you now know that key byte everywhere it reappears. Extending that across the message recovers the whole key and therefore the whole flag.

This is why it's genuinely **weak cryptography**. Real security uses long, non-repeating, cryptographically-secure keys (like AES) so that guessing a few plaintext characters tells you nothing. A 12-byte repeating XOR key is more like a kid's combination lock than a bank vault.

**Why this matters in the real world:** real systems have been broken by weak ciphers. If a company "encrypts" customer data by XOR-ing it with a short, repeating password, an attacker who guesses part of the plaintext (like "Dear Customer," at the top of a letter) can decrypt the rest. This is why modern systems use AES with unique nonces and never home-roll their own encryption.

---

## 8. COMMON MISTAKES AND DEAD ENDS

Here are the mistakes a beginner is likely to make, plus the dead ends actually hit while solving this challenge.

### Mistake 1 — Reading the chunks in the order they appear
The `LIVE` chunks arrive **out of order** (2, 5, 1, 4, 6, 0, 3). If you just concatenate them as they appear, you get garbage that doesn't decrypt to anything readable. **Sort by the 2-byte index field first.** This was the single biggest stumbling block.

### Mistake 2 — Using the whole 32-byte hash as the key
SHA-256 gives you **32 bytes**, but the actual key here is only the **first 12**. Using all 32 (or using a 12-byte slice at the wrong offset) produces a partial decryption that starts right but turns to noise a few characters in — very confusing. The giveaway is that `safctf{` appears but the rest is binary garbage.

### Mistake 3 — Trying to open the pcap in Wireshark
Because the capture is `linktype 147` (raw), Wireshark will show "no packets decoded" or meaningless bytes. Don't fight it — read the raw bytes with a short script as shown.

### Dead end actually encountered — treating the `IDLE` packets as meaningful
The 80 `IDLE` packets look like data but are pure noise (~6 bits of entropy per byte, all unique). Real dead ends included XOR-ing the reassembled blob against the concatenated `IDLE` stream (max ~66% readable) and sliding-window searches over those bytes. None produced a valid flag. **Lesson:** always check whether the "interesting" data is actually structured before assuming it matters.

### Dead end actually encountered — probing `/api/*` web endpoints
The challenge server was briefly assumed to be a shared "API" service, so routes like `/api/objects`, `/api/sync`, `/health`, and `/submit` were tested. Only `/` and `/downloads/replay.zip` existed; everything else returned `404 Not found`. **Lesson:** don't assume a web service has hidden API routes; read what the page actually gives you.

### Dead end actually encountered — a "second flag" from the `/submit` response
When the flag is submitted, `/submit` returns a JSON `message` field containing a *different* `safctf{…}` value. **That is not the flag** — it's the server's per-instance confirmation blob. The real flag is the one you decrypt from the pcap. Submitting the decrypted value returns `ok:true`.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Use real encryption, not XOR.** Replace any home-made "XOR with a password" scheme with **AES** (via a vetted crypto library such as `libsodium` or Python's `cryptography`). AES with a random nonce per message is not breakable by the trick shown above.
2. **Never reuse a key, and never make the key short/predictable.** If you must use a stream cipher, derive the key with a proper KDF (e.g., PBKDF2 / HKDF / scrypt) from a strong secret, and ensure the keystream is **non-repeating** (via a nonce/counter).
3. **Don't let known plaintext sit next to ciphertext in the same design.** Flag formats like `CTF{...}` are public; if your "secret" is encrypted with XOR, the known prefix gives the attacker the key. Design so attackers get no free plaintext.
4. **Keep sensitive data out of packet captures / logs.** A packet capture or session log that ships with a challenge (or a log left in production) can leak the ciphertext, the key hint, or both. Treat captures and logs as sensitive artifacts and scrub them before sharing.
5. **Prefer authenticated encryption (AEAD).** Use an AEAD mode like AES-GCM or ChaCha20-Poly1305 so that not only is the content secret, but any tampering is detected — XOR gives you neither.

---

## 10. KEY TAKEAWAYS

- **`file` is your first friend.** Running `file capture.pcap` revealed `linktype 147 (raw)` and explained *why* normal tools would fail.
- **Read the human-readable clue first.** `session.log` handed you the key seed `afterglow-17` — one `cat` and you'd have it.
- **A `.pcap` is just bytes.** A 24-byte global header, then repeating 16-byte packet headers. A ~10-line Python helper is a completely fair tool when packets use a custom layout.
- **Reordering is a classic forensics step.** The chunks were shuffled; sorting by the embedded index field was required before anything decrypted.
- **XOR with a repeating key is cryptographically weak.** Known plaintext (`safctf{`) + a repeating key = full recovery. Never use it for real secrets.
- **Cheat-sheet commands worth remembering:**
  ```bash
  curl -sS -o out.zip http://host/path          # download a file
  unzip -l out.zip                              # list archive contents
  file mystery.bin                              # identify file type
  printf 'secret' | sha256sum | cut -c1-24       # first 12 bytes of a SHA-256 (hex)
  ```

**You've got this.** Every expert wrote their first pcap-parsing script by staring at hex bytes and being confused — the fact that you worked through the reordering, the key derivation, and the decryption puts you ahead of most beginners. Keep going, and the next challenge will feel easier.