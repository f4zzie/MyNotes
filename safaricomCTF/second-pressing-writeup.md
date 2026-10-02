# Second Pressing — Beginner Writeup (SQLite WAL Forensics)

> **Category:** Forensics · **Event:** Safaricom CTF (safctf) · **Difficulty:** Medium (250 pts)
> **Flag:** `safctf{12bbc51d-7450-44c6-af3f-1723514b8aad}`

## 1. Challenge Overview

**Second Pressing** is a **forensics** challenge: you download a small bundle of files and
have to recover a secret that the application *thinks* it already deleted. The theme is a
vinyl record shop ("the needle drops... between the first play and the replay, something
feels different... there's more hidden in the replay"). The **goal** is to find the flag
hidden inside a database that, at first glance, looks empty.

The whole challenge lives in one download, `listening-room.zip`, so there is no live service
to attack — just files to inspect on your own machine.

## 2. What You Need Before Starting

Everything here is standard on Kali Linux. Budget **20 to 40 minutes** as a beginner.

- **unzip** — extracts `.zip` files. Install: `sudo apt install unzip`
- **file** — tells you what type a file is. Already installed (part of `file` package).
- **sqlite3** — the command-line SQLite database client. Install: `sudo apt install sqlite3`
- **xxd** — shows a file's raw bytes (a "hex dump"). Ships with `vim-common`/`xxd`.
- **strings** — prints readable text found inside a binary file. Part of `binutils`.
- **base64** — decodes Base64 text. Already installed (coreutils).
- **python3** — used for exactly **one** short decode line at the end, and we explain why.
  Install: `sudo apt install python3`

No accounts, VPN, or network access needed. Download the zip and go.

## 3. Reconnaissance

**Step 1 — Download and unzip the bundle.**

```
unzip listening-room.zip
```

Expected output:

```
Archive:  listening-room.zip
  inflating: library.db
  inflating: library.db-wal
  inflating: library.db-shm
  inflating: desk.log
```

What this tells us: we got a **SQLite database** (`library.db`) *plus two sidecar files*,
`library.db-wal` and `library.db-shm`. Those two extra files are a big clue — most people
only ever see the single `.db`. Hold that thought.

[SCREENSHOT: terminal showing the four extracted files]

**Step 2 — Identify each file with `file`.**

```
file *
```

Expected output (trimmed):

```
library.db:      SQLite 3.x database, ...
library.db-wal:  SQLite Write-Ahead Log, version 3007000
library.db-shm:  SQLite Write-Ahead Log shared memory, ...
desk.log:        ASCII text
```

So `library.db-wal` is a **SQLite Write-Ahead Log (WAL)**. In plain terms, a **WAL is a
change-log file**: before SQLite writes a change permanently into the main `.db`, it first
appends the new version of the data into this `-wal` file. Think of it as the database's
"scratch pad / undo journal." The challenge hint — *"more hidden in the replay"* — is
pointing straight at this log.

**Step 3 — Peek at `desk.log` for context.**

```
cat desk.log
```

Expected output:

```
16:41 test pressing queued
16:42 catalogue revised
16:43 counter closed
```

Just flavor: something was queued, then "revised," then closed. "Revised" hints a value was
**changed** — and changes are exactly what a WAL records.

**Step 4 — Look at the "current" database contents.**

> ⚠️ **Read this before running sqlite3.** Opening the database with the `sqlite3` tool can
> **checkpoint** the WAL — meaning it folds the log into the main `.db` and then **deletes**
> the `-wal`/`-shm` files. That would destroy the very evidence we need. So **first make a
> safe copy of all four files**, and only ever experiment on the copy:
>
> ```
> mkdir safe && cp library.db* desk.log safe/ && cd safe
> ```

Now, just to see what the app *wants* you to see, dump the live tables:

```
sqlite3 library.db ".tables"
sqlite3 library.db ".dump"
```

Expected output:

```
pressings
...
CREATE TABLE pressings(id INTEGER PRIMARY KEY,title TEXT,receipt TEXT);
INSERT INTO pressings VALUES(1,'Test pressing','withdrawn');
COMMIT;
```

What this tells us: there's one row, and its `receipt` is the word **`withdrawn`**. The flag
looks gone — it was "withdrawn." But remember: a WAL keeps **old versions** of changed rows.
The real receipt was probably overwritten *to* `withdrawn`, and the original still sits in
the log.

## 4. Identifying the Vulnerability

This isn't a code "vulnerability" like a login bypass — it's a **data-recovery / forensics**
flaw: **deleted or overwritten data is not actually gone.**

- **What a WAL is (recap):** SQLite's Write-Ahead Log is a file where new row versions are
  written *before* they're merged into the main database. Until a "checkpoint" happens, the
  log can contain **both** the new value **and** the old value of a row.
- **Root cause:** the app changed the secret `receipt` to `withdrawn`, assuming that hid it.
  But the pre-change value was still physically present in `library.db-wal`. Nobody wiped the
  log.

**Analogy:** You scribble a secret on a whiteboard, then wipe it and write "nothing here."
But you also kept the **carbon-copy notepad** you were pressing on — and the original is
still legible on the sheet underneath. The `-wal` file is that notepad.

**What tipped us off:** (1) the unusual presence of `-wal`/`-shm` sidecar files, (2) the
log entry "catalogue **revised**," and (3) the challenge's own hint about the **replay**.

## 5. Exploitation Step by Step

We never let the database engine "fix up" the files. We read the **raw bytes** of the WAL
instead. Work on your **copy** from Section 3, Step 4.

**Step 1 — Pull readable text out of the WAL file.**

What/why: `strings` prints any run of readable characters inside a binary. The old receipt
is text, so it should show up.

```
strings library.db-wal
```

Expected output (the interesting line):

```
Test pressing
eJwrTkxLLkmrNjRKSko2NUzRNTcxNdA1MUk2001MM07T...
withdrawn
```

What to look for: a long token that starts with **`eJw`**. That prefix is the dead giveaway
of a **zlib-compressed blob encoded in Base64** (`eJw` is the Base64 of zlib's standard
header bytes `78 9c`). So the original receipt wasn't plain text — it was **compressed and
then Base64-encoded**.

[SCREENSHOT: strings output highlighting the eJw... token sitting next to 'withdrawn']

**Step 2 — Confirm with the raw bytes (optional sanity check).**

What/why: `xxd` shows exactly where that token lives, so you trust it's real data and not a
display glitch.

```
strings -t x library.db-wal | grep eJw
```

Expected output:

```
<offset>  eJwrTkxLLkmrNjRKSko2NUzRNTcxNdA1MUk2001MM07T...
```

> ⚠️ **Gotcha we hit:** the *same* `eJw...` token also appears inside `library.db`, but there
> it is **cut off at the page boundary** (a database page is a fixed size, and the leftover
> old value gets clipped). Decoding that truncated copy gives only **half** the flag. The
> **complete** blob lives in `library.db-wal`. Always carve it from the `-wal`.

**Step 3 — Base64-decode the token.**

What/why: strip the Base64 layer to get the raw compressed bytes. Copy the full `eJw...`
string from Step 1 into the command below (no spaces, no trailing dots):

```
echo 'eJwrTkxLLkmrNjRKSko2NUzRNTcxNdA1MUk2001MM07T...' | base64 -d > receipt.zlib
```

Expected output: no screen output, but a new file `receipt.zlib` appears. Check it:

```
xxd receipt.zlib | head -1
```

```
00000000: 789c ...   x...
```

Seeing **`78 9c`** at the very start confirms it's a **raw zlib stream** — we're on track.

**Step 4 — Inflate (decompress) the zlib stream.**

What/why: now we undo the compression to reveal the text. Here we use **one short Python
line** — *and here's the honest reason:* a **raw zlib** stream (header `78 9c`) is **not**
the same as a `.gz` file, so everyday tools like `gunzip`/`zcat` refuse it; Python's `zlib`
module handles raw zlib in a single call, which is the simplest reliable option.

```
python3 -c "import sys,zlib;sys.stdout.buffer.write(zlib.decompress(open('receipt.zlib','rb').read()))"
```

Expected output:

```
safctf{12bbc51d-7450-44c6-af3f-1723514b8aad}
```

There's the flag.

[SCREENSHOT: terminal showing the decompressed flag]

## 6. Capturing the Flag

The flag appeared as the **decompressed original value** of the `receipt` column — the value
that was overwritten with `withdrawn`. End to end, starting from the extracted files:

1. `strings library.db-wal` → copy the full `eJw...` token.
2. `echo 'eJw...' | base64 -d > receipt.zlib` → raw zlib bytes.
3. `python3 -c "import zlib;print(zlib.decompress(open('receipt.zlib','rb').read()).decode())"`

Flag:

```
safctf{12bbc51d-7450-44c6-af3f-1723514b8aad}
```

## 7. Why This Works (Beginner Explanation)

Databases care about **speed and crash-safety**, not about shredding your old data. SQLite's
WAL mode writes every change into a side log first; the main `.db` only gets updated later,
during a "checkpoint." Until that merge happens, the log holds a little history — including
values the application believes it has replaced.

Back to the whiteboard-and-notepad analogy: wiping the board (`UPDATE ... SET receipt =
'withdrawn'`) changes what people *see*, but the pressure-copy on the notepad (the WAL) still
carries the original. Forensics is largely the art of finding those leftover copies —
in logs, journals, free space, swap files, and temp files.

This matters in the real world: when an app "deletes" or "redacts" a record, the bytes often
linger in WALs, database backups, replication logs, or disk slack. Investigators recover
deleted chat messages and overwritten records exactly this way — and defenders must assume
"overwritten in the app" is **not** the same as "destroyed on disk."

## 8. Common Mistakes and Dead Ends

- **Opening the DB with `sqlite3` before copying the files.** The client can checkpoint and
  **delete** the `-wal`/`-shm`, erasing the evidence. We hit this: after a careless
  `sqlite3 library.db .dump`, the WAL was gone and we had to **re-extract from the zip**.
  Always copy (or re-unzip) first and treat the files as read-only.
- **Decoding the `eJw...` copy found in `library.db` instead of the WAL.** That copy is
  **truncated at the page boundary**, so you only recover `safctf{12bbc51d-7450-44c6-af3f`
  and then a confusing error. The full stream is in `library.db-wal`.
- **Trusting `.dump` as "the whole truth."** `.dump` shows the *committed* state
  (`withdrawn`), not the historical row versions sitting in the log. The data you want is
  deliberately *not* in the normal dump.
- **Trying `gunzip`/`zcat` on the blob.** It's **raw zlib**, not gzip, so those tools error
  out. Decompress it as zlib (the one Python line) instead.

## 9. How to Defend Against This

- **Checkpoint and truncate the WAL before exporting or sharing a database.** Run
  `PRAGMA wal_checkpoint(TRUNCATE);` (or `VACUUM`) so stale row versions don't ride along in
  a handed-off file.
- **Never ship `-wal`/`-shm` sidecar files** (or raw DB backups) to untrusted parties; export
  a clean dump of only the data you intend to reveal.
- **Treat "overwrite" as not equal to "erase."** For true secrets, store them encrypted so a
  leftover copy is useless, or delete+VACUUM+rotate storage rather than just `UPDATE`-ing a
  column.
- **Keep secrets out of the database entirely** when possible (use a secrets manager), so a
  leaked DB file never contains them in any version.
- **Scrub derived artifacts too** — backups, replication logs, and temp journals can hold the
  same stale values.

## 10. Key Takeaways

- A **SQLite `-wal` file is a change log** that can hold **old, "overwritten" values** — a
  prime forensics target.
- `file *` instantly reveals when you've been handed a WAL/`-shm` alongside a `.db`; the
  sidecars are the hint.
- **Copy evidence before touching it** — opening a DB with `sqlite3` can checkpoint and
  delete the WAL.
- **`eJw...` means Base64-of-zlib**, and raw-zlib bytes start with **`78 9c`** — memorize
  these two signatures.
- Cheatsheet to save:
  ```
  file *                                   # spot WAL/-shm sidecars
  strings library.db-wal | grep eJw        # carve the hidden blob
  echo 'eJw...' | base64 -d > blob.zlib    # un-Base64
  xxd blob.zlib | head -1                  # expect 78 9c (zlib)
  python3 -c "import zlib;print(zlib.decompress(open('blob.zlib','rb').read()).decode())"
  ```

You just recovered data an application tried to throw away — that's real digital forensics,
and you did it with five commands. Keep going; every leftover byte tells a story.

### Advanced Alternative (optional)

If you'd rather script the whole carve-and-decode in one go (handy when there are many blobs),
this reads the WAL, finds every `eJw...` token, and prints whatever decodes to text:

```python
import re, base64, zlib
data = open('library.db-wal','rb').read()
for tok in re.findall(rb'eJw[A-Za-z0-9+/]+={0,2}', data):
    try:
        print(zlib.decompress(base64.b64decode(tok)).decode())
    except Exception:
        pass
```

This is optional — the manual steps above fully solve the challenge.

