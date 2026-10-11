---
title: "Labyrinth — Writeup"
description: "Challenge: Labyrinth (crypto/misc reverse engineering, VM-based crackme)"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Challenge:** Labyrinth (crypto/misc reverse engineering, VM-based crackme)
**File:** `labyrinth.zip` → `labyrinth` (ELF 64-bit x86-64, statically linked, stripped, 8864 bytes)
**Flag:** `r00t{z3_4nd_p4t13nc3_b34t_mb4!!}`

---

## 1. First run

```
$ ./labyrinth
[labyrinth] thread: Access denied.          (exit code 1)
```

The program prints a prompt, reads input, and rejects it. There is no hint about
the expected input — this is a pure black-box crackme, so we reverse it.

```
$ file labyrinth
ELF 64-bit LSB executable, x86-64, statically linked, stripped
$ strings -n 4 labyrinth
L4BYR1NTH.EQ.TAB
YOw=
.shstrtab
.text
lbtab
.bss
```

Interesting: there are essentially **no readable strings** except `lbtab`
(a custom section name) and `L4BYR1NTH.EQ.TAB`. The output strings
("Access denied." / "You found the exit.") must be hidden somewhere —
suspicious: they are probably **encrypted in the binary** and decrypted at
runtime.

---

## 2. Structure

```
$ readelf -S labyrinth
  [ 1] .text    PROGBITS  0000000000401000  00001000  (code, 0x62b bytes)
  [ 2] lbtab    PROGBITS  0000000000402000  00002000  (0x140 bytes of data)
  [ 3] .bss     NOBITS    0000000000402140  00002140  (0x280 bytes, zeroed)
```

The `.text` section contains a small dispatcher with no `ret`-heavy main —
it looks like a **custom interpreter**. The `lbtab` section holds encrypted
data. The `.bss` at `0x402140` is where things get decrypted and where the VM
memory lives.

---

## 3. Decryption routine (0x4010e0–0x401144)

Disassembly (pseudo):

```
rbp = 0xb7e151628aed2a6b          ; xorshift64 state
r11 = 0x2545f4914f6cdd1d          ; multiplier
r8  = 0x402000                    ; source (lbtab)
for chunk in range(0, 0x130, 8):          # 38 chunks
    # xorshift64 next():
    rax = (rbp >> 12) ^ rbp
    rax = rax ^ (rax << 25)
    rbp = (rax >> 27) ^ rax
    rbx = rbp * r11                          # 64-bit multiply
    for j in range(8):
        out[chunk + j] = ((rbx >> (8*j)) & 0xff) ^ src[0x10 + chunk + j]
```

The 0x130 bytes decrypted into `0x402140..0x40226f` are then scattered with
SSE moves into `.bss` tables:

```
0x4023a0 <- [0x402140]   (16B)     0x4023b0 <- [0x402150]   (16B)
0x402380 <- [0x402160]             0x402390 <- [0x402170]
0x402360 <- [0x402180]             0x402370 <- [0x402190]
0x402340 <- [0x4021a0]             0x402350 <- [0x4021b0]
0x402320 <- [0x4021c0]             0x402330 <- [0x4021d0]
0x402300 <- [0x4021e0]             0x402310 <- [0x4021f0]
0x4022e0 <- [0x402200]   (16B: program bytes)
0x402280 <- [0x402210]   (96B: message strings)
```

I reimplemented the xorshift decryption in Python and dumped the result. It was
verified byte-for-byte against live memory with `gdb-pwndbg` (break at
`0x401233` after the copies):

| Table   | Contents |
|---------|----------|
| `A/B`   | multiplier bytes for `esi` arithmetic |
| `C/D`   | multiplier bytes for the `in[(ip+5)%32]` term |
| `E/F`   | multiplier bytes for the `r9` term |
| `G/H`   | additive constants |
| `I/J`   | logic-op selectors (0=AND, 1=OR, 2=XOR, 3=AND-NOT) |
| `K/L`   | target byte constants |
| program | `07 30 3e b5 2d 83 9f 11 07 71 c3 2a a0 e8 4f 51` |
| messages| `0x4022a0`: "You found the exit.\n", `0x4022c0`: "Access denied.\n" |

---

## 4. The VM

Input handling (`0x401254–0x401384`): `read(0, buf, 127)` into the stack,
strip a trailing `\n`/`\r`, copy at most 32 bytes into a zeroed 32-byte VM
"memory" at `[rsp..rsp+31]`. The VM then runs a fixed instruction sequence,
dispatching on `eax` (each handler loads the next opcode from a *fixed*
program byte — the "program" is a static sequence, not a PC stream).

Main loop starts with `eax = 0xb1` (reset: `r11 = 0, ip = 0`). The dispatch
chain:

