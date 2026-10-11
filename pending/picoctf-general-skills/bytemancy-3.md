---
title: "bytemancy 3"
description: "picoCTF Bytemancy 3 writeup using objdump disassembly and pwntools p32 packing to reconstruct data from binary sections and extract the flag."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# bytemancy 3

## Challenge

**Category:** General Skills  
**Name:** bytemancy 3

**Prompt summary:**

- source code provided as `app.py`
- binary provided as `spellbook`
- connect with:

```bash
nc green-hill.picoctf.net 56727
```

- hint says to use `pwnlib.util.packing.p32()`
- hint also says `objdump -t spellbook` reveals the symbol table

## Goal

Send the correct function addresses as **4 raw bytes in little-endian order** for the procedures the server asks about.

## Step 1: Read the Python source

The challenge wrapper makes the task very explicit:

```python
SPELLBOOK_FUNCTIONS = [
    "ember_sigil",
    "glyph_conflux",
    "astral_spark",
    "binding_word",
]
```

Each round the server:

1. randomly picks 3 of those 4 names
2. looks up the function address inside the local ELF
3. converts the address with `p32(target_addr)`
4. expects us to send exactly those 4 bytes

Critical line:

```python
expected_bytes = p32(target_addr)
```

That means:

- `p32()` packs a 32-bit integer
- on x86 this becomes **little-endian**
- we must send raw bytes, not the address as text like `0x8049176`

## Step 2: Extract the symbol addresses from the binary

Use the symbol table:

```bash
objdump -t spellbook
```

Relevant entries:

```text
08049176 g     F .text  00000024 ember_sigil
0804919a g     F .text  00000027 glyph_conflux
080491c1 g     F .text  00000022 astral_spark
080491e3 g     F .text  00000031 binding_word
```

So the addresses are:

- `ember_sigil` = `0x08049176`
- `glyph_conflux` = `0x0804919a`
- `astral_spark` = `0x080491c1`
- `binding_word` = `0x080491e3`

## Step 3: Convert them to raw little-endian bytes

Using `p32()`:

```python
from pwn import p32

print(p32(0x08049176).hex())  # 76910408
print(p32(0x0804919a).hex())  # 9a910408
print(p32(0x080491c1).hex())  # c1910408
print(p32(0x080491e3).hex())  # e3910408
```

So the byte mappings are:

- `ember_sigil` -> `76 91 04 08`
- `glyph_conflux` -> `9a 91 04 08`
- `astral_spark` -> `c1 91 04 08`
- `binding_word` -> `e3 91 04 08`

These are the exact raw bytes that must be sent.

## Step 4: Automate the interaction

Because the server asks for 3 random names, the easiest solution is to script it.

Exploit script:

```python
from pwn import remote, p32

mapping = {
    b'ember_sigil': p32(0x8049176),
    b'glyph_conflux': p32(0x804919a),
    b'astral_spark': p32(0x80491c1),
    b'binding_word': p32(0x80491e3),
}

io = remote('green-hill.picoctf.net', 56727)

for _ in range(3):
    line = io.recvline_contains(b"address for procedure '")
    name = line.split(b"'")[1]
    io.recvuntil(b'==> ')
    io.send(mapping[name])

print(io.recvall(timeout=3).decode('latin1', 'replace'))
```

## Step 5: Recover the flag

Running the script returned:

```text
picoCTF{<redacted>}
```

## Flag

```text
picoCTF{<redacted>}
```

## Why this works

The challenge is testing three simple binary-reversing skills:

1. identify symbols in an ELF with `objdump -t`
2. understand little-endian byte order
3. send binary data, not text

If you type `0x08049176` into netcat, that is wrong because the program expects:

```text
\x76\x91\x04\x08
```

as four raw bytes.

## Minimal solve path

```bash
objdump -t spellbook | rg 'ember_sigil|glyph_conflux|astral_spark|binding_word'
python3 solve.py
```

Where `solve.py` contains the script above.

## Takeaway

When a binary or service asks for an address, always check whether it wants:

- the human-readable address string
- or the packed byte representation

Here it specifically wanted the packed 32-bit little-endian form, which is exactly what `p32()` is for.
