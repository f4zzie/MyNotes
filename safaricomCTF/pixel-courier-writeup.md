# Pixel Courier — Beginner Writeup (Reverse Engineering a Crackme)

> **Note:** This is a *reversing* challenge, not a web one. The tools are different
> (`file`, `strings`, `objdump`) but every step below is a command you can type by hand.
> You do **not** need to write Python — there is a tiny optional solver at the very end,
> clearly marked.

---

## 1. Challenge Overview

**Pixel Courier** is a **Reverse Engineering** challenge from the **Safaricom CTF (safctf)**.
The website hands you a single downloadable program (a Linux executable called **`receipt`**),
and the **goal** is to figure out what secret the program hides and make it reveal the flag.

- Category: **Reversing (binary analysis)**
- Difficulty: **Easy (150 points)**
- Download: `http://<challenge-host>/downloads/receipt`
- Flag: `safctf{e7802274-4b04-488a-9319-39ca86e83c9f}`

The challenge text mentions a "circulated checksum" from "an older release." **That is a
red herring** — the binary is completely self-contained, and we never needed to look up any
hash. We will prove that as we go.

---

## 2. What You Need Before Starting

You need a **Linux x86-64 machine** (Kali is perfect) and about **30 to 60 minutes** as a
beginner. All the tools below usually come pre-installed on Kali; install commands are given
just in case.

- **curl** — download the file.
  ```
  sudo apt install curl
  ```
- **file** — tells you what kind of file something is. (Part of the base system.)
- **strings** — prints readable text found inside a binary.
  ```
  sudo apt install binutils
  ```
- **objdump** — a *disassembler*: it turns the program's machine code back into human-readable
  CPU instructions. (Also in `binutils`.)
- **xxd** — shows the raw bytes of a file as hex. (Part of the base system.)

**Accounts / VPN:** none. You just download one file.

**Key idea to hold in your head:** a program like this is a **"crackme"** — a small puzzle
binary that asks for a password and only does something interesting if you give the right one.

---

## 3. Reconnaissance

**Step 1 — Download the file.**

```
curl -s http://<challenge-host>/downloads/receipt -o receipt
```

**Step 2 — Ask what it is.** Never run an unknown file blindly; first identify it.

```
file receipt
```

Output:

```
receipt: ELF 64-bit LSB executable, x86-64, ... dynamically linked,
         interpreter /lib64/ld-linux-x86-64.so.2, ... stripped
```

Plain English: it's a **Linux 64-bit program** (ELF = the Linux executable format). The word
**"stripped"** means the author removed the function names, so our disassembler won't show
friendly labels like `main` — we'll have to read the code itself. That's normal for CTFs.

**Step 3 — Look at the readable text inside it.** `strings` dumps anything that looks like text.

```
strings receipt
```

Representative output (the interesting bits):

```
Parcel desk
762["SI+
p|fgfq
w2wv|yrr%zm
+-lc4}
 i!?
fgets stdin putchar strlen strcspn
```

Two things jump out: a prompt **`Parcel desk`**, and a blob of **gibberish**
(`762["SI+ ...`) that is clearly not normal English — that's data the program will transform.
The function names at the bottom (`fgets`, `strcspn`, `strlen`, `putchar`) tell us it
**reads a line of input**, trims it, measures it, and **prints characters one at a time**.

[SCREENSHOT: terminal output of `strings receipt` highlighting "Parcel desk" and the gibberish blob]

**Step 4 — Run it and see what it wants.** First make it executable, then run it.

```
chmod +x receipt
echo "test" | ./receipt
```

Output:

```
Parcel desk
```

So it prints a prompt and reads a line from us. Give it the wrong input and nothing secret
happens. We now need to learn **what input it wants**.

---

## 4. Identifying the Vulnerability

This isn't a "vulnerability" in the web sense — it's a **reverse-engineering puzzle**. The
"weakness" we exploit is that **the binary contains everything needed to defeat it**: both the
password check *and* the flag are baked inside, and the operations it uses are **reversible**.

**Define the key terms (first time):**

