# Prism Orchestra — Beginner Writeup (Reverse Engineering a Bytecode Checker)

## 1. Challenge Overview

**Prism Orchestra** is a **reverse-engineering ("reversing")** challenge from the Safaricom CTF (safctf), worth **450 points**. **Reversing** means taking a compiled program (where we only have the machine binary, not the source code) and figuring out what it does and how to satisfy it. The challenge gives us two downloads — a small Linux program and a data file it reads — and the **goal** is to find the secret 24-character password the program wants, which makes it print the flag.

The flag is `safctf{406279bd-3201-499f-9a4a-f14e8918eb37}`.

## 2. What You Need Before Starting

A beginner should budget **45–90 minutes**. Everything here is standard Linux tooling.

- **`file`**, **`strings`**, **`xxd`** — usually preinstalled. If not: `sudo apt install binutils coreutils`
- **`objdump`** (reads/disassembles binaries) — from binutils: `sudo apt install binutils`
- **`python3`** (only for the final solver) — `sudo apt install python3`
- The two challenge files from the website: **`receipt`** (the program) and **`score.bin`** (its data). Download them from the challenge's `/downloads/` directory with your browser or:
  ```
  curl -O http://<challenge-host>/downloads/receipt
  curl -O http://<challenge-host>/downloads/score.bin
  ```

No account, VPN, or network access is needed once the files are downloaded. **Note:** you do **not** need to run the program as root; there is no SUID/privilege trick here — this is pure logic.

## 3. Reconnaissance

### Step 1 — Identify the files

