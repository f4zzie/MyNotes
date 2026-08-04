---
title: "Bypass Me Writeup"
description: "picoCTF Bypass Me writeup patching or reversing binary validation logic to bypass authentication checks and reveal the flag."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Bypass Me Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Remote file: `bypassme.bin`
- Tools:
- `ssh`
- `scp`
- `file`
- `checksec`
- `nm`
- `strings`
- `objdump`
- `python3`

## 1) Connect and fetch binary

```bash
ssh -p 50568 ctf-player@foggy-cliff.picoctf.net
# password: f3b61b38
scp -P 50568 ctf-player@foggy-cliff.picoctf.net:/home/ctf-player/bypassme.bin /tmp/bypassme.bin
```

## 2) Inspect symbols and strings

```bash
file /tmp/bypassme.bin
checksec --file=/tmp/bypassme.bin
nm -n /tmp/bypassme.bin
strings -n 3 /tmp/bypassme.bin | rg "Raw Input|Sanitized|flag|Denied"
```

Key functions:
- `_Z15decode_passwordPc`
- `_Z8sanitizePKcPc`
- `_Z13auth_sequencev`
- `main`

## 3) Reverse decode routine

```bash
objdump -d -Mintel --start-address=0x1333 --stop-address=0x1457 /tmp/bypassme.bin
```

Decoded bytes are XORed with `0xAA` from constants:
- `f9 df da cf d8 f9 cf c9 df d8 cf`

Decode:

```bash
python3 - << 'PY'
enc = bytes.fromhex('f9dfdacfd8f9cfc9dfd8cf')
print(bytes([b ^ 0xaa for b in enc]).decode())
PY
```

Password recovered:
- `SuperSecure`

## 4) Verify comparison target in `main`

```bash
objdump -d -Mintel --start-address=0x162e --stop-address=0x1840 /tmp/bypassme.bin
```

Important behavior:
- sanitizer output is shown
- auth compare uses raw input against decoded password

## 5) Authenticate remotely

```bash
ssh -p 50568 ctf-player@foggy-cliff.picoctf.net
./bypassme.bin
# Enter: SuperSecure
```

## Final password

`SuperSecure`

## Final flag

`picoCTF{<redacted>}`
