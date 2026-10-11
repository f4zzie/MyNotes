---
title: "bytemancy 2"
description: "picoCTF Bytemancy 2 writeup sending raw bytes to a network service using pwntools to satisfy binary protocol requirements and retrieve the flag."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# bytemancy 2

## Challenge

**Category:** General Skills  
**Name:** bytemancy 2

**Prompt summary:**

- source code provided as `app.py`
- connect with:

```bash
nc lonely-island.picoctf.net 57958
```

- hint:

> There's no way to print these bytes  
> Use pwntools to send raw bytes over the network

## Goal

Send the exact raw byte sequence the server expects and get the flag.

## Step 1: Read the source

The provided source is:

```python
import sys

while(True):
  try:
    print('Send me the HEX BYTE 0xFF 3 times, side-by-side, no space.')
    print('==> ', end='', flush=True)
    user_input = sys.stdin.buffer.readline().rstrip(b"\n")
    if user_input == b"\xff\xff\xff":
      print(open("./flag.txt", "r").read())
      break
    else:
      print("That wasn't it. I got: " + str(user_input))
  except Exception as e:
    print(e)
    break
```

The important line is:

```python
if user_input == b"\xff\xff\xff":
```

So the service expects exactly:

```text
\xff\xff\xff
```

which is three raw bytes with hexadecimal value `FF`.

## Why normal typing does not work

If you type:

```text
fff
```

or:

```text
\xff\xff\xff
```

that sends ASCII characters, not raw byte `0xFF`.

The server reads from:

```python
sys.stdin.buffer
```

so it is comparing binary data, not text.

## Step 2: Use pwntools to send raw bytes

The simplest solve is:

```python
from pwn import remote

io = remote('lonely-island.picoctf.net', 57958)
io.recvuntil(b'==> ')
io.send(b'\xff\xff\xff\n')
print(io.recvall(timeout=3).decode('latin1', 'replace'))
```

### Explanation

- `remote(...)` connects to the service
- `recvuntil(b'==> ')` waits for the prompt
- `send(b'\xff\xff\xff\n')` sends the three required bytes and then a newline
- the server strips the newline with `.rstrip(b"\n")`
- the remaining bytes are exactly `b"\xff\xff\xff"`

## Step 3: Get the flag

Running the script returned:

```text
picoCTF{<redacted>}
```

## Flag

```text
picoCTF{<redacted>}
```

## Minimal solve

```python
from pwn import remote

io = remote('lonely-island.picoctf.net', 57958)
io.recvuntil(b'==> ')
io.send(b'\xff\xff\xff\n')
print(io.recvall().decode())
```

## Takeaway

When a challenge compares against a Python bytes literal like:

```python
b"\xff\xff\xff"
```

you must send raw bytes, not printable text. `pwntools` makes this easy because `send()` accepts exact byte strings.
