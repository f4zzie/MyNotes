---
title: "JITFP Writeup"
description: "picoCTF JITFP writeup reversing a just-in-time compiled program, analyzing dynamically generated code to understand flag computation."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# JITFP Writeup

Here is the exact writeup of how I solved it, step by step, including the tools and commands used.

## Files and tools used

- Remote binary on host: `ad7e550b`
- Tools:
- `ssh`
- `file`
- `checksec`
- `objdump`
- `readelf`
- `strings`
- `python3` (for runtime memory extraction via `/proc/<pid>/mem`)

## 1) Connect to the remote host

```bash
ssh -p 62688 ctf-player@dolphin-cove.picoctf.net
```

Password used:

```text
1db87a14
```

## 2) Identify the challenge binary

```bash
ls -la
file ad7e550b
checksec --file=ad7e550b
```

Key findings:
- 64-bit PIE ELF, stripped.
- Full RELRO, NX enabled.
- Program expects one argument (`<flag>`).

## 3) Confirm checker behavior and timing hint

```bash
./ad7e550b
```

Output shows usage:

```text
Usage: ./ad7e550b <flag>
```

Testing with dummy input shows:
- It prints progress markers (`*`) with delays.
- It can return partial progress then `Incorrect`.
- This matches the challenge hint: timing/progress leak.

## 4) Reverse the checker structure statically

I inspected disassembly and sections:

```bash
objdump -d -Mintel ad7e550b | sed -n '700,1220p'
readelf -S ad7e550b
objdump -s -j .data ad7e550b
```

Important observations:
- Main check loop validates 33 bytes (`0x21`).
- It sleeps between checks (`sleep@plt`) and prints `*` on success.
- It uses:
- a permutation table in `.data` at `0x4020` (33 dwords)
- a function-pointer table at `0x4120`
- each pointed function is a tiny `cmp input_char, imm8` checker.

This means each position checks for one exact character; the challenge hides the order via table indirection.

## 5) Extract the real checker table at runtime (host-only logic)

`0x4120` is populated in process memory, so I extracted it live from `/proc/<pid>/mem` while the binary runs.

Core idea:
- Start `./ad7e550b` with a 33-byte placeholder.
- Read function pointers from `base + 0x4120`.
- For each function pointer, read the compared byte immediate from function code.
- Apply permutation from `0x4020` to reconstruct the expected flag string.
- Patch argv memory in-place during execution to force all checks to pass.

One-shot script used on the remote host:

```bash
python3 - <<'PY'
import os,pty,subprocess,time,select,sys,struct
perm=[0x1e,0x16,0x0b,0x20,0x19,0x04,0x09,0x07,0x13,0x17,0x05,0x1a,0x12,0x1b,0x10,0x01,0x08,0x0f,0x02,0x0e,0x03,0x0d,0x18,0x15,0x0c,0x11,0x06,0x0a,0x1d,0x1c,0x14,0x1f,0x00]
master, slave = pty.openpty()
arg = bytearray(b'A'*33)
p = subprocess.Popen(['./ad7e550b', arg.decode()], stdin=slave, stdout=slave, stderr=slave, close_fds=True)
os.close(slave)
pid=p.pid
maps=open(f'/proc/{pid}/maps').read().splitlines()
base=None; stack_lo=stack_hi=None
for l in maps:
    if 'ad7e550b' in l and 'r-xp' in l:
        base=int(l.split('-')[0],16)-0x1000
    if '[stack]' in l:
        lo,hi=l.split()[0].split('-'); stack_lo=int(lo,16); stack_hi=int(hi,16)
mem=open(f'/proc/{pid}/mem','r+b',0)
mem.seek(stack_lo)
stack=mem.read(stack_hi-stack_lo)
off=stack.find(b'A'*33+b'\x00')
arg_addr=stack_lo+off
while True:
    try:
        mem.seek(base+0x4120)
        tbl=mem.read(8*33)
        if len(tbl)==8*33:
            vals=struct.unpack('<33Q',tbl)
            chars=[ord('?')]*33
            for i,v in enumerate(vals):
                if v:
                    mem.seek(v+12)      # immediate byte in tiny checker
                    b=mem.read(1)
                    if b: chars[i]=b[0]
            for pos,idx in enumerate(perm):
                c=chars[idx]
                if 32 <= c <= 126:
                    arg[pos]=c
            mem.seek(arg_addr)
            mem.write(arg)
    except Exception:
        pass
    r,_,_=select.select([master],[],[],0.02)
    if r:
        try:
            data=os.read(master,4096).decode('latin-1','ignore')
            if data:
                sys.stdout.write(data)
                sys.stdout.flush()
        except OSError:
            pass
    if p.poll() is not None:
        break
print("\nRecovered:", arg.decode('latin-1'))
PY
```

Output included:
- full progress then `Correct`
- recovered candidate string:

```text
picoCTF{<redacted>}
```

## 6) Verify by running with recovered flag

```bash
./ad7e550b 'picoCTF{<redacted>}'
```

Expected result:

```text
Correct
```

## Final flag

`picoCTF{<redacted>}`

## Optional: copy binary locally for offline notes

From local machine:

```bash
scp -P 62688 ctf-player@dolphin-cove.picoctf.net:~/ad7e550b .
```
