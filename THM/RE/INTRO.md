# TryHackMe — Reverse Engineering Introduction

> **Platform**: [TryHackMe](https://tryhackme.com) | **Topic**: Reverse Engineering Fundamentals | **Difficulty**: Beginner → Intermediate

---

## 1. What is Reverse Engineering?

**Reverse engineering** (RE) is the process of analyzing a compiled binary to understand what it does **without having access to the source code**.

### Why Learn RE?
| Use Case | Description |
|---|---|
| **Malware Analysis** | Understand what malicious software does, extract IOCs |
| **Vulnerability Research** | Find bugs in closed-source software |
| **CTF Competitions** | Solve crackmes, keygens, flag extraction challenges |
| **Software Security** | Audit binaries for backdoors, verify patches |
| **Exploit Development** | Understand program behavior to craft exploits |
| **Game Hacking** | Understand game internals (educational) |

---

## 2. Core Concepts

### Compilation Pipeline
```
Source Code (.c/.cpp)
    |
    v
Preprocessor --> Compiler --> Assembler --> Linker
    |               |            |            |
  .i file       .s (asm)     .o (object)   ELF/PE binary
```

### Key Terms
| Term | Definition |
|---|---|
| **Disassembly** | Converting machine code → assembly instructions |
| **Decompilation** | Converting machine code → pseudo-C code (approximate) |
| **Static Analysis** | Analyzing without executing (disassembler) |
| **Dynamic Analysis** | Analyzing while running (debugger) |
| **Debugging** | Stepping through code, examining memory/registers |
| **Patching** | Modifying binary instructions to change behavior |
| **ELF** | Executable and Linkable Format (Linux binaries) |
| **PE** | Portable Executable (Windows binaries) |

---

## 3. Essential RE Tools

### Disassemblers / Decompilers
| Tool | Platform | Cost | Best For |
|---|---|---|---|
| **Ghidra** | All | Free | Full RE with decompiler (NSA) |
| **IDA Pro** | All | $$$$ | Industry standard |
| **IDA Free** | All | Free | Disassembly only (no decompiler) |
| **Cutter** | All | Free | Rizin-based, modern UI |
| **Binary Ninja** | All | $$ | Clean HLIL decompiler |
| **radare2** | All | Free | CLI-based, scriptable |

### Debuggers
| Tool | Platform | Best For |
|---|---|---|
| **GDB + Pwndbg** | Linux | Binary exploitation, CTF |
| **GDB + GEF** | Linux | Similar to Pwndbg, different UI |
| **x64dbg** | Windows | Windows RE, malware analysis |
| **WinDbg** | Windows | Kernel debugging, crash analysis |
| **OllyDbg** | Windows | Legacy 32-bit debugging |

### Supporting Tools
| Tool | Purpose |
|---|---|
| `file` | Identify file type (ELF, PE, script, etc.) |
| `strings` / `FLOSS` | Extract readable text from binaries |
| `ltrace` | Trace library function calls |
| `strace` | Trace system calls |
| `objdump` | Disassemble sections, view headers |
| `readelf` | Parse ELF structure |
| `checksec` | Check binary protections (NX, ASLR, canary, PIE) |
| `nm` | List symbols in binary |
| `ldd` | List shared library dependencies |

---

## 4. x86/x64 Assembly Essentials

### Registers (x64)
| Register | Purpose | Notes |
|---|---|---|
| `RAX` | Return value, accumulator | Function return values |
| `RBX` | Base register | Callee-saved |
| `RCX` | Counter, 1st arg (Windows) / 4th arg (Linux) | Loop counter |
| `RDX` | Data, 2nd arg (Windows) / 3rd arg (Linux) | Division |
| `RSI` | Source index, 2nd arg (Linux) | String operations |
| `RDI` | Destination index, 1st arg (Linux) | String operations |
| `RSP` | Stack pointer | Always points to top of stack |
| `RBP` | Base pointer | Frame pointer |
| `RIP` | Instruction pointer | Next instruction to execute |
| `R8-R15` | General purpose (x64 only) | R8/R9 = 5th/6th args (Linux) |

### Calling Conventions
| Convention | Args 1-6 | Return | Caller/Callee Saved |
|---|---|---|---|
| **Linux x64 (System V)** | RDI, RSI, RDX, RCX, R8, R9 | RAX | Caller: RAX,RCX,RDX,R8-R11 |
| **Windows x64** | RCX, RDX, R8, R9 (+ shadow space) | RAX | Caller: RAX,RCX,RDX,R8-R11 |
| **Linux x86 (cdecl)** | Stack (right-to-left push) | EAX | Caller cleans stack |

### Essential Instructions
| Instruction | Meaning | Example |
|---|---|---|
| `mov dst, src` | Move/copy value | `mov rax, rbx` |
| `push val` | Push to stack (RSP -= 8) | `push rbp` |
| `pop dst` | Pop from stack (RSP += 8) | `pop rbp` |
| `lea dst, [addr]` | Load effective address (no dereference) | `lea rax, [rbp-0x10]` |
| `call func` | Push return addr, jump to function | `call 0x401000` |
| `ret` | Pop return addr, jump to it | Return from function |
| `cmp a, b` | Compare (sets flags, no store) | `cmp eax, 0` |
| `test a, b` | AND (sets flags, no store) | `test eax, eax` (check zero) |
| `je/jz` | Jump if equal/zero | After `cmp` |
| `jne/jnz` | Jump if not equal/not zero | After `cmp` |
| `jmp addr` | Unconditional jump | `jmp 0x401050` |
| `xor a, a` | Zero out register | `xor eax, eax` (eax = 0) |
| `nop` | No operation | NOP sled, padding |
| `syscall` | System call (x64 Linux) | After setting RAX = syscall # |
| `int 0x80` | System call (x86 Linux) | After setting EAX = syscall # |

---

## 5. Common RE Patterns

### Function Prologue & Epilogue
```asm
; Prologue - sets up stack frame
push rbp          ; Save old base pointer
mov rbp, rsp      ; Set new base pointer
sub rsp, 0x20     ; Allocate 32 bytes for local variables

; ... function body ...

; Epilogue - tears down stack frame
leave             ; mov rsp, rbp; pop rbp
ret               ; Return to caller
```

### If/Else Pattern
```asm
cmp eax, 5        ; if (x == 5)
jne else_branch    ;   if not equal, jump to else
; ... then code ...
jmp end_if
else_branch:
; ... else code ...
end_if:
```

### Loop Pattern
```asm
mov ecx, 10       ; counter = 10
loop_start:
; ... loop body ...
dec ecx            ; counter--
jnz loop_start     ; if counter != 0, loop again
```

### String Comparison
```asm
lea rdi, [user_input]    ; arg1 = user input
lea rsi, [correct_pass]  ; arg2 = correct password
call strcmp               ; compare strings
test eax, eax            ; check result
je access_granted         ; if equal -> success
```

---

## 6. RE Methodology for CTF

### Step 1: Reconnaissance
```bash
file challenge           # What type of binary?
checksec challenge       # What protections?
strings challenge        # Any visible strings?
ltrace ./challenge       # What library calls?
```

### Step 2: Static Analysis
```bash
# Load into Ghidra or Cutter
# Find main()
# Read decompiled code
# Identify: input, validation logic, success/fail paths
```

### Step 3: Dynamic Analysis
```bash
# Load into GDB with Pwndbg
gdb ./challenge
> break main
> run
> step/next through code
> examine registers and memory
```

### Step 4: Common CTF Challenges

| Challenge Type | What to Do |
|---|---|
| **Password check** | Find `strcmp`/custom compare, extract correct password |
| **XOR encryption** | Find XOR loop, extract key and ciphertext |
| **Flag in memory** | Run in debugger, break after decode, read memory |
| **Anti-debug** | Patch out `ptrace` / `IsDebuggerPresent` checks |
| **Keygen** | Understand validation algorithm, write keygen |
| **Obfuscated** | De-obfuscate: XOR strings, base64, custom encoding |
| **Packed** | Unpack first (UPX, custom), then analyze |
| **Multi-stage** | Follow execution flow through unpacking/decoding stages |

---

## 7. Linux Syscalls Reference (x86/x64)

### Common Syscalls
| Syscall | x86 (EAX) | x64 (RAX) | Purpose |
|---|---|---|---|
| `read` | 3 | 0 | Read from file descriptor |
| `write` | 4 | 1 | Write to file descriptor |
| `open` | 5 | 2 | Open file |
| `close` | 6 | 3 | Close file descriptor |
| `execve` | 11 | 59 | Execute program |
| `exit` | 1 | 60 | Exit process |
| `mmap` | 90 | 9 | Map memory |
| `mprotect` | 125 | 10 | Change memory protections |
| `fork` | 2 | 57 | Create child process |
| `ptrace` | 26 | 101 | Debug process (anti-debug target) |

---

## 8. Recommended TryHackMe Rooms for RE

| Room | Difficulty | Focus |
|---|---|---|
| **Intro to x86-64** | Easy | Assembly basics |
| **Reverse Engineering** | Easy | Basic RE methodology |
| **Crackme** | Easy-Medium | Password cracking |
| **Ghidra** | Medium | Using Ghidra for RE |
| **Radare2** | Medium | radare2 commands |
| **Buffer Overflow Prep** | Medium | Stack overflow basics |
| **Binex** | Medium | Binary exploitation |
| **Gatekeeper** | Medium | Real-world buffer overflow |
| **Brainstorm** | Hard | Advanced buffer overflow |
| **RE (Challenge)** | Hard | Put it all together |

---

## 9. Practice Path

```
1. Learn x86 assembly basics (registers, instructions, stack)
2. Get comfortable with GDB + Pwndbg
3. Solve easy crackmes (crackmes.one)
4. Learn to use Ghidra/Cutter decompiler
5. Understand common vulnerability classes (BOF, format strings)
6. Progress to binary exploitation (pwntools, ROP)
7. Try malware analysis (combine static + dynamic RE)
```

---

## Pro Tips

> **Read the decompiler output, not just assembly** — Ghidra's decompiler turns 50 lines of ASM into 10 lines of C. Start there, then verify with assembly when things look wrong.

> **Rename functions and variables as you go** — In Ghidra/IDA, press `L` to rename. `FUN_004010a0` means nothing. `check_password` means everything.

> **Dynamic > Static for beginners** — When stuck, run it in GDB. Set breakpoints before and after interesting code. Examine registers. Watch values change in real-time.

> **Learn to read compiler patterns** — Compilers generate predictable code for `if/else`, `for`, `while`, `switch`. Once you recognize the patterns, RE becomes much faster.


