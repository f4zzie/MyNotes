# Blue Meridian — Beginner Writeup (Data Correlation / "Documented Departure")

## 1. Challenge Overview

**Blue Meridian** is a **web puzzle** challenge from the **Safaricom CTF (safctf)**. The site
hands us a ZIP of "field notes" and a single input box labelled **Collection receipt**. Our
**goal** is to figure out *which one* of many recorded voyages is "the documented departure,"
build a receipt string in the exact format the challenge demands, and submit it to receive the
flag.

- Category: **Web / Data-correlation puzzle** (OSINT-style cross-referencing)
- Difficulty: **Hard (550 points)**
- Service: `http://54.72.82.22:8500` (event-local; may be offline after the CTF)
- Flag: `safctf{756f7d81426571a6d6dac9b1aae5f271}`

The twist is not a classic "break the server" bug — it is reading several small files, noticing
that four separate clues all point at the **same** voyage, and getting a time format exactly right.

---

## 2. What You Need Before Starting

A beginner should budget **30 to 50 minutes** (most of it is careful reading, not hacking).

**Tools:**

- **curl** — command-line web request tool. Install on Kali/Debian/Ubuntu:
  ```
  sudo apt install curl
  ```
- **unzip** — to open the downloaded archive:
  ```
  sudo apt install unzip
  ```
- **A text editor or `jq`** — to read JSON comfortably. `jq` pretty-prints and filters JSON:
  ```
  sudo apt install jq
  ```
  (You can also just open the `.json` files in any editor — `jq` is a convenience, not a must.)
- **sha256sum** — already installed on Kali/Linux (part of `coreutils`). It computes a
  **SHA-256 hash**, a fixed-length fingerprint of some text.
- **(Optional) A web browser with DevTools** — handy to see the page and the submit box.

**Accounts / VPN:** none. Everything is plain HTTP.

---

## 3. Reconnaissance

The rule for a puzzle like this: **read every file first, understand the exact output format
second, and only then start assembling the answer.**

**Step 1 — Open the site and read the task.** Visit `http://54.72.82.22:8500`. The page says
something like *"Identify the documented departure and return its collection receipt,"* links
to **`field-notes.zip`**, and shows a single input box named **answer** with a **Send** button.

[SCREENSHOT: the Blue Meridian homepage showing the field-notes.zip link and the "Collection receipt" input box]

**Step 2 — Download and unzip the field notes.**

```
curl -s -o field-notes.zip http://54.72.82.22:8500/downloads/field-notes.zip
unzip field-notes.zip
```

Expected output:

```
Archive:  field-notes.zip
  inflating: submission.txt
  inflating: pier-note.txt
  inflating: camera-metadata.json
  inflating: voyages.json
  inflating: civic-directory.json
  inflating: tide-station.csv
```

**Step 3 — Read the instructions file first.** This is the most important file: it tells us the
*exact* shape of the answer.

```
cat submission.txt
```

Output:

```
Receipt format: SHA256(voyage_ref|station_ref|UTC_time), lowercase hex. UTC_time uses HH:MMZ.
```

Plain English: the answer is a **SHA-256 hash** of three values glued together with the pipe
character `|`:

- `voyage_ref` — an id of the chosen voyage,
- `station_ref` — the station that voyage used,
- `UTC_time` — the voyage's time in **UTC**, written as **`HH:MMZ`** (e.g. `19:00Z`).

So the whole job is: **pick the right voyage**, read its three fields, and hash them in that
exact format.

**Step 4 — Read the clue files.** These narrow 60 voyages down to one.

```
cat pier-note.txt
cat camera-metadata.json
```

Output:

```
At the exposure, the gauge was 219 cm. Clock and compass had both been serviced that morning.
```
```json
{"local_time": "2026-06-04T21:00:00", "utc_offset": "+02:00", "compass_degrees": 11, "vessel_mark": "vessel-3"}
```

We now have four facts: a **tide gauge of 219 cm**, a **local time of 21:00 at offset +02:00**,
a **compass of 11 degrees**, and a **vessel mark of vessel-3**.

[SCREENSHOT: terminal showing submission.txt, pier-note.txt and camera-metadata.json contents side by side]

**Step 5 — Look at the data we have to match against.** Peek at the voyages list:

```
jq '.[0]' voyages.json
```

Output (one voyage record):

```json
{
  "ref": "5ea9e4e9a0df442e",
  "vessel": "vessel-0",
  "station": "c04ea84e75",
  "utc_hour": 0,
  "tide_cm": 90,
  "bearing": 0
}
```

So each of the **60 voyages** has a `ref`, a `vessel`, a `station`, a `utc_hour`, a `tide_cm`,
and a `bearing`. Those fields line up beautifully with our four clues — tide, vessel, time,
and compass/bearing. That is the challenge telling us how to filter.

---

## 4. Identifying the Vulnerability

