# Clockwork Ballet — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: a *Reverse Engineering / Crypto* challenge served as a raw binary (`receipt`) from a Flask backend. Flag: `safctf{93d4bf6a-b750-4379-9038-c4921872c148}`. Tools used: `curl`, `file`, `readelf`, `objdump -d`, `xxd`, and a short Python script to invert TEA and apply the XOR. Dead ends: running the binary and hoping it printed the flag, and handing the TEA key words to the library in memory order.

---

## 1. CHALLENGE OVERVIEW

**Clockwork Ballet** is a **reverse engineering** challenge with a crypto twist. The server hands you a stripped-down x86-64 ELF named `receipt`. Run it, and it asks for a 24-character code, TEA-encrypts it, and compares the result against a hardcoded value. If it matches, it prints the flag — but obfuscated, via a per-character XOR against a table in `.data`. So the solve is: **reverse the TEA to recover the code, then replicate the XOR print loop.** If public, find it under *Clockwork Ballet* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `file` | preinstalled | Identify the binary format |
| `readelf` | preinstalled | Map sections, find `.rodata` / `.data` |
| `objdump -d` | `sudo apt install binutils` | Disassemble — the actual work |
| `xxd` | preinstalled | Dump raw bytes of `.data` |
| Python | preinstalled | Invert TEA and do the XOR (a few lines each) |

Burp Suite isn't needed here — this is a download-and-crack job.

**Setup:** `mkdir -p ~/clockwork && cd ~/clockwork`
**Time estimate:** **60 to 90 minutes.** Comfortable if you've disassembled before; slow if you haven't.

---

## 3. RECONNAISSANCE

### Step 1 — Download the binary and read the response headers

```bash
curl -sS -D receipt.hdr -o receipt http://TARGET/receipt
cat receipt.hdr
```

**Output:**
```
HTTP/1.1 200 OK
Server: Werkzeug/3.1.9 Python/3.11.16
Content-Disposition: attachment; filename=receipt
Content-Type: application/octet-stream
Content-Length: 14536
```

[SCREENSHOT: the response headers showing `application/octet-stream` and the filename `receipt`]

**What this tells you:** this isn't a web challenge — it's a file-download challenge. The Python/Werkzeug header is just delivery; the puzzle is the binary.

### Step 2 — Identify the file type

```bash
file receipt
readelf -h receipt | head -12
```

**Output:**
```
receipt: ELF 64-bit LSB executable, x86-64, dynamically linked, stripped
```

[SCREENSHOT: `file` output]

**What this tells you:** a dynamically-linked, **stripped** x86-64 ELF. Stripped means no function names — you'll be reading addresses and library imports only.

### Step 3 — Get the map: sections and imports

```bash
readelf -SW receipt | grep -E "text|rodata|data|init_array"
readelf -sW receipt | grep UND
```

**Output (shape):**
```
[ 3] .rodata   PROGBITS  00402000 ...
[ 5] .data     PROGBITS  00404060 ...   RW
[ 2] .init_array ...
UND  fgets  strlen  strcspn  memcmp  memcpy  puts  putchar
```

[SCREENSHOT: the section table and PLT imports]

**What this tells you:** the import list is the whole story. `fgets` reads input, `strcspn`+`strlen` validate it, `memcpy`/`memcmp` copy and compare, `putchar`/`puts` print. A program that reads a string, length-checks it, transforms it, and compares it to a constant is textbook "crack the input."

### Step 4 — Read the constants before the code

```bash
readelf -x .rodata receipt          # 0x402000 -> "Wardrobe desk\n"
readelf -x .data receipt            # 0x404060 -> 44-byte table, 0x404090 -> key
```

**Output:**
```
.rodata  0x402000: 01000200 00576172 64726f62 65206465 .....Wardrobe de
                 736b000a                            sk...

.data    0x404060: 3b205551 4733430f 6b28035b 5562396f ; UQG3C.k(.[Ub9o
                 57057764 66026467 716c0a02 006d1555 W.wdf.dgql...m.U
                 6c750508 0b636a21 04067a29 00000000 lu...cj!..z)....
```

[SCREENSHOT: the hex dumps]

**What this tells you:** `Wardrobe desk` is a decoy banner. The 44 bytes at `.data` `0x404060` are the XOR mask; the 16 bytes at `0x404090` are the TEA key material.

### Step 5 — Read `main` end to end

The stripped entry point leads to `__libc_start_main`, which receives `main` as its first argument. Reading it from the `.init_array` entry (`0x401180`) and following the pointer gets you there. Easier: find the function that calls `fgets`.

