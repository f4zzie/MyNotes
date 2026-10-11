---
title: "Add/On Trap Writeup"
description: "picoCTF Add On Trap writeup analyzing a binary with anti-debugging traps and reversing the validation to extract the correct flag."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Add/On Trap Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- File: `suspicious.zip` (password: `picoctf`)
- Extracted artifact: `.xpi` extension
- Tools:
- `unzip`
- `sed`
- `rg`
- `python3`
- `cryptography.fernet`

## 1) Extract archive and extension

```bash
unzip -P picoctf -l suspicious.zip
unzip -P picoctf -o suspicious.zip -d /tmp/suspicious_work
unzip -o /tmp/suspicious_work/56102ec0438646c68605-1.0.xpi -d /tmp/suspicious_work/xpi
```

## 2) Read extension JS

```bash
sed -n '1,260p' /tmp/suspicious_work/xpi/background/main.js
sed -n '1,260p' /tmp/suspicious_work/xpi/assets/script.js
```

Found:
- Fernet key string
- Fernet ciphertext token

## 3) Decrypt token with key

```bash
python3 - << 'PY'
from cryptography.fernet import Fernet
key=b'cGljb0NURnt5b3UncmUgb24gdGhlIHJpZ2h0IHRyYX0='
tok=b'gAAAAABmfRjwFKUB-X3GBBqaN1tZYcPg5oLJVJ5XQHFogEgcRSxSis1e4qwicAKohmjqaD-QG8DIN5ie3uijCVAe3xiYmoEHlxATWUP3DC97R00Cgkw4f3HZKsP5xHewOqVPH8ap9FbE'
print(Fernet(key).decrypt(tok).decode())
PY
```

## Final flag

`picoCTF{<redacted>}`
