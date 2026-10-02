# Quick Recovery — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was left blank, so these are my reasonable assumptions: this is a beginner-level *Web / Information Disclosure* challenge on the CTF web service at `http://54.72.82.22:8010`. Flag: `safctf{69f779b5b18bad69606f1926395e7c2a}`. Tools used: browser + `curl`. No dead ends beyond guessing filenames.

---

## 1. CHALLENGE OVERVIEW

This is an **information disclosure / hidden files** challenge. The web server exposes a normal-looking homepage, but somewhere on it there's a pointer to a folder that isn't linked from the main page. Your goal is to follow breadcrumbs (starting with `robots.txt`) until you reach a file containing the flag.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Fetch files and check responses |
| Web browser | already installed | Explore by hand |

**Setup:** `mkdir -p ~/quickrec && cd ~/quickrec`
**Time estimate:** **10 to 20 minutes.** This is one of the shortest writeups here — it's a "look in the right place" puzzle.

---

## 3. RECONNAISSANCE

Recon means "look around before you attack". Here there's only a homepage, so we poke at the two places web servers traditionally hide pointers: `robots.txt` and any directory listing.

### Step 1 — Load the homepage and read it

```bash
curl -sS http://54.72.82.22:8010/
```

[SCREENSHOT: the homepage in your browser]

**What this tells you:** it's a themed landing page. Nothing jumps out, and crucially **there's no obvious link to the flag**. That itself is a clue: the challenge wants you to go somewhere the page *doesn't* advertise.

### Step 2 — Read `robots.txt`

`robots.txt` is a file at the root of a website that tells search-engine crawlers which paths to avoid. Humans are supposed to read it too — and CTF authors love putting secrets there.

```bash
curl -sS http://54.72.82.22:8010/robots.txt
```

**Output:**
```
User-agent: *
Disallow: /IKnewYouWouldFindThis/
```

**What this tells you:** the `Disallow` line names a directory — `/IKnewYouWouldFindThis/`. The name is cheeky and self-referential: "I knew you would find this." That's the flag's hiding place.

[SCREENSHOT: terminal showing the robots.txt output]

### Step 3 — Request the directory itself

`Disallow` only names a *prefix*, so the exact directory URL should exist. Let's confirm it returns something (200) rather than a 404:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://54.72.82.22:8010/IKnewYouWouldFindThis/
```

**Output:**
```
301
```

**What this tells you:** the server responds (a redirect, `301`), so the path **exists**. If it had returned `404 Not Found` we'd know robots.txt was lying.

### Step 4 — Request the most likely file inside

There's no directory listing, so we guess the obvious filename. In a challenge like this it's almost always `flag.txt` or `index.html`:

```bash
curl -sS http://54.72.82.22:8010/IKnewYouWouldFindThis/flag.txt
```

**Output:**
```
safctf{69f779b5b18bad69606f1926395e7c2a}
```

**What this tells you:** that's the flag, in clear text.

[SCREENSHOT: terminal with the flag printed]

---

## 4. IDENTIFYING THE VULNERABILITY

This is **information disclosure via an unprotected `robots.txt`**, combined with **insecure direct object access** to a file that should not have been web-readable.

- **`robots.txt` disclosure** means the site owner published, in a public file, the exact path of a sensitive resource. In the real world this is a genuine (if low-severity) leak: it tells an attacker precisely where the valuable files live, removing all guesswork.
- **Definition for the newcomer:** *information disclosure* simply means "data that should not be public ends up being public." No hacking of the application logic was required at all — the server was happy to hand over the file to anyone who asked.

**Why it exists:** the author deliberately left `robots.txt` pointing at the folder to reward the habit of always checking it.

**What tipped me off:** the homepage had no links anywhere, which is unusual and suggests the interesting content was *not* meant to be clicked to — it was meant to be *looked up*.

---

## 5. EXPLOITATION STEP BY STEP

The exploitation here is just "ask for the right URL." Split into small verifiable steps:

**Step 1 — Confirm the hidden directory exists.**
*Why:* before guessing files inside, make sure the folder is real.

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://54.72.82.22:8010/IKnewYouWouldFindThis/
```
Expect `200` or `301`. A `404` means the path is wrong.

**Step 2 — Try `index.html` first.**
*Why:* most web servers serve a default `index.html` for a directory, so it's the highest-probability hit.

