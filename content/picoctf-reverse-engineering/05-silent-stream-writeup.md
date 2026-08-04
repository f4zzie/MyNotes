---
title: "Silent Stream Writeup"
description: "picoCTF Silent Stream writeup recovering hidden data from a binary that outputs the flag through non-obvious channels or side effects."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Silent Stream Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: `packets.pcap`, `encrypt.py`
- Tools:
- `file`
- `sed`
- `tshark`
- `python3`

## 1) Inspect provided files

```bash
file packets.pcap encrypt.py
sed -n '1,260p' encrypt.py
```

`encrypt.py` shows byte encoding:
- `encode_byte(b, key) = (b + key) % 256`
- key used: `42`

## 2) Extract TCP payload bytes

```bash
tshark -r packets.pcap -T fields -e tcp.payload
```

Concatenate non-empty payload lines as hex.

## 3) Reverse transform and rebuild file

```bash
python3 - << 'PY'
import subprocess
out = subprocess.check_output(['tshark','-r','packets.pcap','-T','fields','-e','tcp.payload'], text=True)
hexstr = ''.join(line.strip() for line in out.splitlines() if line.strip())
enc = bytes.fromhex(hexstr)
dec = bytes((b - 42) % 256 for b in enc)
open('/tmp/silent_stream_decoded.jpg','wb').write(dec)
print('decoded bytes:', len(dec))
PY
```

## 4) Verify output type

```bash
file /tmp/silent_stream_decoded.jpg
```

Then open image and read flag text.

## Final flag

`picoCTF{<redacted>}`
