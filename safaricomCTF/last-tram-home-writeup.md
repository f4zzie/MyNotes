# Last Tram Home — Beginner Writeup (Data Reconciliation / Forging a Receipt)

> **Assumptions I'm stating up front** (because the original challenge card left a couple of
> blanks): the live service in this writeup is shown as `http://54.72.82.22:8490`. If you are
> replaying this later the host/port will differ, so I write it as `http://<HOST>:8490` in the
> commands — just paste in whatever address the scoreboard gives you. Screenshots are marked
> with `[SCREENSHOT: ...]` so you know where a picture helps.
>
> **Honesty note:** this is *not* a hacking-a-server challenge. There is no injection, no
> login bypass. It is a **puzzle**: the server wants a specific receipt code, the files tell
> you how to build it, and you have to read carefully and not fat-finger the final string.
> The tricky part is entirely in the details (time zones, date format, no trailing newline).

---

## 1. Challenge Overview

**Last Tram Home** is a **misc / data-reconciliation** challenge from the **Safaricom CTF
(safctf)**, worth **300 points**. The website gives you a zip of "field notes" and a little
submission desk. **The goal** is to read the notes, figure out a single secret **receipt code**,
and paste it into the desk to get the flag.

- Category: **Misc (puzzle / reconnaissance of provided data)**
- Difficulty: **Medium-ish (300 points) — easy once you spot the time-zone trick**
- Service: `http://<HOST>:8490`
- Flag: `safctf{a7290ed4a3ba7af7bd4b4c529eb99314}`

The whole game is: the receipt is a **SHA-256 hash** of three values glued together, and those
three values are scattered across the files. Get all three exactly right, hash them, submit.

---

## 2. What You Need Before Starting

You need a terminal (Kali is perfect) and about **20 to 40 minutes** as a beginner. Everything
here is standard and usually pre-installed.

- **curl** — download files and talk to the web service.
  ```
  sudo apt install curl
  ```
- **unzip** — open the provided `.zip`.
  ```
  sudo apt install unzip
  ```
- **cat / grep** — read the small text/CSV/JSON files. (Part of the base system.)
- **sha256sum** — compute the SHA-256 hash (this *is* the exploit). Comes with coreutils.
  - Optional alternative: **openssl** (`sudo apt install openssl`).
- **jq** *(optional, nice-to-have)* — pretty-print / filter JSON.
  ```
  sudo apt install jq
  ```

No Python, no Burp needed. A browser is handy just to look at the home page once.

---

## 3. Reconnaissance

**Step 1 — Look at the front page.** Open the site in a browser (or `curl` it) to see what the
"desk" offers.

```
curl -s http://<HOST>:8490/ | sed 's/</\n</g' | grep -iE 'download|href|/submit|<p>'
```

You'll see it points at a download and a submit form. In plain English: **there is a file to
grab, and a box to paste an answer into.**

[SCREENSHOT: the Last Tram Home home page showing the "field-notes.zip" link and the receipt box]

**Step 2 — Download and unpack the field notes.** This is the evidence bag.

```
curl -s http://<HOST>:8490/downloads/field-notes.zip -o field-notes.zip
unzip field-notes.zip
```

Expected output:

```
Archive:  field-notes.zip
  inflating: civic-directory.json
  inflating: programme.json
  inflating: tram.csv
  inflating: studio-post.txt
  inflating: submission.txt
```

Five files. **Whenever a challenge hands you several files, read the smallest ones first** —
they usually tell you the rules.

**Step 3 — Read the rulebook (`submission.txt`).**

```
cat submission.txt
```

```
Collection receipt format: SHA256(venue_ref|event_ref|UTC_date), lowercase hex.
```

This is gold. It tells us **exactly** what to build: three pieces — `venue_ref`, `event_ref`,
`UTC_date` — joined with the pipe character `|`, then run through **SHA-256**, lowercase hex.
A "hash" here just means a fixed-length fingerprint of some text; same input always gives the
same fingerprint.

**Step 4 — Read the clue (`studio-post.txt`).**

```
cat studio-post.txt
```

```
The last frame was taken at stop 18, three hours after UTC. The wall clock read 21:30 on 18 April 2026.
```

In plain English this gives us: **stop 18**, a **time zone** hint ("three hours after UTC" =
**UTC+3**), and a **local time** of 21:30 on 18 April 2026. We'll convert that to UTC in a moment.

[SCREENSHOT: terminal showing the contents of submission.txt and studio-post.txt side by side]

