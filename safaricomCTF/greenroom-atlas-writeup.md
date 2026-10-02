# Greenroom Atlas — CTF Writeup

> **Assumptions made for this writeup:** The CHALLENGE CONTEXT block was not filled in with concrete values, so where details were missing I made a reasonable assumption and state it here explicitly:
> - **Challenge Name:** Greenroom Atlas (themed "Botanical Studio")
> - **Platform / Event:** Safaricom CTF (flags are `safctf{...}`) — assumed from the flag format
> - **Category:** Web / Cloud (Kubernetes-style RBAC)
> - **Difficulty:** 550 points (looks hard, solves in ~3 requests once you spot the bug)
> - **Flag:** `safctf{6035ffad158ce604cb84927b77926d47}`
> - **What the solution actually involved:** The API trusts a "Bearer token" that is really just the *name* of an account, with no signature. You log in, see your token is literally your username, then swap it for the name of a more privileged account (`archive-agent`) and read the secrets endpoint.
> - **Tools actually used:** `curl`, a web browser (optional, for reading the page)
> - **Dead ends:** The "intended" multi-step pod/rolebinding chain (documented in Section 8). A sibling challenge, **Crown Studio** (AD Certificate Services / ESC1), was also solved this session and can be written up on request.

---

## 1. Challenge Overview

Greenroom Atlas is a **web / cloud** challenge that imitates a tiny **Kubernetes-style access-control (RBAC) API**. You're given a web page ("Deep Blue… no — Botanical Studio") with a small REST API and a downloadable `cluster.json` describing accounts, roles, and permissions. The goal is to read a protected `/api/secrets` endpoint that normal users are not allowed to touch, and recover the flag hidden there.

Challenge service (ephemeral, may be offline by the time you read this): `http://54.72.82.22:8410`.

## 2. What You Need Before Starting

- **curl** — the only tool you strictly need. Install on Debian/Kali/Ubuntu:
  ```bash
  sudo apt install curl
  ```
- **A web browser** — just to read the landing page and its "Desk services" note. Any browser works; DevTools is optional here.
- **jq (optional, nice-to-have)** — pretty-prints JSON so it's readable. Not required; you can `cat` the file instead.
  ```bash
  sudo apt install jq
  ```
- **Accounts / VPN:** none. It's a plain HTTP service you reach directly.
- **Realistic time for a beginner:** **20 to 40 minutes**, most of which is reading `cluster.json` carefully and realising what the token actually is.

## 3. Reconnaissance

**Step 1 — Open the landing page and read everything.**

```bash
curl -s http://54.72.82.22:8410/
```

The page is a "Botanical Studio" that offers a download (`cluster.json`) and a **"Desk services"** note describing the API. In plain English, the Desk services note tells you these endpoints exist:

- `POST /api/login`
- `PATCH /api/bindings` — accepts `roleRef`
- `POST /api/workloads` — accepts a spec with `serviceAccountName` and `automountServiceAccountToken`
- `GET /api/workloads/NAME/logs`
- `GET /api/secrets`
- And a key sentence: **"Use `Authorization: Bearer TOKEN`."**

That last line is the whole challenge in disguise: **authentication is done with a Bearer token.** Our job is to figure out what a valid token looks like and whose token can read the secrets.

[SCREENSHOT: the landing page showing the "Desk services" list of API endpoints]

**Step 2 — Download the access list and read it.**

```bash
curl -s http://54.72.82.22:8410/downloads/cluster.json -o cluster.json
cat cluster.json | jq .     # or just: cat cluster.json
```

Representative output (reformatted for readability):

```json
{
  "namespace": "backstage",
  "bindings": {
    "tour-bot": ["get:workloads", "patch:rolebindings"]
  },
  "roles": {
    "editor": ["create:workloads", "get:workloads/logs"]
  },
  "serviceAccounts": {
    "default": ["read:public"],
    "archive-agent": ["get:secrets"]
  }
}
```

What this tells us, line by line:

- **`bindings.tour-bot`** — there is an identity called `tour-bot`, and it is allowed to `get:workloads` and `patch:rolebindings`. This is almost certainly **who we are** by default.
- **`roles.editor`** — a role named `editor` that can `create:workloads` and read workload logs.
- **`serviceAccounts.archive-agent`** — a service account that can **`get:secrets`**. That is the permission we want, because the goal is `/api/secrets`.
- **`serviceAccounts.default`** — can only `read:public` (useless to us).

So the valuable identity is **`archive-agent`**: it is the only thing in the whole file with `get:secrets`.

