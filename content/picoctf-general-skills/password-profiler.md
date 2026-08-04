---
title: "Password Profiler Writeup"
description: "picoCTF Password Profiler writeup using CUPP to generate a custom wordlist from OSINT data and cracking a SHA-1 hash to recover the password."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# Password Profiler Writeup

Recovered password: `Aj_15901990`
Flag format from checker: `picoCTF{<redacted>}`

## Files
- `userinfo.txt`
- `hash.txt`
- `check_password.py`

## Goal
Use OSINT details from `userinfo.txt` to build a custom password list, then crack the SHA-1 hash in `hash.txt` with the provided checker.

## Source Data
```text
First Name: Alice
Surname: Johnson
Nickname: AJ
Birthdate: 15-07-1990
Partner's Name: Bob
Child's Name: Charlie
```

Target SHA-1:
```text
968c2349040273dd57dc4be7e238c5ac200ceac5
```

## Tool Used
- `cupp`
- `python3`

## Solve Steps

1. Generate a custom wordlist with CUPP.
```bash
cd /home/kali/Downloads
cupp -i -q
```

2. Feed the victim profile into CUPP.
```text
First Name: Alice
Surname: Johnson
Nickname: AJ
Birthdate (DDMMYYYY): 15071990
Partners name: Bob
Partners nickname:
Partners birthdate (DDMMYYYY):
Childs name: Charlie
Childs nickname:
Childs birthdate (DDMMYYYY):
Pets name:
Company name:
Add keywords?: n
Add special chars?: y
Add random numbers?: y
Leet mode?: y
```

3. CUPP writes the generated dictionary to `alice.txt`.
```text
Saving dictionary to alice.txt, counting 17352 words.
```

4. Copy that output to the filename expected by the checker and run the checker.
```bash
cp alice.txt passwords.txt
python3 check_password.py
```

## Result
```text
Password found: picoCTF{<redacted>}
```

## Why it Worked
- CUPP combines names, nickname, birthdate fragments, separators, random suffixes, and leetspeak variations.
- One of those generated combinations was `Aj_15901990`.
- The checker computes `sha1(password)` for each candidate in `passwords.txt` until it matches the target hash.

## Verification
You can verify directly in Python:
```bash
python3 - <<'PY'
import hashlib
print(hashlib.sha1(b"Aj_15901990").hexdigest())
PY
```

Expected output:
```text
968c2349040273dd57dc4be7e238c5ac200ceac5
```
