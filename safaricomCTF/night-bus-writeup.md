# Night Bus — Beginner Writeup (IDOR / Insecure Direct Object Reference)

> **Note:** This writeup covers the **Night Bus** web challenge. Every step is doable with
> **curl** and your **browser's DevTools** — no scripting needed. The only "math" step
> (a SHA-256 hash) is done with a single built-in Linux command, explained in full.

---

## 1. Challenge Overview

**Night Bus** is a **web** challenge from the **Safaricom CTF (safctf)**. It exposes a tiny
"bookings" API: one endpoint lists booking references, another returns the *receipt* for a
booking when you give it that booking's internal id. The **goal** is to read a booking the
app never lists for us — the hidden one that holds the flag.

- Category: **Web — IDOR (Insecure Direct Object Reference)**
- Difficulty: **Easy/Medium (200 points)**
- Service: `http://54.72.82.22:8330` (event-local; may be offline after the CTF)
- Flag: `safctf{81a90dc817371a5aa190e8069ebcde2c}`

The solution is kept out of this section on purpose — it begins in Section 3.

---

## 2. What You Need Before Starting

A beginner should budget **20 to 40 minutes**. You need almost nothing installed.

**Tools:**

- **curl** — command-line web request tool. Install on Kali/Debian/Ubuntu:
  ```
  sudo apt install curl
  ```
- **sha256sum** — turns text into a SHA-256 "fingerprint." It is already installed on Kali
  (part of `coreutils`); nothing to do.
- **A browser with DevTools** (Firefox/Chrome). We only use the **Network** tab, which lists
  every request a page makes.
- **(Optional) Burp Suite** — a proxy to catch and replay requests by hand. On Kali:
  ```
  sudo apt install burpsuite
  ```

**Accounts / VPN:** none. Plain HTTP, no login or token.

---

## 3. Reconnaissance

The rule for web CTFs: **read what the API tells you before you start poking it.**

**Step 1 — Open the site and read the "Desk services" note.**

Visit `http://54.72.82.22:8330` in a browser. The page documents two endpoints:

```
GET /api/orders           -> lists booking references
GET /api/orders/OBJECT    -> retrieves a receipt
```

So one endpoint **lists** bookings, the other **fetches** one by an `OBJECT` id.

[SCREENSHOT: the Night Bus homepage showing the "Desk services" text with the two endpoints]

**Step 2 — Ask the API for the list of bookings.**

```
curl -s http://54.72.82.22:8330/api/orders
```

Output:

```json
{"items":[{"object":"289290bbb72721bcad2f8717","reference":"TOUR-2401"}],"next_reference":"TOUR-2402"}
```

Read this carefully. There are **two** names for a booking:

- a human **`reference`** (`TOUR-2401`), and
- a machine **`object`** id (`289290bbb72721bcad2f8717`) — a 24-character hex string.

And there's a dangling hint: **`next_reference`: `TOUR-2402`** — a booking that exists but is
**not** in the `items` list. That missing booking is almost certainly our target.

**Step 3 — Fetch the booking we *are* allowed to see (baseline).**

```
curl -s http://54.72.82.22:8330/api/orders/289290bbb72721bcad2f8717
```

Output:

```json
{"receipt":"Two seats, balcony level."}
```

Good — giving the **object id** returns that booking's receipt.

**Step 4 — Try the hidden reference the obvious way, and watch it fail.**

```
curl -s http://54.72.82.22:8330/api/orders/TOUR-2402
```

Output:

```json
{"receipt":"Two seats, balcony level."}
```

That looks like it "worked," but it's a trap. Let's test the endpoint with pure nonsense:

```
curl -s http://54.72.82.22:8330/api/orders/notanid
curl -s http://54.72.82.22:8330/api/orders/zzzz
```

Output (both):

```json
{"receipt":"Two seats, balcony level."}
```

**Important discovery:** the endpoint returns the **same dummy receipt for *anything***. It
never says "not found." So looking up by `reference`, or by a guess, tells us nothing — only
the **exact object id of a real booking** returns that booking's real content.

[SCREENSHOT: terminal showing that "notanid" and "zzzz" both return the same "Two seats, balcony level." dummy receipt]

---

## 4. Identifying the Vulnerability

The vulnerability is an **IDOR — Insecure Direct Object Reference**.

