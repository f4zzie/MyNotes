---
title: "Autorev 1 Writeup"
description: "picoCTF AutoRev 1 writeup using automated reverse engineering tools like angr or Z3 to solve constraint-based flag validation."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Autorev 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Remote service only
- Tools:
- `nc`
- `python3`
- `pwntools`

## Challenge behavior

Service sends 20 rounds.
Each round includes:
- a leaked integer line
- a hex-encoded ELF blob
- prompt: `What's the secret?:`

## Key observation

The leaked integer printed before each blob is already the required answer for that round.
So fastest solve is to parse and send it directly.

## Working solver

```python
from pwn import remote
import re

io = remote('mysterious-sea.picoctf.net', 61817)

chunk = io.recvuntil(b"Here's the next binary in bytes:\n")
nums = re.findall(rb'\n(\d+)\n', b'\n' + chunk)
cur = nums[-1]

for r in range(1, 21):
    _ = io.recvline().strip()
    io.recvuntil(b"What's the secret?:")
    io.sendline(cur)

    if r == 20:
        break

    chunk = io.recvuntil(b"Here's the next binary in bytes:\n")
    nums = re.findall(rb'\n(\d+)\n', b'\n' + chunk)
    cur = nums[-1]

print(io.recvrepeat(2).decode('latin-1','replace'))
io.close()
```

## Final flag

`picoCTF{<redacted>}`