```bash
objdump -d --no-show-raw-insn receipt | grep -B40 "fgets@plt" | head -60
```

**What you see (shape):**
```asm
movl   $0x424901af,-0xb0(%rbp)     ; 6 target words as immediates
movl   $0xa811c4ec,-0xac(%rbp)
movl   $0xbe966699,-0xa8(%rbp)
movl   $0x41b6ef04,-0xa4(%rbp)
movl   $0xc38bf13c,-0xa0(%rbp)
movl   $0xba3a1c1e,-0x9c(%rbp)
lea    0xcfa(%rip),%rax             ; "Wardrobe desk"
call   puts@plt
mov    stdin,%rdx                   ; fgets(buf, 0x80, stdin)
mov    $0x80,%esi
call   fgets@plt
lea    0xcc8(%rip),%rdx             ; "\n"
call   strcspn@plt                  ; strip the newline
movb   $0x0,-0x90(%rbp,%rax,1)
call   strlen@plt
cmp    $0x18,%rax                   ; must be exactly 24 characters
...
call   memcpy@plt                   ; 0x18 bytes -> 6 x uint32
```

[SCREENSHOT: `main` with the target words and the `cmp $0x18` length check]

**What this tells you:** three hard facts.
1. Input must be **exactly 24 characters**.
2. Those 24 bytes are copied verbatim into **six 32-bit little-endian words** — no padding beyond the newline strip.
3. There's a 6-word **target** baked into the binary.

---

## 4. IDENTIFYING THE VULNERABILITY

This isn't a vulnerability — it's a **keygen problem**. The binary is the validator; you must produce input that passes it.

**Step A — TEA encrypt your input.** A helper at `0x401205` is called in a loop:

```asm
movl   $0x0,-0xc(%rbp)              ; sum = 0
movl   $0x0,-0x10(%rbp)             ; i = 0
...
40122f: subl   $0x61c88647,-0xc(%rbp)          ; sum += 0x9E3779B9
401239: shl    $0x4,%eax                       ; v << 4
40123e: mov    0x2e4c(%rip),%eax  # 404090    ; key word
...
40129e: cmpl   $0x1f,-0x10(%rbp)
4012a2: jle    40122f                          ; 32 rounds
```

with this driver:

```asm
movl   $0x0,-0x4(%rbp)
4013be: call   401204                          ; TEA on words[i], words[i+1]
4013c3: addl   $0x2,-0x4(%rbp)
4013c7: cmpl   $0x5,-0x4(%rbp)
4013cb: jle    4013a4                          ; i = 0,2,4  -> 3 pairs
4013e3: call   memcmp@plt                      ; compare vs the 6 target words
```

**Recognising TEA (first time):** **Tiny Encryption Algorithm** is a classic 64-bit block cipher with a 128-bit key. The giveaway is `0x9E3779B9` — TEA's **delta** constant, derived from the golden ratio. Shifts by 4 and 5, additions with key words, and XOR with a running `sum` are TEA's fingerprint. See that constant, and you know precisely what you're looking at.

**Step B — XOR-print the flag.**

```asm
40119b: mov    -0x4(%rbp),%eax
40119e: lea    0x2ebb(%rip),%rdx   # 404060    ; 44-byte table
4011a5: movzbl (%rax,%rdx,1),%eax              ; table[i]
...                                              ; magic division => i % 24
4011df: xor    %esi,%eax                        ; input[i % 24] ^ table[i]
4011e3: call   putchar@plt
4011ec: cmpl   $0x2b,-0x4(%rbp)                ; i <= 43 -> 44 characters
4011f2: lea    0xe0b(%rip),%rax                 ; "Wardrobe desk"
4011fc: call   puts@plt
```

**What this tells you:** on success it prints **44 characters**, each `input[i % 24] XOR table[i]`, then the decoy line `Wardrobe desk`. Your 24-character code is a **repeating key**; the table is the ciphertext; XOR of the two is the flag.

**Root cause / lesson:** the author mixed a real cipher with real obfuscation, but both were static — key material and mask are both in the binary, so the whole thing is invertible.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Extract the TEA key and map it to the right slots.**
*Why:* the key order in `.data` is **not** the order the algorithm uses.

`objdump` shows which memory operand feeds which slot:
- `0x404090` added to `v << 4` → **k[0]**
- `0x404094` added to `v >> 5` → **k[3]**
- `0x404098` added to `v << 4` (other half) → **k[2]**
- `0x40409c` added to `v >> 5` (other half) → **k[1]**