- **XOR** (written `^`) — a reversible "scrambling" operation on bytes. Its magic property:
  if `c = a ^ b`, then `a = c ^ b`. XOR something twice with the same value and you get the
  original back. CTFs love it because it's trivial to undo once you know the key.
- **Disassembly** — reading the program's CPU instructions to understand its logic.

**What the program actually does (the two stages):**

1. It reads a **24-character password**, then runs a per-character check against a hidden
   table. If every character passes, you're in.
2. On success, it prints the flag by **XOR-ing** a hidden key with your (correct) password.

So the flag is literally `hidden_key XOR correct_password`. Once we recover the correct
password, the flag falls out. The sign that tipped us off: `strings` showed a block of
non-text bytes (the hidden key) and the imports showed character-by-character printing
(`putchar`) — the shape of a "transform then print" routine.

---

## 5. Exploitation Step by Step

**Step 1 — Disassemble the program.**

What/why: we need to read the logic. `objdump` prints the instructions; `-M intel` picks the
easier-to-read Intel syntax. We save it to a file so we can scroll.

```
objdump -d -M intel receipt > receipt.asm
```

[SCREENSHOT: the objdump command completing and the resulting receipt.asm opened in a text editor]

**Step 2 — Find the checking loop.** Open `receipt.asm` and look for the loop that reads your
input and compares it. Reading past the boilerplate, the logic (translated into plain terms)
checks each character position `i` from 0 to 23 with this rule:

```
(((13 * i + 0x5b) XOR input[PERM[i]]) + i) & 0xff  ==  TARGET[i]
```

Here `PERM` is a fixed shuffle order and `TARGET` is a fixed table of 24 expected bytes, both
sitting in the binary. We read their bytes straight out of the disassembly (they're loaded
with `movabs` constants):

```
PERM   = 00 0a 04 05 07 02 0b 03 11 14 12 13 0d 10 09 0e 0c 08 15 17 16 01 0f 06
TARGET = 1f 25 25 ba c5 cd 03 95 9b 8a a4 b3 b2 54 67 6a 8e 1b 1a 2b 29 50 65 cb
```

**Step 3 — Turn the check around to recover the password.** This is the one bit of math, but
it's small. The check says "scramble my input and it must equal `TARGET`." To find the input,
we **undo** the scramble. Solving the line above for the input character gives:

```
input[PERM[i]] = (13 * i + 0x5b) XOR ((TARGET[i] - i) & 0xff)
```

In words, for each position `i`: take `13*i + 0x5b`, subtract `i` from the target byte, and
**XOR** them. Because XOR undoes itself and subtraction undoes the earlier addition, this
hands back the exact character the program wanted. Doing that for all 24 positions yields:

```
DWT8V52N2HLTUQE6CPGBQMJJ
```

(If you'd rather not do the arithmetic by hand 24 times, there's a 6-line helper at the very
end — but it is **optional**.)

**Step 4 — Hand the password back to the program.** We don't even need to compute the flag
ourselves — the binary's second stage does it for us once the password is right. Pipe it in:

```
echo "DWT8V52N2HLTUQE6CPGBQMJJ" | ./receipt
```

Expected output:

```
Parcel desk
safctf{e7802274-4b04-488a-9319-39ca86e83c9f}
```

[SCREENSHOT: terminal showing the correct password piped in and the flag printed on the next line]

That's the whole exploit: read the check, invert it, feed the answer back.

---

## 6. Capturing the Flag

The flag appears **on standard output, right after the `Parcel desk` prompt**, the moment the
24-character password passes the check. Internally the program computes each flag byte as
`KEY[i] XOR password[i mod 24]` (the hidden `KEY` is the gibberish `strings` showed us), but
you never have to do that step — running the binary with the right password prints it for you:

```
safctf{e7802274-4b04-488a-9319-39ca86e83c9f}
```

---

## 7. Why This Works (Beginner Explanation)

A crackme is a locked box where **the key is engraved on the inside of the lock**. The author
had to put the password check and the flag-printing routine *into the program itself*, because
the program runs offline with no server to ask. That means a careful reader can always recover
them.