This challenge is not a code bug — it is a **data-correlation puzzle** (sometimes called an
**OSINT-style** challenge, where "OSINT" means piecing a conclusion together from several
separate pieces of information). The "vulnerability," in CTF terms, is that **enough breadcrumbs
are scattered across the files to uniquely identify one hidden record**, and the server will
reward you if you reconstruct the exact receipt for it.

**The core idea:** we have four independent clues, and the correct voyage is the **one row where
all four agree at once**. One clue alone matches several voyages; the *intersection* of all four
is unique. This is exactly how a detective narrows suspects — each fact crosses more names off
the list.

**The one genuinely tricky part — the time.** The camera records a **local** time
(`21:00`) and an **offset** (`+02:00`). The receipt wants **UTC** time. "UTC" (Coordinated
Universal Time) is the global reference clock with no offset. **An offset of `+02:00` means local
time is 2 hours *ahead* of UTC**, so to get UTC you **subtract** the offset:

```
UTC = local_time - offset = 21:00 - 02:00 = 19:00  ->  "19:00Z"
```

The trailing **`Z`** (said "Zulu") is the standard marker meaning "this time is in UTC."

The signs that told us how to solve it, straight from recon:

1. `submission.txt` spelled out the exact recipe and time format — a dead giveaway that assembly
   and formatting are the whole game.
2. Every voyage field (`tide_cm`, `vessel`, `utc_hour`, `bearing`) had a matching clue in the
   note or camera file — the challenge was handing us the filter columns.