**Step 5 — Glance at the data files.** `tram.csv` is a stop→venue list, `programme.json` is a
list of events, `civic-directory.json` is extra venue detail (a distractor here).

```
head tram.csv
```

```
stop,venue
1,97b41b7510
2,dafc82a0b8
...
```

So each tram **stop** has a **venue** code. Good — that's our `venue_ref` source.

---

## 4. Identifying the Vulnerability

The "vulnerability" here is a **predictable / forgeable receipt**: the server accepts anything
whose SHA-256 matches `venue_ref|event_ref|UTC_date`, and it **hands you the exact formula plus
all the ingredients**. Nothing secret protects the receipt — if you know the recipe and the
inputs, you can regenerate the token yourself. In real systems this is the classic mistake of
building a security token out of **guessable, client-known values** instead of a server-side
secret.

What tipped us off: `submission.txt` literally prints the formula, and every ingredient
(`venue_ref`, `event_ref`, `UTC_date`) is sitting in the downloaded files. There is no signing
key or random secret in the mix — so **we can forge the receipt offline**.

**Analogy:** imagine a cloakroom that gives you a ticket number equal to
`your-coat-color + your-seat + today's-date`. If you know those three facts, you can write your
own ticket and claim any coat. That's exactly what's happening — the "ticket" is just a hash of
public facts.

The one genuinely tricky bit (and the whole reason this is 300 and not 50 points) is the
**time-zone conversion** and the **exact date format**. Those are the "little details."

---

## 5. Exploitation Step by Step

We need three values. Let's nail each one, one at a time.

**Step 1 — Get `venue_ref` from the stop number.** The clue said **stop 18**. Look it up in
`tram.csv`:

```
grep '^18,' tram.csv
```

Expected output:

```
18,b59c881fc2
```

So **`venue_ref = b59c881fc2`**. (Why `^18,`? The `^` anchors to the start of the line so we
match the stop *number* 18, not a venue code that happens to contain "18".)

[SCREENSHOT: grep result showing stop 18 maps to b59c881fc2]

**Step 2 — Convert the local time to UTC.** The clue said the wall clock read **21:30** and the
zone is **three hours after UTC (UTC+3)**. "Three hours *after* UTC" means the local clock is
*ahead* of UTC, so to get UTC we **subtract 3 hours**:

```
21:30 (local, UTC+3)  ->  18:30 UTC,  on 2026-04-18
```

So the moment in UTC is **2026-04-18T18:30:00Z**. Hold onto both the full timestamp and the
**date part** `2026-04-18` — we'll need the date for the recipe, but the full timestamp to find
the event.

**Step 3 — Get `event_ref` from `programme.json`.** The programme is a list of entries like
`{"event": "...", "venue": "...", "time_utc": "...", "artist": "..."}`. We want the entry whose
**venue** is our `b59c881fc2` **and** whose **time_utc** is `2026-04-18T18:30:00Z`. The quickest
way is to grep around our venue code:

```
grep -o '{[^}]*b59c881fc2[^}]*}' programme.json
```

Expected output:

```
{"event": "2011bf1eeb4b", "venue": "b59c881fc2", "time_utc": "2026-04-18T18:30:00Z", "artist": "act-8"}
```

That matches our UTC time exactly, so **`event_ref = 2011bf1eeb4b`**. (If you have `jq`, the
tidy version is: `jq -r '.[] | select(.venue=="b59c881fc2") | .event + " " + .time_utc' programme.json`.)

[SCREENSHOT: the single programme.json entry for venue b59c881fc2 at 18:30 UTC]

**Step 4 — Set `UTC_date`.** The recipe says `UTC_date`, i.e. the **date only**, not the whole
timestamp: **`2026-04-18`**. (This matters a lot — see Common Mistakes.)

**Step 5 — Build the string and hash it.** Glue the three pieces with `|` and run SHA-256.
Use **`echo -n`** so no invisible newline sneaks into the hash:

```
echo -n "b59c881fc2|2011bf1eeb4b|2026-04-18" | sha256sum
```

Expected output:

```
57aa623e8a9afd3082a959b18371e03ea717d6ad03f7e68948162fc507ee914d  -
```

That long hex string is our **collection receipt**. (openssl alternative, same result:
`printf '%s' "b59c881fc2|2011bf1eeb4b|2026-04-18" | openssl dgst -sha256`.)

[SCREENSHOT: terminal showing the sha256sum command and the resulting 64-character hash]

---

## 6. Capturing the Flag