The reason it unravels so cleanly is **XOR and simple arithmetic are reversible**. Scrambling
with `XOR`, adding a number, shuffling positions — each of these has an exact opposite
(`XOR` again, subtract, un-shuffle). Reverse engineering is often just "read the recipe, then
cook it backwards."

In the real world this is why **you can't hide secrets inside client-side software**. API
keys baked into a mobile app, license checks inside a desktop `.exe`, "hidden" passwords in
firmware — anyone with the file and patience can extract them. If the user's machine holds the
secret, the user can read it.

---

## 8. Common Mistakes and Dead Ends

1. **Chasing the "circulated checksum / older release" hint.** The challenge description
   nudges you to go hunt a file hash on some archive. We tried mentally to connect it and it
   led nowhere — **the binary is self-contained**. Flavor text in CTFs is sometimes pure
   misdirection; trust what the file actually does.
2. **Forgetting `chmod +x`.** A freshly downloaded binary isn't executable yet; `./receipt`
   will say "Permission denied" until you run `chmod +x receipt`.
3. **Wrong architecture / OS.** This is a Linux x86-64 ELF. Running it on the wrong platform
   fails confusingly — always run `file` first and use a matching machine (Kali x86-64).
4. **Typing the password with a trailing space or newline.** The program trims the newline,
   but an extra space makes it a different 25-character string and the check fails. Pipe it
   exactly: `echo "DWT8V52N2HLTUQE6CPGBQMJJ" | ./receipt`.

---

## 9. How to Defend Against This

- **Never store secrets or flags in client-side binaries.** If the user runs it, assume they
  can read every byte and every constant inside it.
- **Do authentication/authorization on a server**, where the client can't see the check.
- **Don't rely on "security through obscurity"** (XOR, custom shuffles, "stripped" binaries).
  Obfuscation slows an attacker down for minutes, not forever.
- For genuine license/integrity needs, use **proper cryptographic signatures** verified
  against a key the attacker does not control, and accept that offline checks are bypassable.

---

## 10. Key Takeaways

- **Recon a binary in this order:** `file` (what is it?) → `strings` (readable clues?) →
  run it (what does it ask?) → `objdump -d -M intel` (read the logic).
- **XOR and addition are reversible** — most "crackme" checks can be inverted to recover the
  expected input instead of brute-forcing it.
- **Let the binary do the work:** once you have the password, you often don't need to compute
  the flag yourself — just feed the password back in.
- **Treat CTF flavor text with suspicion** — the "checksum/older release" hint here was a
  dead end by design.

Cheatsheet to save: `file`, `strings`, `objdump -d -M intel <bin> > out.asm`, `xxd <bin> | less`,
`chmod +x <bin>`, `echo "PASS" | ./<bin>`.

You just reverse-engineered a real program and inverted its logic by hand — that's the core
skill of the whole category. The next crackme will feel noticeably less scary. Keep going!

---

### Advanced Alternative (optional)

Everything above is doable by hand. If you'd rather automate the 24-character inversion,
this short Python snippet does exactly the arithmetic from Section 5 Step 3 — **it's optional
and only saves you from repeating the same subtraction/XOR 24 times**:

```python
PERM   = [0x00,0x0a,0x04,0x05,0x07,0x02,0x0b,0x03,0x11,0x14,0x12,0x13,
          0x0d,0x10,0x09,0x0e,0x0c,0x08,0x15,0x17,0x16,0x01,0x0f,0x06]
TARGET = [0x1f,0x25,0x25,0xba,0xc5,0xcd,0x03,0x95,0x9b,0x8a,0xa4,0xb3,
          0xb2,0x54,0x67,0x6a,0x8e,0x1b,0x1a,0x2b,0x29,0x50,0x65,0xcb]
pw = [0]*24
for i in range(24):
    pw[PERM[i]] = ((13*i + 0x5b) ^ ((TARGET[i] - i) & 0xff)) & 0xff
print(bytes(pw).decode())   # -> DWT8V52N2HLTUQE6CPGBQMJJ
```

Then `echo "DWT8V52N2HLTUQE6CPGBQMJJ" | ./receipt` prints the flag, exactly as in Section 6.



