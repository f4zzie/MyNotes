---
title: "Binary Instrumentation 4 (bin-ins4.zip) Writeup"
description: "picoCTF Binary Instrumentation 4 writeup applying advanced instrumentation techniques to hook functions and extract the flag at runtime."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Binary Instrumentation 4 (bin-ins4.zip) Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: `bin-ins4.zip`, extracted `bin-ins.exe`
- Tools:
- `7z`
- `file`
- `rabin2`
- `objdump`
- `strings`
- `dd`
- `python3` (`lzma`, `base64`)

## 1) Unzip and inspect the outer binary

```bash
7z x -p'picoctf' bin-ins4.zip
file bin-ins.exe
```

Result:
- `bin-ins.exe` is a 64-bit Windows PE.

## 2) Inspect PE sections

```bash
rabin2 -S bin-ins.exe
```

Important finding:
- custom section `.ATOM`
- file offset (`paddr`) = `0x6000`
- size = `0x6fe00`

This strongly suggests an embedded packed payload.

## 3) Extract `.ATOM`

```bash
dd if=bin-ins.exe of=atom.bin bs=1 skip=$((0x6000)) count=$((0x6fe00)) status=none
```

## 4) Identify compression format

```bash
xxd -l 16 atom.bin
```

Header starts with:
- `5d 00 00 10 00 ...`

That is the LZMA-alone header pattern.

## 5) Decompress `.ATOM` into inner executable

```bash
python3 - << 'PY'
import lzma, pathlib
atom = pathlib.Path('atom.bin').read_bytes()
inner = lzma.decompress(atom, format=lzma.FORMAT_ALONE)
pathlib.Path('inner.exe').write_bytes(inner)
print('inner size:', len(inner))
PY

file inner.exe
```

Result:
- `inner.exe` is another PE executable (real challenge logic).

## 6) Extract behavior clues from inner executable

```bash
strings -n 5 inner.exe | rg -n "192\.168\.29\.25|9867|Enter the key|key9e60dee4|Congratulations|flagParts|lstrcmpA|cGljb0NURnt|uM3R3MHJrXz|FzXzRQMXNfN|FNfVzMxMV85|ZTYwZGVlNH0K" -i
```

Recovered strings include:
- `192.168.29.25`
- `Enter the key:`
- `key9e60dee4`
- `Congratulations! Here's your flag:`
- Base64 fragments:
- `cGljb0NURnt`
- `uM3R3MHJrXz`
- `FzXzRQMXNfN`
- `FNfVzMxMV85`
- `ZTYwZGVlNH0K`

## 7) Confirm compare logic in disassembly

```bash
objdump -d -Mintel --start-address=0x401560 --stop-address=0x401a80 inner.exe
```

Main flow:
- creates socket (`WSAStartup`, `socket`, `connect`)
- connects to `192.168.29.25:9867`
- sends text prompt
- receives response
- compares response with hardcoded key via `lstrcmpA`
- success path concatenates `flagParts` and sends success message + decoded flag content

## 8) Rebuild and decode the flag

Concatenate fragments first:

```text
cGljb0NURntuM3R3MHJrXzFzXzRQMXNfNFNfVzMxMV85ZTYwZGVlNH0K
```

Decode:

```bash
python3 - << 'PY'
import base64
s = 'cGljb0NURntuM3R3MHJrXzFzXzRQMXNfNFNfVzMxMV85ZTYwZGVlNH0K'
print(base64.b64decode(s).decode())
PY
```

Output:
- `picoCTF{<redacted>}`

## Final flag

`picoCTF{<redacted>}`
