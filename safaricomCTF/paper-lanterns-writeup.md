# Paper Lanterns — Beginner Writeup (Spot the One Odd Record)

> **Assumption note:** The template below has a section called *"Identifying the
> Vulnerability."* **Paper Lanterns is not a hacking/vulnerability challenge** — it is a
> *data-matching puzzle* (sometimes called an OSINT or "needle in a haystack" challenge).
> So in that section we explain the **insight** instead of a software bug. Everything else
> follows the template exactly. We write in the first person plural ("we") throughout.

---

## 1. Challenge Overview

**Paper Lanterns** is an **easy misc / data-matching** challenge from the **Safaricom CTF
(safctf)**, worth **200 points** (the gentlest challenge in the set). The website gives us a
small ZIP of "field notes," and the **goal** is to read a short clue, find the **one** matching
record in a long list, and submit that record's reference code to get the flag.

- Service: `http://54.72.82.22:8480`
- Category: **Misc (data reconciliation)**
- Difficulty: **Easy (200 pts)**
- The challenge flavor text: *"each one carrying a small message into the darkness. From a
  distance, they all look the same."* — a strong hint that we are looking at many near-identical
  entries and must find the single one that fits.

We do **not** explain the solution here; that starts in Section 3.

---

## 2. What You Need Before Starting

You need a terminal (Kali Linux is perfect) and about **10 to 20 minutes**. Everything is a
plain command you type by hand — **no Python, no scripting**.

- **curl** — downloads files and talks to the web service.
  ```
  sudo apt install curl
  ```
- **unzip** — opens the `.zip` the site gives us.
  ```
  sudo apt install unzip
  ```
- **cat / grep** — read and search text files. (Already on every Linux system.)
- **jq** *(optional but handy)* — a "search tool for JSON" files.
  ```
  sudo apt install jq
  ```
- A **web browser** is enough to look at the site, but we will use curl so every step is copy-pasteable.

## 3. Reconnaissance

**Step 1 — Look at the home page.** Open the site in a browser, or fetch it with curl:

```
curl -s http://54.72.82.22:8480/
```

In the page we see two important things: a **download link** and a small **form** that asks for
a *"Collection receipt."* The page text says: *"Find the collection reference for the venue
pictured in the field notes."* So the plan is already clear: **download the notes → find a
reference → submit it.**

[SCREENSHOT: the Paper Lanterns home page showing the "field-notes.zip" download link and the "Collection receipt" input box]

**Step 2 — Peek at the page's JavaScript to learn where answers go.** Still in that same page
source, there is a tiny script. The key line tells us the form sends our answer as **JSON** to
**`/submit`**:

```
body: JSON.stringify({ answer: document.getElementById('answer').value })
... fetch('/submit', { method:'POST', ... })
```

Plain English: whatever we type gets POSTed to **`/submit`** as `{"answer":"..."}`. Good — we can
do that with curl later instead of clicking.

**Step 3 — Download and unpack the field notes.**

```
curl -s http://54.72.82.22:8480/downloads/field-notes.zip -o field-notes.zip
unzip field-notes.zip
```

Expected output:

```
Archive:  field-notes.zip
  inflating: civic-directory.json
  inflating: postcard.txt
  inflating: districts.csv
```

Three files. **This is the whole challenge** — there is no server-side trickery, just these notes.

**Step 4 — Read the small files first (always start with the smallest).**

```
cat postcard.txt
```
```
Lunch beneath a glass roof, somewhere east of the river. The brass plaque said 1997.
```

```
cat districts.csv
```
```
district,river_side
North,north
East,east
South,south
West,west
```

The **postcard is our clue**. The **districts.csv** is a tiny lookup table that tells us "east of
the river" = the **East** district.

[SCREENSHOT: terminal showing the contents of postcard.txt and districts.csv]

**Step 5 — Look at the big file.**

```
cat civic-directory.json
```

A representative entry (there are **36** of them, numbered House 1 … House 36):

```json
  {
    "ref": "ba57ce94e3",
    "name": "House 18",
    "district": "East",
    "opened": 1997,
    "roof": "glass",
    "seats": 307
  },
```

Every record has the same shape: a **ref** (the code we eventually submit), a **district**, the
year it **opened**, a **roof** type, and **seats**. This is exactly what the hint warned us about:
*"from a distance, they all look the same."* Our job is to pick the **one** that matches the postcard.

---

## 4. Identifying the "Vulnerability" (really: the Insight)

There is no software bug here. The **insight** is simply:

> **Translate the fuzzy, human-sounding clue into exact machine filters, and require ALL of them
> at once.**

The postcard hides three precise facts:

| Postcard words | Field in the data | Required value |
|---|---|---|
| "beneath a **glass** roof" | `roof` | `glass` |
| "**east of the river**" (via districts.csv) | `district` | `East` |
| "the brass plaque said **1997**" | `opened` | `1997` |

**Why this is the whole challenge:** any *single* clue matches several houses (there are multiple
glass-roof houses, multiple East houses, multiple 1997 houses). Only when we **AND** all three
clues together does exactly **one** record survive. Beginners often lock onto one clue and submit
a wrong ref — the skill being tested is *using every detail*.

Analogy: imagine a lost-and-found desk with 36 near-identical black umbrellas. "It's black" doesn't
help. But "black, **with a wooden handle**, **and** a red tag that says 1997" points to exactly one.

## 5. Exploitation Step by Step

**Step 1 — Translate the clue (done above).** We need: `roof = glass` **AND** `district = East`
**AND** `opened = 1997`.