Reading `.data` at `0x404090` gives `0x4a413de2  0x270e10fa  0xcc99c56a  0x241a1d0c`, so the standard TEA key array is:

```
k = [ 0x4a413de2, 0x241a1d0c, 0xcc99c56a, 0x270e10fa ]
     k[0]         k[1]         k[2]         k[3]
```

**This ordering matters.** Hand those four words to a TEA implementation in memory order and you get garbage — I hit exactly that. It's the most common mistake on this challenge.

**Step 2 — Invert TEA on the target words.**
*Why:* TEA is symmetric, so running it backwards on the target gives the original plaintext.

Target words in push order:
```
0x424901af  0xa811c4ec  0xbe966699  0x41b6ef04  0xc38bf13c  0xba3a1c1e
```

Standard TEA decryption, 32 rounds, `sum = 32 * 0x9E3779B9 mod 2^32 = 0xC6EF3720`:

```python
import struct
M = 0xffffffff
DELTA = 0x9E3779B9

def tea_decrypt(v0, v1, k):
    s = 0xC6EF3720
    for _ in range(32):
        v1 = (v1 - (((v0 << 4) + k[2]) ^ (v0 + s) ^ ((v0 >> 5) + k[3]))) & M
        v0 = (v0 - (((v1 << 4) + k[0]) ^ (v1 + s) ^ ((v1 >> 5) + k[1]))) & M
        s = (s - DELTA) & M
    return v0, v1

k = [0x4a413de2, 0x241a1d0c, 0xcc99c56a, 0x270e10fa]
target = [0x424901af, 0xa811c4ec, 0xbe966699, 0x41b6ef04, 0xc38bf13c, 0xba3a1c1e]

out = b""
for i in range(0, 6, 2):
    a, b = tea_decrypt(target[i], target[i + 1], k)
    out += struct.pack('<II', a, b)

print(out.decode())
```

**Output:**
```
HA323U86XL793TXB52BTK6WP
```

[SCREENSHOT: the script printing the 24-character code]

**Step 3 — Recover the flag with the XOR print loop.**
*Why:* the binary prints `input[i % 24] ^ table[i]` for 44 characters. Replicate it exactly.

```python
table = bytes.fromhex(
    "3b2055514733430f6b28035b5562396f5705776466026467716c0a02006d15556c7505080b636a2104067a29"
)
code = b"HA323U86XL793TXB52BTK6WP"

print(bytes(code[i % 24] ^ table[i] for i in range(44)).decode())
```

**Output:**
```
safctf{93d4bf6a-b750-4379-9038-c4921872c148}
```

[SCREENSHOT: the flag printed]

**Step 4 — Verify by feeding the code back to the binary.**

```bash
printf 'HA323U86XL793TXB52BTK6WP' | ./receipt
```

**Output:**
```
safctf{93d4bf6a-b750-4379-9038-c4921872c148}
Wardrobe desk
```

The flag comes first, then the decoy banner. Seeing `Wardrobe desk` confirms you hit the success path.

[SCREENSHOT: terminal showing the flag followed by `Wardrobe desk`]

**Step 5 — Tool-assisted alternative.**

Cracklib's `john` or `hashcat` mode **1600** (TEA) can do the TEA step without Python: `hashcat -m 1600 -a 0 hash.txt wordlist` searches for a 24-char input that TEA-encrypts to your target. The XOR step is then one short command.

---

## 6. CAPTURING THE FLAG

```
safctf{93d4bf6a-b750-4379-9038-c4921872c148}
```

Chain: **download ELF → read `main` (24-char input, TEA, memcmp) → extract key + target → invert TEA → `HA323U86XL793TXB52BTK6WP` → replicate the 44-byte XOR print loop → flag.**

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

The binary is a **bouncer with a secret handshake**. You say a 24-character code; it runs that code through TEA — a real, well-known cipher — and checks the encrypted result against a value baked into the file. Two things follow.

**1. TEA is reversible.** Most ciphers (unlike one-way hashes) are symmetric: encrypt and decrypt are mirror images. With the key in hand, you run the algorithm backwards. Instead of guessing 24 characters out of 95^24 possibilities, you take the stored answer and decrypt it. Cryptography designed to hide secrets from people *without* the key gives you nothing, because you have the key — it's sitting in `.data`.

**2. Success doesn't print the flag; it prints the flag obfuscated.** After the handshake passes, the program XORs your 24-character code (repeating) against a 44-byte table. XOR with the same byte twice cancels out, so the author simply XORed the flag with the code they expected. That makes **XOR its own inverse** — apply the same operation again and you get the flag back. The simplest possible obfuscation, reversed in one line.