**Define it:** an IDOR happens when an app lets you fetch an object by its id, but **doesn't
check whether you're allowed to have *that* object**. If you can name it, you can read it.
The booking endpoint here hands over any booking to anyone who knows its `object` id — there
is no ownership or permission check at all.

Normally an IDOR is easy: the ids are **sequential** (1, 2, 3…), so you just count up. Here
the designers tried to be clever and made the id a **random-looking 24-hex string**
(`289290bbb72721bcad2f8717`). The idea: "you can't guess it, so you can't abuse it." This is
**security through obscurity**, and it's exactly where this challenge turns.

**The tip-off:** we have one `reference` (`TOUR-2401`) *and* its matching `object`
(`289290...`). Whenever a CTF hands you a known input **and** its matching "random" output,
your instinct should be: **is the output actually derived from the input?** If the id is a
hash of the reference, it isn't secret at all — we can compute the hidden booking's id
ourselves.

**Analogy:** a cloakroom gives each coat a "random" ticket number. But if the ticket is
really just *your name run through a fixed machine*, then anyone who knows your name can
reproduce your ticket and walk off with your coat.

**Testing the theory.** The id is 24 hex characters. A very common trick is "take a hash of
the name and keep the first chunk." Let's test **SHA-256** (a standard one-way fingerprint
function) of the reference. We use **`printf`**, not `echo`, because `echo` adds an invisible
newline at the end that would change the hash — `printf '%s'` prints the text exactly:

```
printf '%s' "TOUR-2401" | sha256sum
```

Output:

```
289290bbb72721bcad2f871709e6dcd5fb23cbb6afb2b4d74e8c0a176c381286  -
```

Compare the **first 24 characters** to the known object id:

```
289290bbb72721bcad2f8717   <- the object id from /api/orders
289290bbb72721bcad2f8717   <- first 24 chars of sha256("TOUR-2401")
```

They match **exactly**. The "random" id is just `sha256(reference)` truncated to 24 hex
chars. The obscurity is broken — we can now mint the id of **any** booking we can name.

[SCREENSHOT: terminal showing sha256sum output lined up against the object id, first 24 chars matching]

---

## 5. Exploitation Step by Step

**Step 1 — Compute the object id of the hidden booking.**

What/why: recon gave us `next_reference: TOUR-2402`, a booking not in the list. We turn its
reference into its object id with the same formula we just proved.

```
printf '%s' "TOUR-2402" | sha256sum
```

Expected output:

```
d9522cdd54fa82760ecb6f83c27f1b8cb7535c88dd6b763d9c79dc056dbf540c  -
```

Take the **first 24 characters**: `d9522cdd54fa82760ecb6f83`. That is the hidden booking's id.

[SCREENSHOT: terminal showing sha256sum of "TOUR-2402" with the first 24 chars highlighted]

**Step 2 — Fetch the hidden booking with its computed id.**

What/why: hand the endpoint the real id of the booking the app refused to list.

```
curl -s http://54.72.82.22:8330/api/orders/d9522cdd54fa82760ecb6f83
```

Expected output:

```json
{"receipt":"safctf{81a90dc817371a5aa190e8069ebcde2c}"}
```

Unlike every other request (which gave the dummy "Two seats, balcony level."), **this one
returns a different `receipt`** — the flag. A changed response is exactly what we were
hunting for.

[SCREENSHOT: terminal showing the flag returned in the receipt field]

### The same thing in Burp Suite (optional)

1. In Burp, go to **Proxy → Intercept**, make sure your browser traffic routes through Burp.
2. Browse to the site so a request to `/api/orders/...` appears.
3. Right-click that request → **Send to Repeater**.
4. In **Repeater**, change the path to `/api/orders/d9522cdd54fa82760ecb6f83`.
5. Click **Send** and read the response on the right — the flag is in the JSON `receipt`.

[SCREENSHOT: Burp Repeater showing the modified path and the flag in the response panel]

### The same thing in the browser (optional)

Open DevTools (**F12**) → **Network** tab, then simply visit the URL in the address bar:
`http://54.72.82.22:8330/api/orders/d9522cdd54fa82760ecb6f83`. The JSON response shows the flag.

---

## 6. Capturing the Flag

The flag appeared directly in the JSON response of the hidden booking:

```
curl -s http://54.72.82.22:8330/api/orders/d9522cdd54fa82760ecb6f83
```
```json
{"receipt":"safctf{81a90dc817371a5aa190e8069ebcde2c}"}
```