3. The flavour text ("a single line... pointing toward somewhere that isn't marked on any
   ordinary chart") hints at *one* special route among many — i.e. a unique match.

---

## 5. Exploitation Step by Step

**Step 1 — Filter voyages by the tide gauge (219 cm).**

What/why: the pier note says the gauge read **219 cm**. Narrow the 60 voyages to those with
`tide_cm` of 219. We use `grep` with a few lines of context (`-A5` = show 5 lines after a match):

```
grep -A5 '"tide_cm": 219' voyages.json
```

(If you installed `jq`, this is cleaner and equivalent:)

```
jq '.[] | select(.tide_cm==219)' voyages.json
```

Expected output:

```json
{
  "ref": "d0b36031a079e290",
  "vessel": "vessel-3",
  "station": "5255073ff2",
  "utc_hour": 19,
  "tide_cm": 219,
  "bearing": 11
}
```

Here the tide clue alone already lands on a single voyage — but **do not trust one clue**; verify
the others agree.

[SCREENSHOT: terminal showing the jq/grep filter returning the single tide_cm=219 voyage]

**Step 2 — Check that the other three clues agree with this voyage.**

What/why: confirm this is really "the documented departure," not a coincidence.

- `vessel` = **vessel-3** matches the camera's `vessel_mark` **vessel-3**. ✅
- `utc_hour` = **19** matches our computed UTC time **19:00** (local 21:00 at +02:00). ✅
- `bearing` = **11** matches the camera's `compass_degrees` **11**. ✅

All four clues converge on the same record. We have our voyage:

```
voyage_ref  = d0b36031a079e290
station_ref = 5255073ff2
utc_hour    = 19   ->  UTC_time = 19:00Z
```

**Step 3 — Build the receipt string in the exact format.**

What/why: `submission.txt` said `voyage_ref|station_ref|UTC_time`. Pipe-separated, UTC time as
`HH:MMZ`. Our string is:

```
d0b36031a079e290|5255073ff2|19:00Z
```

**Step 4 — Hash it with SHA-256 (no Python needed).**

What/why: the receipt is the SHA-256 of that string, lowercase hex. We use `printf` (not `echo`)
on purpose: **`printf` does not add a trailing newline**, while `echo` secretly appends a `\n`
that would change the hash and give a wrong answer.

```
printf '%s' "d0b36031a079e290|5255073ff2|19:00Z" | sha256sum
```

Expected output:

```
a037d4fd49143de5d5abbe38b536198ba777879089dd3b44dec83ac1b962c845  -
```

The long hex string before the `-` is our receipt. (`sha256sum` prints the hash, then a space,
then `-` meaning "input came from the pipe.")

[SCREENSHOT: terminal showing the printf | sha256sum command and the resulting hash]

**Step 5 — Submit the receipt to the server.**

What/why: the input box posts the `answer` to `/submit` as JSON. We can do that straight from
the terminal with curl — no browser needed. (`-H` sets a header telling the server we're sending
JSON; `-d` is the data body.)

```
curl -s http://54.72.82.22:8500/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"a037d4fd49143de5d5abbe38b536198ba777879089dd3b44dec83ac1b962c845"}'
```

Expected output on success:

```json
{"message":"safctf{756f7d81426571a6d6dac9b1aae5f271}","ok":true}
```

If you see `"ok":true` and a `safctf{...}` message, you've solved it. A wrong answer instead
returns:

```json
{"message":"The request could not be completed.","ok":false}
```

[SCREENSHOT: terminal showing the curl submit returning ok:true and the flag]

> **Doing it in the browser instead:** open the site, paste the hash into the **Collection
> receipt** box, and click **Send**. Open DevTools (**F12**) → **Network** tab beforehand to
> watch the `/submit` request and read the JSON response.

### A note on the time format (this bit is fussy)

The server only accepts the time as **`19:00Z`**. We tried `19:00` (no `Z`) and `1900Z` (no
colon) and **both were rejected** with `"ok":false`. The lesson: when a challenge states a
format like `HH:MMZ`, reproduce it **character for character** — including the colon and the `Z`.

---

## 6. Capturing the Flag

The flag appeared **directly in the `/submit` JSON response** the moment we sent the correct
receipt:

```json
{"message":"safctf{756f7d81426571a6d6dac9b1aae5f271}","ok":true}
```

So the flag is:

```
safctf{756f7d81426571a6d6dac9b1aae5f271}
```

There was no second step — the server validated our SHA-256 and handed back the flag in the
`message` field.

---

## 7. Why This Works (Beginner Explanation)

Think of the four clue files as four witnesses to the same event. One witness ("the tide was
219 cm") might describe several voyages. Another ("it was vessel-3") describes several others.
But when **every** witness is describing the **same** voyage, you can be confident you've found
the one the challenge means. This "cross-referencing until only one candidate remains" is the
heart of OSINT and of a lot of real investigation work.

The second idea is **canonical formatting**. The server doesn't store your answer and
eyeball it — it computes its own SHA-256 of the expected string and checks whether your hash
matches **byte for byte**. A hash is extremely sensitive: change one character (a missing `Z`, a
sneaky trailing newline, uppercase vs lowercase) and the entire 64-character output changes
completely. That's why reproducing the exact `voyage_ref|station_ref|HH:MMZ` format mattered so
much, and why we used `printf` instead of `echo`.

In the real world this matters constantly: API signatures, software checksums, and
password/credential verification all rely on hashing a precisely-defined string. Two systems
that disagree about *exactly* what bytes to hash will never agree on the result — a common source
of real integration bugs and security mistakes.

---

## 8. Common Mistakes and Dead Ends

1. **Trusting a single clue.** The tide filter alone happened to give one voyage here, but on a
   harder variant it wouldn't. Always confirm **all** clues point at the same record before
   committing.
2. **Getting the UTC conversion backwards.** With offset `+02:00`, local time is *ahead* of UTC,
   so you **subtract** two hours (21:00 → 19:00). Adding instead (→ 23:00) gives the wrong hour
   and a wrong hash. (We actually double-checked this against the voyage's own `utc_hour: 19`,
   which is a nice built-in sanity check.)
3. **Wrong time format.** `19:00` and `1900Z` were **both rejected**. The spec said `HH:MMZ`, so
   it must be `19:00Z` — colon included, `Z` included.
4. **Using `echo` to hash.** `echo "..." | sha256sum` appends a hidden newline and produces a
   different hash than the server expects. Use `printf '%s' "..."` to hash the exact bytes.

---

## 9. How to Defend Against This

This challenge is a puzzle rather than a server flaw, but the handling of its secret files still
teaches real defensive lessons:

- **Don't ship sensitive raw data to the client.** Here the full `voyages.json` was downloadable.
  If any of those records were real secrets, publishing the whole dataset would leak them. Serve
  only what the user needs.
- **Compare secrets with constant-time comparison on the server.** When checking a submitted hash
  or token, use a timing-safe compare (e.g. `hmac.compare_digest`) so attackers can't learn the
  answer character-by-character from response timing.
- **Define one canonical string format and document it in exactly one place.** Ambiguity about
  how to build the hashed string (spacing, time format, case) causes both bugs and security gaps;
  pin it down and validate inputs against it.
- **Rate-limit the answer endpoint.** A `/submit` that silently accepts unlimited guesses invites
  brute force. Throttle attempts and log repeated failures.

---

## 10. Key Takeaways

- **Read the format spec first.** The single most important file was `submission.txt`; it defined
  the whole target. Knowing the exact output shape before you start saves huge amounts of time.
- **Cross-reference multiple clues to a unique answer** — the intersection of several weak hints
  is a strong, unique identifier.
- **UTC conversion:** a `+HH:MM` offset means local is *ahead* of UTC, so **subtract** to get UTC;
  mark UTC times with a trailing `Z`.
- **Cheatsheet commands worth saving:**
  ```
  unzip file.zip                                   # open an archive
  jq '.[] | select(.field==VALUE)' data.json        # filter JSON records
  printf '%s' "text" | sha256sum                    # exact SHA-256, no trailing newline
  curl -s URL -H 'Content-Type: application/json' -d '{"answer":"..."}'   # submit JSON
  ```
- **Match formats character-for-character** when a server hashes your input — one stray byte and
  the hash is completely different.

You correlated six files down to one voyage, nailed a fussy time format, and hashed it exactly
right — that patient, methodical mindset is precisely what makes a strong CTF player, so keep going!