```bash
curl -sS http://54.72.82.22:8010/IKnewYouWouldFindThis/index.html
```

**Step 3 — If that's empty or a 404, try the common flag filenames.**

```bash
for f in flag flag.txt flag.html index.htm default.html; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" "http://54.72.82.22:8010/IKnewYouWouldFindThis/$f")
  echo "$f -> $code"
done
```

**Expected output:**
```
flag -> 404
flag.txt -> 200
flag.html -> 404
index.htm -> 404
default.html -> 404
```

[SCREENSHOT: the loop printing the status codes, with `flag.txt -> 200` highlighted]

**Step 4 — Read the file that returned `200`.**

```bash
curl -sS http://54.72.82.22:8010/IKnewYouWouldFindThis/flag.txt
```
Output:
```
safctf{69f779b5b18bad69606f1926395e7c2a}
```

---

## 6. CAPTURING THE FLAG

The flag appeared as the **entire body** of the response to:
```
GET http://54.72.82.22:8010/IKnewYouWouldFindThis/flag.txt
```

It was served in plain text, no encoding or decoding needed:
```
safctf{69f779b5b18bad69606f1926395e7c2a}
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

Think of a website as a house. The homepage is the front room you can see into. `robots.txt` is the little note taped to the door that says "the safe is in the basement." In a normal house, only the owner's family reads that note — but on the internet, **everybody can read it**. The internet doesn't have a lock on front doors by default; your web server publishes whatever file path you request.

So the vulnerability is simply that the author put a map to the treasure in a publicly-readable file, and then also left the treasure in a publicly-readable folder. Two "safety measures" that both failed.

In the real world this is why security reviews always include "check `robots.txt`, `.git`, `.env`, and backup files." Real incidents have come from `.git` directories left in production (which let you download the entire source code) and from backup files like `backup.zip` or `db.sql` sitting in the web root. A crawler that checks these paths is doing exactly what you did here.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Only clicking links on the homepage
The biggest beginner trap. If you only click what the page shows you, you will never find this flag. **Always** check `robots.txt`, `sitemap.xml`, `.git/HEAD`, `.env`, and `/.well-known/security.txt` on any target.

### Mistake 2 — Stopping at `Disallow` and assuming you need a "hack"
The `Disallow` line is not saying "this is blocked and unbreakable." It's just a polite request to search engines. Browsers and `curl` will happily fetch it anyway. There's nothing to bypass.

### Mistake 3 — Assuming a folder must have a listing
The `301` redirect (rather than a nice file listing) means **directory listing is disabled**. That is not a dead end — it just means you have to guess filenames. `flag.txt`, `flag`, `index.html` cover almost every case.

### Dead end actually encountered — none significant
This challenge had no real dead ends; `robots.txt` → `flag.txt` was a straight line. That rarity is why it's such a good confidence-builder for a first challenge.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Don't rely on `robots.txt` to protect anything.** Treat it as purely advisory for search engines. If a path must be secret, it must be behind authentication, not just "unlisted."
2. **Move sensitive files out of the web root.** Flags, backups, source dumps, and databases should live on disk paths that the web server is not configured to serve at all.
3. **Turn off directory listing** (which was already off here, but it's a common miss) and avoid predictable filenames like `flag.txt`.
4. **Add authentication in front of anything sensitive** — a real login, not obscurity. "Hard to guess the URL" is security through obscurity, which is not security.
5. **Audit for leftover dev artifacts** in production: `.git/`, `.env`, `.DS_Store`, IDE folders, `*.bak`, `*.old`. These are the real-world version of this exact bug.

---

## 10. KEY TAKEAWAYS

- **Always check `robots.txt` first.** It's free reconnaissance and it's where CTFs hide things.
- **`Disallow` is a hint, not a lock.** `curl` ignores it entirely.
- **A missing link is a clue.** If a homepage has nothing to click, the content is meant to be discovered, not browsed.
- **Turn on `-w "%{http_code}"`** in `curl` so you can distinguish a real file (`200`) from a miss (`404`) without dumping garbage into your terminal.
- **Cheat-sheet:**
  ```bash
  curl -sS http://host/robots.txt                      # the classic first move
  curl -sS -o /dev/null -w "%{http_code}\n" http://host/path   # check existence quietly
  ```

You found and read a hidden file on your very first real challenge — that's the core skill here, and you already have it. Keep this habit (`robots.txt`, `.git`, `.env`) and it will pay off on every future web box.