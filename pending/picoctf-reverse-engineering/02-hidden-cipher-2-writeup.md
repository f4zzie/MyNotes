---
title: "Hidden Cipher 2 Writeup"
description: "picoCTF Hidden Cipher 2 writeup tackling a more complex cipher implementation requiring deeper static analysis to reverse the encoding."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Hidden Cipher 2 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Tools:
- `nc`
- `python3`

## 1) Connect and pass gate prompt

```bash
nc crystal-peak.picoctf.net 62957
```

Prompt asked:
- `What is 8 - 1?`
- answer: `7`

## 2) Observe encoding rule

Service prints integer list like:
- `784, 735, 693, ...`

Check first value:
- `784 / 7 = 112` -> ASCII `p`

So encoding is:
- `encoded = ascii * 7`

## 3) Decode all numbers

```bash
python3 - << 'PY'
vals=[784,735,693,777,469,588,490,861,763,364,812,728,665,686,357,728,343,770,700,665,693,343,784,728,357,798,665,357,343,392,371,707,700,350,707,875]
print(''.join(chr(v//7) for v in vals))
PY
```

## Final flag

`picoCTF{<redacted>}`
