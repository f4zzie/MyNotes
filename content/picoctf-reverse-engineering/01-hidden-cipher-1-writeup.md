---
title: "Hidden Cipher 1 Writeup"
description: "picoCTF Hidden Cipher 1 writeup reversing an encryption algorithm to decode the hidden flag from ciphertext output."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Hidden Cipher 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: `hiddencipher.zip`, extracted `hiddencipher`
- Tools:
- `unzip`
- `file`
- `checksec`
- `upx`
- `nm`
- `objdump`
- `nc`
- `python3`

## 1) Extract and inspect

```bash
unzip -l hiddencipher.zip
unzip -o hiddencipher.zip -d /tmp/hiddencipher_work
file /tmp/hiddencipher_work/hiddencipher
checksec --file=/tmp/hiddencipher_work/hiddencipher
```

Binary was UPX-packed.

## 2) Unpack and reverse

```bash
upx -d /tmp/hiddencipher_work/hiddencipher -o /tmp/hiddencipher_work/hiddencipher.unpacked
nm -n /tmp/hiddencipher_work/hiddencipher.unpacked
objdump -d -Mintel --start-address=0x12a9 --stop-address=0x148c /tmp/hiddencipher_work/hiddencipher.unpacked
```

Recovered behavior:
- key built in `get_secret`: `S3Cr3t`
- output is hex of `flag[i] XOR key[i % 6]`

## 3) Get remote ciphertext

```bash
nc candy-mountain.picoctf.net 61607
```

Captured ciphertext hex:
- `235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d01156a57224306172e`

## 4) Decrypt

```bash
python3 - << 'PY'
ct = bytes.fromhex('235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d01156a57224306172e')
key = b'S3Cr3t'
pt = bytes([b ^ key[i % len(key)] for i, b in enumerate(ct)])
print(pt.decode())
PY
```

## Final flag

`picoCTF{<redacted>}`