**Flag:** `safctf{81a90dc817371a5aa190e8069ebcde2c}`

To recap the exact retrieval path: list → spot `next_reference: TOUR-2402` → compute
`sha256("TOUR-2402")` → take the first 24 hex chars → request `/api/orders/<that id>` → read
the `receipt` field.

---

## 7. Why This Works (Beginner Explanation)

The app assumed that because the object ids *look* random, nobody could reach a booking they
weren't shown. But the id wasn't random — it was a **predictable fingerprint of the booking
name**. A fingerprint (hash) is one-way in theory, but here the input (`TOUR-2402`) was
trivial to guess, so re-deriving the id was easy. Hiding something behind an id you can
recompute isn't access control at all.

Back to the cloakroom analogy: the ticket number was just your name through a machine anyone
could borrow. The real fix isn't a fancier machine — it's the clerk **checking that the coat
is yours** before handing it over. The server never checked whether we were allowed to see
`TOUR-2402`; it only hoped we'd never find the id.

In the real world this is one of the most common and damaging web bugs. Changing an id in a
URL to read another customer's invoice, medical record, or private message is textbook IDOR —
it has caused serious breaches at major companies. The lesson is identical to this CTF:
**never rely on an id being hard to guess; always check permission on the server.**

---

## 8. Common Mistakes and Dead Ends

- **Trusting `/api/orders/TOUR-2402`.** Requesting the *reference* (or literally any string)
  returns the same dummy `"Two seats, balcony level."`. A beginner can mistake this for
  "access granted." The fix in mindset: **probe the endpoint with junk** (`notanid`) to learn
  it answers everything the same — so only a *correct object id* yields real data.
- **Trying to brute-force the 24-hex id.** That's a 96-bit space; guessing is hopeless. The
  intended path is to realize the id is *derived*, not random.
- **Using `echo` instead of `printf` for the hash.** `echo "TOUR-2401" | sha256sum` adds a
  hidden newline and produces the **wrong** hash, so it won't match the known id and you'll
  wrongly conclude "it's not SHA-256." Always use `printf '%s'` when hashing exact text.
- **Hashing the wrong field.** Hash the **reference** (`TOUR-2401`), not the object id. The
  reference is the input; the object id is the output.

---

## 9. How to Defend Against This

- **Check ownership/permission on the server for every object fetch**, not just whether the
  caller knows the id. "Can *this* user read *this* booking?" must be answered before returning data.
- **Don't treat a hard-to-guess id as a secret.** Obscurity is not authorization; a hashed or
  random id still needs an access check behind it.
- **Never derive a "private" id from guessable public data** (like a sequential reference).
  If you must map one to the other, use a server-side secret (e.g., an HMAC with a key the
  attacker never sees), so the id can't be recomputed.
- **Return a clear, consistent "not found / not allowed"** for objects the user can't access —
  but back it with a real check, not a dummy value that leaks "this endpoint exists."
- **Log and rate-limit object-fetch endpoints** so enumeration attempts are visible and slowed.

---

## 10. Key Takeaways

- **IDOR** = fetching objects by id with no permission check. If you can name it, you can read
  it — so always test by changing/guessing ids.
- When a challenge gives you a **known input and its "random" output together**, test whether
  the output is just a **hash or encoding of the input**. Cheatsheet command:
  ```
  printf '%s' "KNOWN_INPUT" | sha256sum
  ```
  Then compare the first N characters to the id you were given.
- **Probe endpoints with garbage** to learn how they behave; a server that answers everything
  identically is hiding its real data behind one specific value.
- **`printf '%s'` not `echo`** when hashing exact strings — the stray newline will burn you.
- Keep `curl -s <url>` in your muscle memory; most web CTF recon is just reading JSON.

You just broke "security through obscurity" with one built-in command — that instinct to ask
*"is this value actually derived from something I already know?"* will carry you through a lot
of web challenges. Keep going; you're building real intuition.

---

## Advanced Alternative (optional)

If you prefer a one-liner that computes the id and fetches the flag in a single step, this
Python is **not required** — it only chains the two commands above:

```python
import hashlib, urllib.request
oid = hashlib.sha256(b"TOUR-2402").hexdigest()[:24]
print(urllib.request.urlopen(f"http://54.72.82.22:8330/api/orders/{oid}").read().decode())
```

It does exactly what we did by hand: hash `TOUR-2402`, keep 24 hex chars, request that id.



