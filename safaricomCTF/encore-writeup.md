# Encore — Beginner Writeup (Reverse Engineering + Crypto + a Baked-In Pwn)

> **Assumptions I'm stating up front:** the live challenge host in this writeup is written
> as `http://54.72.82.22:8200` — swap in whatever host the scoreboard gives you. I also
> assume you're on **Kali Linux** (or any Linux with the usual tools) and that you have a
> browser handy for **CyberChef** (a free "crypto Swiss-army knife" website). You do **not**
> need to write any Python; there is one tiny optional one-liner near the end, clearly marked.

---

## 1. Challenge Overview

**Encore** is a **500-point** challenge from the **Safaricom CTF (safctf)**. It hands you a
single **Linux program** to download and wraps three mini-puzzles ("stages") behind a
website: a **reverse-engineering** stage, a **cryptography** stage, and an **exploitation**
("pwn") stage. The **goal** is to solve all three and submit each answer on the site; the
third answer makes the server hand back the flag.

- Category: **Reversing + Crypto + Pwn** (3 stages)
- Difficulty: **Hard-ish (500 pts)** — but, as we'll see, far easier than it looks
- Download: `http://54.72.82.22:8200/download`  (a binary named **`encore`**)
- Flag: `safctf{a6aca5b356ad7824a01d0a767b2cd998}`

---

## 2. What You Need Before Starting

Everything here is pre-installed on Kali; install commands are given just in case. Budget
**45 to 90 minutes** as a beginner.

- **curl** — download the binary and talk to the website.
  ```
  sudo apt install curl
  ```
- **file**, **strings**, **nm**, **objdump** — the "look inside a binary" toolkit (they come
  from the `binutils` package).
  ```
  sudo apt install binutils
  ```
- **A web browser with CyberChef** — go to `https://gchq.github.io/CyberChef/` (open it once;
  it caches for offline use). We use it so we never have to script any crypto by hand.

No account or VPN is needed beyond whatever the CTF gives you to reach the host.

---

## 3. Reconnaissance

**The golden rule of reversing: look before you leap.** We gather facts about the program
before trying to "solve" anything.

1. **Open the website and read it.** Point your browser at `http://54.72.82.22:8200/`.
   It shows three "stages" (Round 1/2/3) and a **Download Binary** button. Round 1 is open;
   Rounds 2 and 3 are locked until you answer the one before.

   [SCREENSHOT: the Encore homepage showing the three stages and the Download button]

2. **Download the program with curl.**
   ```
   curl -s http://54.72.82.22:8200/download -o encore
   ```

3. **Ask Linux what the file is.**
   ```
   file encore
   ```
   ```
   encore: ELF 64-bit LSB executable, x86-64, ... dynamically linked, ... not stripped
   ```
   **"ELF 64-bit executable"** means it's a normal Linux program. The magic words are
   **"not stripped"** — the author left all the function names inside, which makes our life
   enormously easier.

4. **Dump the readable text inside it.** `strings` prints any run of printable characters it
   finds in the file.
   ```
   strings encore | less
   ```
   Among the output you'll spot some very loud hints:
   ```
   XOR_KEY_IS_0x42
   LOOP_COUNT_14_BYTE
   OPERATION_XOR_EACH_BYTE
   ...
   ENCORE
   Decrypt the message (hint: Caesar + Vigenere):
   ...
   3nc0r3_pwn3d_2025
   ```
   Read that like a cheat sheet: stage 1 does something with a **14-byte** value and
   **XOR 0x42**; stage 2 is **Caesar + Vigenère** and the word **ENCORE** is sitting right
   there; and `3nc0r3_pwn3d_2025` looks like a planted "token."

   [SCREENSHOT: the strings output highlighting XOR_KEY_IS_0x42, ENCORE, and 3nc0r3_pwn3d_2025]