**Step 2 — Find the matching record. Pick ONE of the three ways below.**

**Way A — Just read it (no tools).** Open `civic-directory.json` in a text editor and scroll,
or eyeball it after `cat`. Look for the block where all three values line up. Slow but foolproof.

**Way B — grep for a strong anchor, then check by eye.** The year is the most unique word, so:

```
grep -n -B3 -A3 '"opened": 1997' civic-directory.json
```

`-n` shows line numbers; `-B3 -A3` prints 3 lines **before/after** each hit so we can read the
whole record. Then confirm that hit also says `"district": "East"` and `"roof": "glass"`.

**Way C — let jq do the matching (cleanest).** `jq` is a search tool for JSON. This one line asks
"give me the ref of every record that matches all three filters":

```
jq -r '.[] | select(.roof=="glass" and .district=="East" and .opened==1997) | .ref' civic-directory.json
```

Reading it in plain English, clause by clause:
- `.[]` — go through **every** record in the list.
- `select(.roof=="glass" and .district=="East" and .opened==1997)` — **keep only** records where all three facts are true.
- `.ref` — print just that record's **ref** code.
- `-r` — print it **raw** (no quotes).

Expected output — exactly one line:

```
ba57ce94e3
```

[SCREENSHOT: terminal showing the jq command returning the single ref ba57ce94e3]

**Step 3 — Sanity-check it is unique.** Loosen the filter to confirm the year is what makes it
one-of-a-kind (good habit — proves we are not guessing):

```
jq -r '.[] | select(.roof=="glass" and .district=="East") | "\(.ref) opened \(.opened)"' civic-directory.json
```
```
0ca45f3316 opened 1985
ba57ce94e3 opened 1997
74400f619e opened 2009
```

Three glass-roofed East houses — only **1997** matches the postcard. This is why **all three
clues matter**.

**Step 4 — Submit the ref to `/submit`.** Remember from recon that the form sends
`{"answer":"..."}` as JSON. We do the same with curl:

```
curl -s -X POST http://54.72.82.22:8480/submit \
     -H 'Content-Type: application/json' \
     -d '{"answer":"ba57ce94e3"}'
```

[SCREENSHOT: terminal showing the curl POST to /submit and the JSON response containing the flag]

## 6. Capturing the Flag

The server replies to our POST with JSON, and the flag is sitting right in the `message` field:

```json
{"message":"safctf{38309964a77c499b1ec234c401f68fe1}","ok":true}
```

**Flag:**

```
safctf{38309964a77c499b1ec234c401f68fe1}
```

That is it — the ref code was the "collection receipt," and submitting the correct one makes the
desk hand back the flag.

---

## 7. Why This Works (Beginner Explanation)

CTF challenges love to hide a single fact inside a pile of look-alikes. The **postcard** is written
like a human memory ("glass roof, east of the river, plaque said 1997"), but a computer file stores
those same facts as tidy fields (`roof`, `district`, `opened`). The whole skill is **translation**:
turning soft human words into hard filters, then applying them together.

The reason one clue is never enough is **selectivity**. Each filter removes some records but leaves
many. Stack enough independent filters and the survivors shrink to one. This is the same math behind
database lookups, search engines, and even how investigators narrow down a suspect from a crowd — any
single trait is common, but a specific *combination* is rare.

In the real world this is exactly how analysts pivot through logs or asset inventories: "show me the
host that is **in this subnet** **and** running **this service** **and** last seen **on this date**."
Learning to think in combined filters now will pay off in every future investigation.

---

## 8. Common Mistakes and Dead Ends

- **Matching only one clue.** Submitting the first "glass roof" house (there are several) gives a
  wrong ref. Always AND **every** fact in the clue together — here that is roof **and** district
  **and** year.
- **Ignoring districts.csv.** "East of the river" sounds vague until you read the tiny lookup table
  that maps it to the **East** district. Small files are often the key, not noise.
- **Over-thinking it.** People go hunting for hidden data, EXIF, or steganography in the files.
  There is none — the challenge is pure reading and matching. Don't burn time on tools you don't need.
- **Submitting the name instead of the ref.** The desk wants the **`ref`** code (`ba57ce94e3`), not
  "House 18."

---

## 9. How to Defend Against This

This is a puzzle, not a flaw, but the data-handling lessons still map to real systems:

- **Don't expose full internal directories/exports** to users who only need one record — hand back
  just the fields they asked for.
- **Treat identifiers (refs) as opaque**: don't let a leaked bulk list reveal relationships between
  records (district, year, capacity) that aid enumeration.
- **Log and rate-limit lookup endpoints** like `/submit` so brute-forcing references is noisy and slow.
- **Separate reference data from secrets**: a "receipt code" should never be the only thing standing
  between a user and sensitive output.

---

## 10. Key Takeaways

- **Read the smallest files first** (`postcard.txt`, `districts.csv`) — they usually hold the clue
  and the decoder.
- **Translate fuzzy clues into exact fields**, then require **all** of them at once.
- **Save this `jq` pattern** to your cheatsheet — it answers "find the record matching several
  conditions":
  ```
  jq -r '.[] | select(.FIELD1=="X" and .FIELD2=="Y" and .FIELD3==Z) | .ref' file.json
  ```
- **Confirm uniqueness** by loosening one filter — proof beats guessing.
- The form's own JavaScript told us the answer goes to `POST /submit` as `{"answer":"..."}`; **reading
  the page source is free recon.**

You just solved a real CTF challenge with nothing but `curl`, `unzip`, and careful reading — that same
patience is exactly what cracks much harder challenges later. Keep going. 🏮