We always start by asking "what are these?" with the **`file`** command (it prints a file's type):

```
file receipt score.bin
```

Representative output:

```
receipt:   ELF 64-bit LSB pie executable, x86-64, ... stripped
score.bin: data
```

**What this tells us:** `receipt` is a 64-bit Linux **ELF** executable (ELF is just Linux's program format, like `.exe` on Windows). The word **stripped** means the author removed function names, so our disassembly won't have friendly labels — we'll read raw code. `score.bin` is unstructured **data** the program will consume.

[SCREENSHOT: terminal output of `file receipt score.bin`]

### Step 2 — Peek at the data file

`score.bin` is 540 bytes. Let's view it as hex with **`xxd`** (shows bytes side by side with their values):

```
xxd score.bin | head
```

**What to notice:** 540 is exactly divisible by 3 (540 / 3 = **180**). That hints the file is a list of **180 records of 3 bytes each**. Keep that in mind.

### Step 3 — Look at readable text in the program

**`strings`** prints human-readable text embedded in a binary — often revealing prompts, file paths, and format strings:

```
strings receipt
```

Among the output we see a hard-coded path like **`/app/downloads/score.bin`** and references to C functions such as `fgets`, `memcmp`, and `putchar`. **Translation:** the program reads our typed input (`fgets`), opens that `score.bin` file, compares something (`memcmp`), and prints characters one at a time (`putchar`). So `score.bin` is central to the check.

[SCREENSHOT: `strings receipt` output showing /app/downloads/score.bin and memcmp]

### Step 4 — Disassemble the logic

To read the actual instructions, we **disassemble** (turn machine bytes back into human-readable assembly) with **`objdump`**. The `-d` flag disassembles; `-M intel` picks the easier-to-read Intel syntax:

```
objdump -d -M intel receipt | less
```

We also dump the program's constant data sections (where fixed values live) with `-s`:

```
objdump -s -j .data -j .rodata receipt
```

**What we find reading the main function (described in plain English):**

1. It reads **24 characters** from us.
2. It copies those 24 bytes into a scratch buffer we'll call **`work`**.
3. It opens `score.bin` and loops over it **3 bytes at a time**, treating each triple as `(opcode, index, operand)`.
4. After the whole file is processed, it runs **`memcmp`** — a function that checks whether two chunks of memory are byte-for-byte identical — comparing `work` against a fixed **24-byte target** that is built right inside the code (loaded with `movabs` instructions).
5. If they match, it prints the flag.

[SCREENSHOT: objdump showing the movabs constants and the memcmp call in main]

## 4. Identifying the Vulnerability

This isn't a "vulnerability" like a web bug — it's a **crackme**: a program that checks a secret, which we must reverse. The thing we exploit is that **every operation the checker does is reversible**, so we can run it **backwards**.

**Define the core idea — a bytecode VM.** The program is a tiny **virtual machine (VM)**: `score.bin` is a little **program ("bytecode")** written in a made-up instruction set, and `receipt` is the **interpreter** that executes it against our input. Each 3-byte instruction is `(opcode, index, operand)` and changes one byte of `work` at position `index`:

- **opcode 1 — XOR:** `work[index] = work[index] XOR operand`. (**XOR** is a bitwise "toggle"; doing the same XOR twice returns the original — it's its own undo.)
- **opcode 2 — ADD:** `work[index] = (work[index] + operand) mod 256`.
- **opcode 3 — rotate left:** rotate the 8 bits of `work[index]` left by `((operand mod 7) + 1)` positions. (**Bitwise rotate** shifts bits and wraps the ones that fall off the end back around to the other side.)
- **opcode 4 — swap:** swap `work[index]` with `work[operand mod 24]`.

So the checker takes our 24 bytes, scrambles them through **180 reversible steps**, and demands the result equal a fixed target. 

**What tipped us off:** the 540-byte file = 180×3, the `memcmp` against a hard-coded block, and the simple per-byte opcodes all scream "deterministic, invertible transform." If a transform is invertible and we know the required output, we can compute the required **input**.

## 5. Exploitation Step by Step

The plan: **don't guess the password — compute it** by undoing the program.

### Step 1 — Extract the two constants from the binary

What/why: we need the **24-byte target** (the value `memcmp` wants) and the **44-byte KEY** (used to print the flag). Both are visible in the data dump.

```
objdump -s -j .data -j .rodata receipt
```

Read the `movabs` immediates in `main` to reconstruct the 24-byte target, and read the `.data` block for the 44-byte KEY. Write both down as byte lists.

[SCREENSHOT: objdump -s output highlighting the .data KEY bytes]

### Step 2 — Parse `score.bin` into 180 instructions

What/why: so we can replay them. Each instruction is 3 consecutive bytes `(opcode, index, operand)`. There are 180 of them in order.

Conceptually (no code yet): read bytes 0–2 = instruction 1, bytes 3–5 = instruction 2, and so on to instruction 180.

### Step 3 — Invert each instruction and apply them in REVERSE order

What/why: the program does `step1, step2, …, step180` to turn **password → target**. To go **target → password**, we undo from the last step to the first:

- **XOR** undoes with the **same XOR** (XOR is its own inverse).
- **ADD operand** undoes with **SUBTRACT operand** (mod 256).
- **rotate left by n** undoes with **rotate right by n**.
- **swap(a,b)** undoes with the **same swap(a,b)**.

So: start with the 24-byte **target**, walk the 180 instructions **from #180 down to #1**, applying each one's inverse. What remains is the original **24-byte password**.

### Step 4 — Verify by running it forwards

What/why: never trust a reversal blindly. Take the recovered password, run all 180 instructions **forward**, and confirm you reproduce the exact target block. We did, which proves the password is correct **without even needing to run the binary**.

The recovered password is:

```
DDPU5WDMVRKQ2APHL7WPM78W
```

### Step 5 — Derive the flag from the password + KEY

What/why: on success the program prints the flag as `putchar(KEY[i] XOR password[i mod 24])` for `i = 0..43`. So XOR the 44-byte KEY against the (repeating) password to get the 44 flag characters — no need to even feed the binary.

[SCREENSHOT: terminal showing the recovered password and the printed flag]

## 6. Capturing the Flag

XORing the 44-byte KEY with the recovered password yields the flag directly:

```
safctf{406279bd-3201-499f-9a4a-f14e8918eb37}
```

If you prefer to see the real program say it, you would normally just run `./receipt` and type the password. The one catch: this binary **hard-codes** the path `/app/downloads/score.bin`, so it only runs cleanly from that exact location. On a machine where we couldn't create `/app`, running it is blocked — but it doesn't matter, because our **forward-check already reproduced the binary's own target block**, which is conclusive proof.

## 7. Why This Works (Beginner Explanation)

Think of the checker as a **combination lock scrambler**. It takes your 24 characters and runs them through a fixed sequence of simple, reversible twists — flip some bits here, add a number there, rotate, swap two slots — then checks whether the scrambled result matches a pattern frozen into the program. Because the author left the "answer" (the target) inside the binary and used only **reversible** moves, we can run the scrambler **in reverse** starting from that answer and recover exactly what you must type.

The deeper lesson: **if a secret check is fully contained in something the user holds, the user can always reverse it.** The target bytes, the operations, and the key were all shipped inside the download. 

In the real world this is why **client-side-only validation is never real security**: license checks, "premium unlock" flags, or offline password gates that live entirely in software you can inspect are reversible given time. Secrets that must stay secret belong on a server the user cannot read.

## 8. Common Mistakes and Dead Ends

1. **Trying to brute-force the 24 characters.** The keyspace is astronomically large; brute force is hopeless. The intended path is to invert the transform.
2. **Applying the inverses in the wrong order.** You must undo from the **last** instruction to the **first**. Replaying inverses in forward order gives garbage.
3. **Getting the rotate amount wrong.** The shift is `((operand mod 7) + 1)`, and left-rotate is undone by **right**-rotate by the *same* amount — mixing these up corrupts a few bytes and the final check fails silently.
4. **Panicking because the binary won't run** (it wants `/app/downloads/score.bin`). You don't need to run it at all — reversing the data plus the forward-check is enough.

## 9. How to Defend Against This

- **Don't put the answer in the client.** Never ship the expected result (the `memcmp` target) or the key inside a binary users can download.
- **Validate secrets server-side.** Send the user's input to a server you control and let it decide pass/fail, so the logic and target never leave your infrastructure.
- **Use real cryptography, not reversible scrambles.** If you must verify a password locally, store a **salted hash** (e.g., Argon2/bcrypt) and compare hashes — a hash cannot be run backwards into the password.
- **Assume anything shipped can be reverse-engineered.** Obfuscation (stripping symbols, custom bytecode) raises effort but is not a security boundary.

## 10. Key Takeaways

- **Recon first:** `file`, `strings`, and `xxd` reveal a binary's type, embedded paths, and the shape of its data before you ever disassemble.
- **540 ÷ 3 = 180** — spotting that a data file is a clean multiple of a small number often reveals its record structure.
- **Reversible transforms are invertible:** XOR undoes itself, add↔subtract, rotate-left↔rotate-right, swap undoes itself. Undo in **reverse order**.
- **Always forward-verify** a recovered answer against the binary's own target before trusting it.
- Cheatsheet to save: `file`, `strings <bin>`, `objdump -d -M intel <bin>`, `objdump -s -j .data -j .rodata <bin>`, `xxd <data>`.

Reversing feels intimidating the first time, but it's just patient detective work — if you can read a recipe, you can read a program backwards. You've got this.

### Advanced Alternative (optional)

Inverting 180 instructions by hand is impractical and error-prone, so here is the short Python solver we actually used. It parses `score.bin`, applies the inverse of each instruction in reverse order to the extracted target to recover the password, forward-verifies, then XORs the KEY to print the flag.

```python
# TARGET (24 bytes) and KEY (44 bytes) are read from the binary via:
#   objdump -s -j .data -j .rodata receipt   (and the movabs values in main)
TARGET = [ ... 24 bytes ... ]
KEY    = [ ... 44 bytes ... ]
prog = open("score.bin","rb").read()
instrs = [tuple(prog[i:i+3]) for i in range(0, len(prog), 3)]  # 180 x (op,idx,operand)

def rol(b,n): b&=0xff; n&=7; return ((b<<n)|(b>>(8-n)))&0xff
def ror(b,n): b&=0xff; n&=7; return ((b>>n)|(b<<(8-n)))&0xff

work = TARGET[:]                      # start from the required output
for op,idx,operand in reversed(instrs):   # undo last -> first
    if   op==1: work[idx] ^= operand
    elif op==2: work[idx] = (work[idx]-operand) & 0xff
    elif op==3: work[idx] = ror(work[idx], (operand%7)+1)
    elif op==4: j=operand%24; work[idx],work[j] = work[j],work[idx]

password = bytes(work)                # DDPU5WDMVRKQ2APHL7WPM78W

# forward-verify
chk = list(password)
for op,idx,operand in instrs:
    if   op==1: chk[idx] ^= operand
    elif op==2: chk[idx] = (chk[idx]+operand) & 0xff
    elif op==3: chk[idx] = rol(chk[idx], (operand%7)+1)
    elif op==4: j=operand%24; chk[idx],chk[j] = chk[j],chk[idx]
assert chk == TARGET, "reversal failed"

flag = bytes(KEY[i] ^ password[i % 24] for i in range(44))
print(password.decode(), flag.decode())
```

This is optional convenience — the logic is exactly the manual steps in Section 5, just automated so we don't make an arithmetic slip across 180 operations.