[SCREENSHOT: the pretty-printed cluster.json with archive-agent's get:secrets highlighted]

**Step 3 — Log in and look very carefully at the token you get back.**

```bash
curl -s -X POST http://54.72.82.22:8410/api/login
```

Output:

```json
{"namespace":"backstage","token":"tour-bot"}
```

Stop and read that again. The **token is literally the string `tour-bot`** — our account *name*. It is not a long random blob, not a signed JWT, not an opaque session ID. The server just handed us our own username and calls it a "token." That is the tip-off for the whole challenge.

## 4. Identifying the Vulnerability

**Vulnerability name: Broken Authentication → Privilege Escalation via a forgeable identity token.** (In cloud terms you can also call it *service-account impersonation*, because the "token" is just an account name you can type yourself.)

**Plain-English definition:** *Authentication* is proving **who you are**; *authorization* is deciding **what you're allowed to do**. A secure system gives you a token that is impossible to fake — usually a long random value stored server-side, or a cryptographically **signed** token (so the server can detect tampering). This server does neither: the token **is** the account name, in plain text, with nothing stopping you from writing a different name.

**Root cause:** the server decides your permissions by reading the name inside `Authorization: Bearer <name>` and looking that name up in its access list. It never verifies that you were actually *issued* that identity. So whoever "speaks" a name is treated as that account.

**What tipped me off during recon:**
1. The Desk services note said auth is a `Bearer TOKEN` — so permissions hang entirely on that header.
2. `cluster.json` named a clearly privileged account, **`archive-agent`**, holding the one permission I needed (`get:secrets`).
3. `POST /api/login` returned `"token":"tour-bot"` — the token was my own name. If my token is just my name, then **another account's token is just that account's name.**

**Analogy:** imagine a members-only room where the bouncer lets you in if you say a member's name out loud — he never checks ID or a wristband. You don't need to *be* the VIP; you just need to **know the VIP's name** and say it. `cluster.json` conveniently printed the VIP's name for us: `archive-agent`.

The hint for this challenge — *"a cached access list names a former role; it may not reflect the current service"* — is pointing straight at `cluster.json`: it hands you the privileged name to impersonate.

## 5. Exploitation Step by Step

**Step 1 — Confirm who you are and what your own token can (and cannot) do.**

What I'm doing: logging in to get my baseline token, then trying the target endpoint *as myself* so I can see the "denied" response and recognise success later.

```bash
curl -s -X POST http://54.72.82.22:8410/api/login
```
Expected output:
```json
{"namespace":"backstage","token":"tour-bot"}
```

Now try the secrets endpoint **as tour-bot** (the `-H` flag adds a header):

```bash
curl -s http://54.72.82.22:8410/api/secrets -H "Authorization: Bearer tour-bot"
```
Expected output (a refusal — `tour-bot` has no `get:secrets`):
```json
{"message":"The request could not be completed.","ok":false}
```

What to look for: `"ok":false`. That's the server telling us this identity is **not authorised**. Good — now we know the shape of a failure.

[SCREENSHOT: terminal showing the tour-bot request returning "ok":false]

**Step 2 — Impersonate the privileged account by changing one word.**

What I'm doing: the token is just a name, so I replace `tour-bot` with `archive-agent` (the account that holds `get:secrets` per `cluster.json`). Nothing else changes.

```bash
curl -s http://54.72.82.22:8410/api/secrets -H "Authorization: Bearer archive-agent"
```
Expected output:
```json
{"message":"safctf{6035ffad158ce604cb84927b77926d47}","ok":true}
```

What to look for: `"ok":true` and a `safctf{...}` string in `message`. That's the flag. The *only* difference between failure and success was the name inside the Bearer header.

[SCREENSHOT: terminal showing the archive-agent request returning the flag with "ok":true]

### Doing the same thing in Burp Suite (optional, for header-swap practice)

If you'd rather see it visually (great Burp practice):
1. In Burp, go to **Proxy → open browser**, visit `http://54.72.82.22:8410/`.
2. Send any request to the site, find it in **Proxy → HTTP history**, right-click → **Send to Repeater**.
3. In **Repeater**, change the first line to `GET /api/secrets HTTP/1.1`.
4. Add a header line: `Authorization: Bearer archive-agent`.
5. Click **Send** and read the response on the right — the flag appears in the JSON body.

[SCREENSHOT: Burp Repeater with the Authorization: Bearer archive-agent header and the flag in the response]

## 6. Capturing the Flag

The flag appeared **directly in the JSON response body** of `GET /api/secrets` once the `Authorization` header named `archive-agent`:

```json
{"message":"safctf{6035ffad158ce604cb84927b77926d47}","ok":true}
```

**Flag:** `safctf{6035ffad158ce604cb84927b77926d47}`

To retrieve it yourself: run the Step 2 curl command and copy the value inside `message`. If you want *only* the flag printed (no JSON noise) and you installed `jq`:

```bash
curl -s http://54.72.82.22:8410/api/secrets -H "Authorization: Bearer archive-agent" | jq -r .message
```

## 7. Why This Works (Beginner Explanation)

A good token is like a **concert wristband**: the venue issues it, it's hard to counterfeit, and the staff can tell a real one from a fake. A bad token is like **writing your own name on a sticky note and calling it a pass**. This API uses the sticky-note approach — the "token" is just the account name in plain text. So the server can't tell the difference between the real `archive-agent` and me *claiming* to be `archive-agent`.

The second ingredient is **information disclosure**: the downloadable `cluster.json` told us every account name and exactly which one could read secrets. Attackers love a map. Even without it, I could have *guessed* privileged names (`admin`, `root`, `archive-agent`), but the file removed the guesswork entirely.

In the real world this is one of the most common and most damaging bug classes. APIs that trust a client-supplied identity — a header like `X-User-Id: 123`, an unsigned cookie, or a JWT whose signature is never checked — let anyone become anyone. The fix is always the same idea: the **server** must decide identity from something it issued and can verify, never from a value the client is free to rewrite.

## 8. Common Mistakes and Dead Ends

- **Chasing the "intended" multi-step chain.** The API also exposes `PATCH /api/bindings` (bind yourself to the `editor` role), `POST /api/workloads` (create a pod with `serviceAccountName: archive-agent` and `automountServiceAccountToken: true`), and `GET /api/workloads/NAME/logs` (read that pod's mounted token). That mirrors a classic real Kubernetes escalation and **does** work, but it's several moving parts. I started down it (I even created a throwaway workload) before noticing the token was just a name — the one-line header swap makes the whole chain unnecessary. Lesson: **look at what a token actually is before building an elaborate attack.**
- **Only reading the rendered page, not `cluster.json`.** The file is where the privileged account name lives. Skipping the download means missing the map.
- **Forgetting the `Authorization` header entirely.** `GET /api/secrets` with no header just fails; beginners sometimes conclude the endpoint is "broken" instead of "needs auth."
- **Over-formatting the token.** It is exactly `archive-agent` — no `Bearer ` inside the value, no quotes, no `@namespace`. Keep it to the bare name.

## 9. How to Defend Against This

- **Never trust a client-supplied identity.** Derive the user from a server-issued, server-verified credential (a signed JWT whose signature you *actually validate*, or an opaque session token looked up in your own store) — not from a plain name the client can edit.
- **Use unguessable, verifiable tokens.** Random high-entropy session IDs, or signed tokens with a checked signature and expiry. A token must be impossible to forge by typing a different value.
- **Enforce authorization on the server for every request.** Check "does *this authenticated principal* have `get:secrets`?" on the server side, every time — not in the UI and not based on what the caller claims.
- **Don't publish your access map.** Shipping `cluster.json` (account names, roles, who can read secrets) is information disclosure; keep RBAC definitions server-side.
- **Apply least privilege.** `archive-agent` having standalone `get:secrets` with no other guardrail is the blast radius. Scope secret access narrowly and audit it.

## 10. Key Takeaways

- **Always inspect what your "token" really is.** Log in, print the token, and ask: is it random/signed, or just my name? If it's your name, you can probably type someone else's.
- **Downloaded config files are treasure maps.** `cluster.json` named the one account with `get:secrets` — read provided files before attacking.
- **The simplest exploit is often one changed value.** Here it was swapping one word in an HTTP header.
- **Cheatsheet-worthy commands:**
  ```bash
  curl -s -X POST http://TARGET/api/login                               # see what a token looks like
  curl -s http://TARGET/api/secrets -H "Authorization: Bearer NAME"     # swap NAME to impersonate
  ```
- **Learn the Burp "Send to Repeater → edit header → Send" loop** — it's the manual, see-everything version of the curl above.

You just performed a real privilege-escalation attack with nothing but `curl` and careful reading — that exact instinct ("what is this token, really?") will solve a surprising number of web and cloud challenges, so keep it sharp. Fair winds. ⚓