Send the receipt to the submission desk. The desk expects a JSON body `{"answer": "..."}` on
`POST /submit`:

```
curl -s -X POST http://<HOST>:8490/submit \
  -H 'Content-Type: application/json' \
  -d '{"answer":"57aa623e8a9afd3082a959b18371e03ea717d6ad03f7e68948162fc507ee914d"}'
```

Expected response:

```
{"message":"safctf{a7290ed4a3ba7af7bd4b4c529eb99314}","ok":true}
```

The flag appears in the `message` field when `ok` is `true`:

```
safctf{a7290ed4a3ba7af7bd4b4c529eb99314}
```

[SCREENSHOT: curl response showing ok:true and the safctf{...} flag]

If instead you see `{"message":"The request could not be completed.","ok":false}`, your receipt
is wrong — recheck the time zone, the date format, and that you used `echo -n`.

---

## 7. Why This Works (Beginner Explanation)

A hash like SHA-256 is a **one-way fingerprint**: feed it some text and it spits out a
fixed 64-character hex value, and the *same text always produces the same value*. The server
pre-computed the fingerprint of `venue_ref|event_ref|UTC_date` for the "right" visit and simply
checks whether what you submit matches. Because **we were handed the formula and every input**,
we can produce the identical fingerprint on our own machine — no secret required.

The reason it still takes effort is that a hash is **brutally unforgiving**: change one
character — an extra newline, `T18:30:00Z` instead of just the date, `21:30` instead of the
UTC-adjusted `18:30` — and the fingerprint is completely different. So the "attack" is really an
exercise in reading precisely and converting a time zone correctly.

In the real world this is why security tokens must mix in a **server-side secret** (an HMAC key,
for example). If a receipt/token is just a hash of values the client already knows, anyone can
mint their own — which is exactly the weakness we abused here.

---

## 8. Common Mistakes and Dead Ends

- **Using the local time as if it were UTC.** The biggest trap. "Three hours after UTC" means
  the clock is UTC+3, so **21:30 local = 18:30 UTC**. If you hash with 21:30 you'll pick the
  wrong event and the wrong date logic. (We double-checked by matching `time_utc` in
  `programme.json`.)
- **Hashing the full timestamp instead of the date.** We tried
  `...|2026-04-18T18:30:00Z` and it was rejected; the recipe says **`UTC_date`**, so it's just
  `2026-04-18`. When a format string names a field, take it literally.
- **A sneaky trailing newline.** Plain `echo "..."` adds a newline, which changes the hash.
  Always use **`echo -n`** (or `printf '%s'`). This bites beginners constantly.
- **Getting the separators wrong.** It's a literal pipe `|` between the three parts — not a
  space, comma, or slash. Copy the format from `submission.txt` exactly.
- **Chasing the distractor file.** `civic-directory.json` is interesting-looking venue data but
  isn't needed for the receipt. Not every provided file is part of the answer.

---

## 9. How to Defend Against This

- **Never build a security token from client-known values alone.** Mix in a server-side secret,
  e.g. `HMAC-SHA256(secret, venue|event|date)` so attackers can't recompute it.
- **Don't publish the token recipe** (and don't ship the raw ingredients) to the client.
- **Make tokens single-use and time-bound** server-side, so even a leaked/guessed receipt can't
  be replayed.
- **Validate server-side that the request is actually authorized**, rather than trusting a hash
  the client supplies as proof.
- **Rate-limit the submission endpoint** so brute-force or mass-guessing of receipts is
  impractical.

---

## 10. Key Takeaways

- When a challenge drops several files, **read the smallest/rulebook files first** — they tell
  you the format of the answer.
- **Time-zone math and exact date formats matter.** "N hours after UTC" = UTC+N, so subtract to
  get UTC. Keep both the full timestamp (to look things up) and the date (for the recipe).
- **`echo -n` before piping into a hash** — a stray newline silently breaks everything. Worth a
  permanent spot on your cheatsheet:
  ```
  echo -n "a|b|c" | sha256sum          # exact bytes, no newline
  printf '%s' "a|b|c" | openssl dgst -sha256
  grep '^18,' tram.csv                 # anchor matches to the line start
  ```
- **Hashes of public values aren't secrets** — this is both how we solved it and why it's a real
  vulnerability.

You just reconstructed a cryptographic receipt from scattered clues and submitted it by hand —
that's exactly the careful, detail-first mindset that cracks much harder challenges later. Keep
going; you've got this. 🚋
