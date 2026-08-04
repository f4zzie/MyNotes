---
title: "Binary Instrumentation 3 (bin-ins3.zip) Writeup"
description: "picoCTF Binary Instrumentation 3 writeup using dynamic binary instrumentation tools like Frida or Pin to trace and solve the challenge."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Binary Instrumentation 3 (bin-ins3.zip) Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

I only used local static-analysis tools:

- `7z`
- `file`
- `rabin2`
- `objdump`
- `strings`
- `xxd`
- `od`
- `python3` standard library (`lzma`, `base64`)

I did not need debugger patching to recover the final flag.

## 1) Unzip the challenge and inspect the executable

```bash
7z x -p'picoctf' bin-ins3.zip
file bin-ins.exe
```

Result:
- `bin-ins.exe` is a 64-bit Windows PE executable.

## 2) Look at the PE sections

```bash
rabin2 -S bin-ins.exe
```

Important output:
- normal sections like `.text`, `.rdata`, `.data`, `.rsrc`, `.reloc`
- one suspicious large custom section: `.ATOM`

`.ATOM` details:
- file offset (`paddr`) = `0x6000`
- file size = `0x6fe00`

Working theory:
- outer executable is a loader
- real payload is hidden in `.ATOM`

## 3) Extract the `.ATOM` section

```bash
dd if=bin-ins.exe of=atom.bin bs=1 skip=$((0x6000)) count=$((0x6fe00)) status=none
```

## 4) Check whether `.ATOM` is compressed

```bash
od -Ax -tx1 -N 32 atom.bin
```

Beginning bytes:
- `5d 00 00 10 00 ...`

This matches LZMA “alone” header structure:
- first byte = properties (`0x5d`)
- next 4 bytes = dictionary size

## 5) Decompress hidden payload with Python

```python
import lzma

data = open("atom.bin", "rb").read()
dec = lzma.decompress(data, format=lzma.FORMAT_ALONE)
open("inner.bin", "wb").write(dec)
```

Then verify:

```bash
file inner.bin
```

Result:
- `inner.bin` is another PE executable.

Confirmed structure:
- `bin-ins.exe` = outer wrapper
- `.ATOM` = compressed payload
- `inner.bin` = real challenge logic

## 6) Inspect the inner executable

Search for relevant strings:

```bash
strings -n 5 inner.bin | grep -E "output_flag|cmd.exe /c echo|flagParts|cGljb0NURns0|MTFfNHIzXzRw|MTVfbjA3aDFu|OV8zbDUzXzRm|NzA2NDBlfQo="
```

Recovered:
- `C:\random\output_flag.txt`
- `cmd.exe /c echo testing if redirection works`
- `cmd.exe /c echo`
- `_ZL9flagParts`
- encoded fragments:
- `cGljb0NURns0`
- `MTFfNHIzXzRw`
- `MTVfbjA3aDFu`
- `OV8zbDUzXzRm`
- `NzA2NDBlfQo=`

From static code/strings, logic is:
- program attempts to create/open output file
- runs command with redirected output
- uses a broken handle comparison (the “messed up” part)
- intended flag text is assembled from `flagParts` fragments

## 7) Decode the Base64 fragments

```python
import base64

parts = [
    b'cGljb0NURns0',
    b'MTFfNHIzXzRw',
    b'MTVfbjA3aDFu',
    b'OV8zbDUzXzRm',
    b'NzA2NDBlfQo='
]

flag = b''.join(base64.b64decode(p) for p in parts)
print(flag)
```

Output:
- `b'picoCTF{<redacted>}\n'`

Removing the trailing newline:
- `picoCTF{<redacted>}`

## 8) Final flag

`picoCTF{<redacted>}`