| opcode | effect |
|--------|--------|
| `0xb1` | reset registers; next opcode from program byte 0 |
| `0x07` | `r8 = in[ip]`, `ebx = in[(ip+5)&31]`, `r10 = in[(ip+11)&31]` |
| `0x30` | `r9 = logic(I[ip]&3, r8, r10)` — table-driven op |
| `0x3e` | `esi = A[ip] * r8` |
| `0xb5` | `esi += C[ip] * ebx` |
| `0x2d` | `esi += E[ip] * r9` |
| `0x83` | `esi += G[ip]` |
| `0x9f` | `r11 |= sil ^ K[ip]` (accumulated check) |
| `0x11` | `ip++`; loop while `ip <= 31`, then opcode `0x71` (end) |

The program is simply the block `07 30 3e b5 2d 83 9f 11` executed for
`ip = 0..31` (the opcode at byte 8 is a second `0x07`, and byte 9 is the
terminator `0x71`).

At the end (`0x401460`): `r11d == 0` → print "You found the exit.", exit 0;
otherwise print "Access denied.", exit 1.

---

## 5. Turning the VM into equations

Since `r11` is OR-accumulated, `r11 == 0` requires **every** iteration to
contribute `0`, i.e. for every `ip`:

```
(esi & 0xff) == K[ip]
```

with

```
esi = A[ip]*in[ip] + C[ip]*in[(ip+5)%32] + E[ip]*r9 + G[ip]   (mod 2^32)
r9  = LOGIC(I[ip]&3, in[ip], in[(ip+11)%32])
```

All table bytes are odd, so `E[ip]` is invertible mod 256. Solving for `r9`:

```
r9 = (K[ip] - G[ip] - A[ip]*in[ip] - C[ip]*in[(ip+5)%32]) * E[ip]^{-1}   (mod 256)
```

This is a system of 32 constraints over 32 byte variables, each linking three
input bytes: `in[ip]`, `in[(ip+5)%32]`, `in[(ip+11)%32]`.

### 5.1 The trap: XOR vs OR

Initial reading of the logic-op handler assumed `I&3 == 1` was XOR, but the
first z3 solve returned **unsat**. Tracing a known input through the VM with
`gdb-pwndbg` (conditional breakpoint at the `0x9f` handler, dumping `r9` for
every iteration) showed, e.g. at `ip=7`: `r8=0x3c, r10=0x24 → r9=0x3c`.
`0x3c ^ 0x24 = 0x18` but `0x3c | 0x24 = 0x3c` — the op is **OR**!

Re-reading the byte stream at `0x401603` (`44 89 c2` = `mov edx, r8d`, not
`mov eax, r8d`) confirms:

```
0x401613: lea eax,[r8+r10]      ; r8 + r10
0x401603: mov edx,r8d
0x401606: and edx,r10d          ; r8 & r10
0x401609: sub eax,edx           ; (r8+r10) - (r8&r10) = r8 | r10
```

So the four ops are: `0 → AND`, `1 → OR`, `2 → XOR`, `3 → AND-NOT`.

---

## 6. Solving with z3

The constraint system (all arithmetic mod 256, bitwise ops on 8-bit vectors)
is a perfect fit for z3:

```python
inp = [BitVec(f'i{i}', 8) for i in range(32)]
for ip in range(32):
    a = inp[ip]; b = inp[(ip+5) % 32]; x = inp[(ip+11) % 32]
    t = ((TK[ip] - TG[ip] - TA[ip]*a - TC[ip]*b) * invE[ip]) & 0xff
    s.add(LOGIC(TI[ip] & 3, a, x) == t)
    s.add(ULE(inp[ip], 0x7e), UGE(inp[ip], 0x20))   # printable ASCII
```

Result:

```
r00t{z3_4nd_p4t13nc3_b34t_mb4!!}
```

Verification — feed the flag to the real binary:

```
$ printf 'r00t{z3_4nd_p4t13nc3_b34t_mb4!!}' | ./labyrinth
[labyrinth] thread: You found the exit.     (exit code 0)
```

---

## 7. Flag

```
r00t{z3_4nd_p4t13nc3_b34t_mb4!!}
```

---

## 8. Key takeaways / mitigations

1. **Obfuscation ≠ security.** A custom VM with an xorshift-encrypted
   program is only security-by-obscurity. Any logic check on user input can
   be modelled and solved (z3/SAT or symbolic execution).
2. **Check the arithmetic, not the intent.** Misreading one operand
   (`mov edx` vs `mov eax`) flipped XOR into OR; runtime tracing with
   `gdb-pwndbg` and comparing register dumps against a simulator is the
   reliable way to validate a model.
3. For real authentication use standard, audited constructions
   (HMAC, AEAD), never hand-rolled checks in obfuscated VMs.

---

## Files

- `solve_labyrinth.py` — z3 solver (printable + raw modes), with the full
  table constants and constraint derivation.
- `labyrinth` — the challenge binary.