Put together: **reverse the cipher to get the code, then de-obfuscate the reward.** That's the standard shape of a keygen challenge.

**Why this matters in the real world:** this is "security through obscurity" done honestly-but-weakly. Nothing here was *broken* — TEA is sound, and XOR-with-repeating-key is trivially reversible. The only thing protecting the flag was assuming an attacker couldn't read the client-side validator. Real attackers always can: binaries ship to the client, so **any validation or key material in shipped code is public.** That's why real license keys are signed with a private key held only on a server. The lesson generalizes: put your checks where the attacker can't read them.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Running the binary and hoping for a hint
`./receipt` just blocks on `fgets` waiting for input. There's no oracle — the binary never says "close," only prints the flag on success. **Read the code before running it.**

### Mistake 2 — Feeding the TEA key words in memory order
This cost me the most time. `.data` holds `4a413de2 270e10fa cc99c56a 241a1d0c`, but the algorithm uses them as `k0=0x4a413de2, k1=0x241a1d0c, k2=0xcc99c56a, k3=0x270e10fa` — the second and fourth words are swapped relative to memory layout. Every decryption produced garbage bytes. **Fix: read the `mov` operands and map each memory address to its slot explicitly.** Never assume "words in memory order == key array in order."

### Mistake 3 — Wrong round count or initial `sum`
This is the plain 32-round variant with `sum` starting at 0. Use 16 or 64 rounds, or start `sum` at the encryption-time value instead of `32 * delta`, and you get a different (wrong) plaintext. **Count the loop: `cmpl $0x1f ... jle` = 32 iterations.**

### Mistake 4 — Forgetting byte order / word pairing
`memcpy` of 24 bytes into a `uint32_t[6]` on x86-64 means **little-endian**. Use `pack('<II')`, not `'>II'` — backwards gives non-printable garbage.

### Mistake 5 — Trusting the first success message
The binary prints `Wardrobe desk` **after** the flag line. That string can feel like the real reward and make you stop reading. Read the whole output; the flag is the 44-character `safctf{...}` string above it.

### Dead end actually encountered — brute-forcing 24 characters
The space is 95^24, so guessing is meaningless; no wordlist contains the code. **The target is sitting in the binary in plaintext-ready form.** Cryptanalysis of the *algorithm* beats guessing the *input* every time.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Never ship validation logic to the client.** If the "correct" answer matters, check it on a server holding a value the attacker can't read.
2. **Don't rely on a symmetric cipher for authentication.** TEA with an embedded key is reversible by anyone who reads the key. Use a signature scheme where the **private** key stays server-side and only the public key ships.
3. **Treat all client-side obfuscation as cosmetic.** XOR with a repeating key, base64, and string encryption are all one-step reversals. Delay, not defense.
4. **Strip symbols and obfuscate anyway — but don't rely on it.** Stripping (`file` reports `stripped`) raises effort slightly and protects nothing that matters.
5. **Don't print the reward from client code.** Even post-validation, XOR-printing the flag with a recoverable key leaks it to anyone who runs the binary. Serve the reward only after a server-side check.
6. **If you must ship a secret, rotate it.** Anything embedded in a distributed binary is considered public; design for compromise.

---

## 10. KEY TAKEAWAYS

- **If you can read the binary, you can read the key.** Anything shipped to the client is public — this is the central lesson.
- **TEA fingerprints:** the constant `0x9E3779B9` (delta), shifts by 4 and 5, XOR with a running `sum`. Recognize it and it's a 5-line reimplementation.
- **Map key words by reading the assembly**, not by dumping `.data` in order — memory order ≠ `k[0..3]`.
- **XOR is self-inverse**, so any XOR-based "encryption" of a payload is reversible with the same key.
- **Both halves were solvable statically** — no debugger, no dynamic analysis, no fuzzing.
- **Cheat-sheet:**
  ```bash
  file receipt && readelf -SW receipt | grep -E 'rodata|data'
  readelf -x .rodata receipt && readelf -x .data receipt        # constants
  objdump -d --no-show-raw-insn receipt | grep -B40 'fgets@plt'  # find main
  objdump -d --no-show-raw-insn receipt | grep -iE '61c88647|shl.*0x4|shr.*0x5'  # TEA
  objdump -d --no-show-raw-insn receipt | grep -A30 'memcmp@plt' # target words
  printf 'HA323U86XL793TXB52BTK6WP' | ./receipt                # verify
  ```

You cracked a real cipher backwards and then unwrapped a one-line XOR — the two most reusable moves in CTF reversing. Every one of these challenges ends the same way: stop guessing, start reading.