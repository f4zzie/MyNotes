---
title: "Secure Password Database Writeup"
description: "picoCTF Secure Password Database writeup reversing a password database application to extract stored credentials and recover the flag."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Secure Password Database Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- File: `system.out`
- Tools:
- `file`
- `checksec`
- `strings`
- `nm`
- `objdump`
- `python3`
- `nc`

## 1) Inspect binary and symbols

```bash
file system.out
checksec --file=system.out
strings -n 3 system.out
nm -n system.out
```

Interesting functions:
- `hash`
- `make_secret`
- `main`

## 2) Reverse auth logic

```bash
objdump -d -Mintel --start-address=0x1309 --stop-address=0x13d0 system.out
objdump -d -Mintel --start-address=0x13d0 --stop-address=0x1754 system.out
objdump -s --start-address=0x2000 --stop-address=0x2200 system.out
```

Observed bug:
- program asks your password and hash
- but compares input hash against hash of internal decoded secret, not your password

## 3) Recover internal secret

`make_secret` XOR-decodes obfuscated bytes with `0xAA`.

Obfuscated bytes:
- `c3 ff c8 c2 92 9b 8b c0 80 c2 c4 8b`

Decode:

```bash
python3 - << 'PY'
obf = bytes.fromhex('c3ffc8c2929b8bc080c2c48b')
print(bytes([b ^ 0xAA for b in obf]).decode())
PY
```

Recovered secret:
- `iUbh81!j*hn!`

## 4) Reproduce hash function

From reverse:
- seed = `0x1505`
- loop = `h = h*33 + byte` (64-bit wrap)

```bash
python3 - << 'PY'
h = 0x1505
for b in b'iUbh81!j*hn!':
    h = (h*33 + b) & 0xffffffffffffffff
print(h)
PY
```

Computed hash:
- `15237662580160011234`

## 5) Authenticate remotely

```bash
nc candy-mountain.picoctf.net 54587
```

Use any password text, then provide hash:
- `15237662580160011234`

## Final flag

`picoCTF{<redacted>}`