5. **List the functions.** Because the binary isn't stripped, `nm` shows named functions.
   ```
   nm encore | grep ' T '
   ```
   ```
   ... T stage1_reverse_engineering
   ... T stage2_cryptography
   ... T stage3_exploitation
   ... T vigenere_decrypt
   ... T caesar13_decrypt
   ... T print_token
   ```
   This is basically a table of contents for the whole challenge. Each stage has its own
   function, plus helpers `vigenere_decrypt` / `caesar13_decrypt` (crypto) and `print_token`
   (the thing that reveals stage 3's secret).

6. **Disassemble it** so we can read the actual logic (Intel syntax is easier to read).
   ```
   objdump -d -M intel encore | less
   ```
   We'll zoom into one function at a time in the next sections.

**What recon told us:** this isn't one hard exploit — it's three small puzzles, and the
author left the answers (or the recipe for them) sitting in plain sight.

---

## 4. Identifying the Vulnerability

There isn't *one* vulnerability here — there are three classic "the secret is in the client"
mistakes, one per stage:

- **Stage 1 — a hardcoded secret hidden by weak obfuscation.** The program compares your
  input to a key it builds in memory by taking 14 bytes and **XOR-ing each with `0x42`**.
  **XOR** is a reversible operation (think of it as a light-switch: flip it twice and you're
  back where you started), so if we can see the 14 scrambled bytes we can un-scramble them.
  The `strings` labels (`XOR_KEY_IS_0x42`, `LOOP_COUNT_14_BYTE`) literally spell out the
  recipe.

- **Stage 2 — "security" built on a known cipher with the key shipped alongside it.** The
  message is protected with **Caesar + Vigenère** ciphers. A **Caesar cipher** shifts every
  letter by a fixed amount (here it's **ROT13**, a shift of 13). A **Vigenère cipher** shifts
  each letter by a repeating keyword — and that keyword, **`ENCORE`**, is sitting right there
  in the binary. If you ship the lock *and* the key, it isn't a lock.

- **Stage 3 — a buffer overflow, but the prize is a constant.** The function reads your input
  with **`gets()`**, which has no length limit and will happily write past the end of its
  64-byte buffer — a textbook **stack buffer overflow**. The intended attack ("ret2win")
  overflows into the saved return address to jump to `print_token()`. But the token it prints,
  `3nc0r3_pwn3d_2025`, is a **constant baked into the file**, so we can just read it.

**What tipped us off:** the `strings` output named the XOR key and byte count, named the two
ciphers and the keyword, and even included the stage-3 token verbatim. Recon did 90% of the
work.

---

## 5. Exploitation Step By Step

A key detail first: the three answers are submitted to `POST /submit/stage1`,
`/submit/stage2`, `/submit/stage3` as JSON, and the server remembers your progress in a
**session cookie**. With curl we must **save and reuse that cookie** with a cookie jar
(`-c cj.txt -b cj.txt`), or stage 2 will stay "locked."

### Step 1 — Read the 14 scrambled bytes (Stage 1)

Find the stage-1 function in the disassembly:
```
objdump -d -M intel encore | grep -A40 '<stage1_reverse_engineering>:'
```
You'll see the key being loaded as immediate values (via `movabs`/`mov`). Collected in order,
the **14 bytes** are:
```
10 71 34 70 30 31 71 1d 0f 76 31 36 71 30
```
The loop right after them XORs each byte with `0x42` and compares the result to your input.

[SCREENSHOT: the objdump view of stage1 showing the movabs bytes and the `xor eax, 0x42` loop]

### Step 2 — Un-scramble them with CyberChef (Stage 1 answer)

1. Open **CyberChef**.
2. Drag **"From Hex"** into the recipe (so it reads our bytes as raw bytes).
3. Drag **"XOR"** below it; set **Key = `42`** and the key type to **Hex**.
4. Paste the bytes into the input box:
   ```
   10 71 34 70 30 31 71 1d 0f 76 31 36 71 30
   ```
5. The output reads:
   ```
   R3v3rs3_M4st3r
   ```

[SCREENSHOT: CyberChef with From Hex + XOR(42) producing R3v3rs3_M4st3r]

**What this means:** `R3v3rs3_M4st3r` is the exact string the program wants. (If you prefer
the terminal, the one-liner in the Advanced Alternative does the same thing.)

### Step 3 — Submit Stage 1 with curl (and start the cookie jar)

```
curl -s -c cj.txt -b cj.txt -X POST http://54.72.82.22:8200/submit/stage1 \
  -H 'Content-Type: application/json' \
  -d '{"answer":"R3v3rs3_M4st3r"}'
```
Expected response (note the hint it gives for the next stage):
```
{"success":true,"message":"✓ Stage 1 Complete! ...","hint":"... Caesar and Vigenère ..."}
```
**Look for `"success":true`.** The `-c cj.txt -b cj.txt` is what keeps you "logged in" so
stage 2 unlocks.

### Step 4 — Decrypt the Stage 2 message with CyberChef

The encrypted message shown by the program (and in `strings`) is:
```
Fvtsjcfw_1h_Q0a3iwua
```
The program decrypts it as **Vigenère (key `ENCORE`) first, then ROT13**. In CyberChef:

1. Drag **"Vigenère Decode"** into the recipe; set **Key = `ENCORE`**.
2. Drag **"ROT13"** below it (leave the default rotation of 13).
3. Paste `Fvtsjcfw_1h_Q0a3iwua` as the input.
4. Output:
   ```
   Overflow_1s_P0w3rful
   ```

[SCREENSHOT: CyberChef with Vigenère Decode(ENCORE) + ROT13 producing Overflow_1s_P0w3rful]

**Honest note:** cipher *order* trips people up. Here the recipe that matches the binary is
Vigenère-decode **then** ROT13. ROT13 is its own inverse (doing it twice returns the original),
so if your letters look shifted, try toggling that block — but the order above is what worked.

### Step 5 — Submit Stage 2

```
curl -s -c cj.txt -b cj.txt -X POST http://54.72.82.22:8200/submit/stage2 \
  -H 'Content-Type: application/json' \
  -d '{"answer":"Overflow_1s_P0w3rful"}'
```
Expected:
```
{"success":true,"message":"✓ Stage 2 Complete! ..."}
```

### Step 6 — Understand Stage 3, then just read the token

Look at the stage-3 function:
```
objdump -d -M intel encore | grep -A30 '<stage3_exploitation>:'
```
You'll see it call **`gets`** into a buffer at `rbp-0x40` (that's **64 bytes**). On the stack,
right after a 64-byte buffer sits the **8-byte saved base pointer**, and right after that the
**return address**. So **64 + 8 = 72 bytes** of input, followed by the address of
`print_token`, is the classic "ret2win" overflow that would make the program print the token.

But we don't need to run any of that: `print_token` prints a **constant**, and we already saw
it in recon. Confirm it:
```
strings encore | grep 3nc0r3
```
```
3nc0r3_pwn3d_2025
```

[SCREENSHOT: objdump of stage3 showing the gets() call into the 64-byte buffer]

---

## 6. Capturing the Flag

Submit the stage-3 token with the **same cookie jar**. The server replies with the flag in
the JSON body:

```
curl -s -c cj.txt -b cj.txt -X POST http://54.72.82.22:8200/submit/stage3 \
  -H 'Content-Type: application/json' \
  -d '{"answer":"3nc0r3_pwn3d_2025"}'
```
```
{"success":true,"message":"✓ Stage 3 Complete! ...","flag":"safctf{a6aca5b356ad7824a01d0a767b2cd998}"}
```

The flag is the value of the **`flag`** field:

```
safctf{a6aca5b356ad7824a01d0a767b2cd998}
```

[SCREENSHOT: the final curl response showing "success":true and the flag field]

---

## 7. Why This Works (Beginner Explanation)

Every stage breaks the same rule: **a secret you ship to the user is not a secret.** Once the
program is on our machine, we can read everything inside it.

Stage 1 "hides" its key by XOR-ing with `0x42`. XOR is like a light switch — flip a bit with
the same key and it toggles, flip it again and it toggles back. Because the author told us the
key (`0x42`) and we could see the scrambled bytes, undoing it was a one-step operation. Stage 2
is the same idea with fancier math: a classic cipher is only as strong as its secret key, and
the key `ENCORE` was packed right next to the ciphertext. Stage 3 is the famous `gets()`
mistake — a function that writes user input with no size check, letting input spill past its
buffer and overwrite control data on the stack — except the "win" it guards was a hardcoded
string we could just read.

In the real world these map to very expensive incidents: hardcoded API keys and passwords
found inside mobile apps and firmware, "custom encryption" that's trivially reversible, and
memory-corruption bugs (`gets`, `strcpy`) that have caused decades of remote-code-execution
vulnerabilities. CTFs exaggerate them so you can see them clearly.

---

## 8. Common Mistakes and Dead Ends

1. **Forgetting the cookie jar.** If you drop `-c cj.txt -b cj.txt`, each curl is a brand-new
   session, so stage 2 and 3 stay "locked" and your correct answers look wrong. Keep the jar.
2. **Submitting out of order.** The server only accepts stage 2 after stage 1, and stage 3
   after stage 2. Do them in sequence.
3. **Getting the cipher order/direction wrong in stage 2.** "Caesar + Vigenère" is ambiguous
   until you match the binary: Vigenère-decode with key `ENCORE`, then ROT13. If your output is
   gibberish, you've likely encoded instead of decoded, or swapped the order.
4. **Over-engineering stage 3.** It's tempting to build a real buffer-overflow exploit with a
   debugger. You can — but the token is a constant in the file, so a one-line `strings` is
   enough. Don't burn an hour pwning something you can just read.

---

## 9. How to Defend Against This

- **Never embed secrets (keys, tokens, passwords) in client-side binaries or apps.** Anything
  shipped to the user can be extracted. Keep secrets server-side.
- **Don't invent your own crypto, and never ship the key with the ciphertext.** Use vetted
  libraries and store keys in a secrets manager, not in the program.
- **Replace unbounded input functions.** Ban `gets()`, `strcpy`, `sprintf`; use length-limited
  equivalents (`fgets`, `snprintf`) and bounds-check every buffer.
- **Compile with modern protections.** Stack canaries, ASLR, NX/DEP, and `-D_FORTIFY_SOURCE`
  make overflow-to-win attacks far harder.
- **Validate authorization on the server.** The "stage unlocked" state should be enforced
  server-side (it is here) so a client can't skip steps.

---

## 10. Key Takeaways

- **Recon first.** `file`, `strings`, and `nm` on an un-stripped binary often reveal the whole
  plan before you reverse a single instruction.
- **XOR is reversible** — spotting an XOR with a known constant usually means the secret is one
  CyberChef step away.
- **Known cipher + nearby keyword = instant decrypt.** Reach for CyberChef's Vigenère/ROT13
  blocks instead of writing code.
- **Keep your session** with `curl -c jar -b jar` whenever a site tracks progress with cookies.
- Cheatsheet to save:
  ```
  file target && strings -n 6 target | less
  nm target | grep ' T '          # list functions (if not stripped)
  objdump -d -M intel target | less
  curl -s -c cj.txt -b cj.txt -X POST <url> -H 'Content-Type: application/json' -d '{"answer":"..."}'
  ```

You just cleared a 500-point, three-discipline challenge mostly with `strings` and a browser —
that's exactly how real reversers work: look first, and let the program tell you its secrets.

---

## Advanced Alternative (optional)

If you'd rather compute the two answers in a terminal instead of CyberChef, these tiny
one-liners do it. They're optional — the manual steps above are the real lesson.

**Stage 1** (XOR each byte with 0x42) with pure shell + `printf`:
```bash
for b in 10 71 34 70 30 31 71 1d 0f 76 31 36 71 30; do \
  printf "\\$(printf %03o $((0x$b ^ 0x42)))"; done; echo
# -> R3v3rs3_M4st3r
```

**Stage 2** (Vigenère-decode with key ENCORE, then ROT13), 3 short lines of Python — used only
because chaining two ciphers by hand is error-prone:
```python
# python3
import codecs
def vig(ct,key):
    o="";ki=0
    for c in ct:
        if c.isalpha():
            b=65 if c.isupper() else 97
            k=ord(key[ki%len(key)].upper())-65
            o+=chr((ord(c)-b-k)%26+b); ki+=1
        else: o+=c
    return o
print(codecs.encode(vig("Fvtsjcfw_1h_Q0a3iwua","ENCORE"),"rot13"))
# -> Overflow_1s_P0w3rful
```



