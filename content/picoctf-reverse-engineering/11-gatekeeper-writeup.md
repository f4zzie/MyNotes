---
title: "Gatekeeper Reverse Engineering Writeup"
description: "picoCTF Gatekeeper writeup reversing a gatekeeper binary with multiple validation stages to find the correct input sequence for the flag."
category: "picoCTF - Reverse Engineering"
tags: ["picoctf", "reverse-engineering"]
published: true
---
# Gatekeeper Reverse Engineering Writeup

## Challenge Summary

The binary `gatekeeper` asks for a numeric code and, on success, reveals the flag. The hint says the program output is not straightforward and suggests reversing the string and removing extra text.

The remote target provided for the live flag was:

`nc green-hill.picoctf.net 57942`

## Initial Recon

Basic inspection showed that the file is a 64-bit ELF and is not stripped, which makes reverse engineering easier.

Useful commands:

```bash
file gatekeeper
strings -n 4 gatekeeper
objdump -d -Mintel gatekeeper
objdump -s -j .rodata gatekeeper
```

Important strings recovered from the binary:

- `/flag.txt`
- `Access granted: `
- `ftc_oc_ip`
- `Enter a numeric code (must be > 999 ): `
- `Too small.`
- `Too high.`
- `Access Denied.`

Those strings already suggest the flow:

1. Read an input string.
2. Parse and validate it.
3. If accepted, read `/flag.txt`.
4. Print the flag in a mangled format.

## Main Logic

Disassembly of `main` shows the full gate condition.

The program:

1. Reads up to 31 characters using `scanf("%31s", ...)`.
2. Stores the input length with `strlen`.
3. Checks whether the whole string is decimal.
4. If not decimal, checks whether the whole string is hexadecimal.
5. Converts decimal with `atoi` or hex with `strtol(..., 16)`.
6. Rejects values `<= 999`.
7. Rejects values `> 9999`.
8. Requires the original input length to be exactly 3 characters.
9. Calls `reveal_flag()` only if all checks pass.

That means the accepted inputs are:

- exactly 3 characters long
- either all decimal digits or all hexadecimal characters
- numeric value between 1000 and 9999 inclusive

The simplest passing input is:

`3e8`

Why it works:

- it is 3 characters long
- it is valid hexadecimal
- `0x3e8 == 1000`
- `1000 > 999`
- `1000 <= 9999`

## Validation Functions

There are two helper functions:

- `is_valid_decimal`
- `is_valid_hex`

`is_valid_decimal` checks every character with the libc ctype table and requires each one to be a decimal digit.

`is_valid_hex` does the same but accepts any hexadecimal digit (`0-9`, `a-f`, `A-F`).

There is no prefix handling like `0x`; the string must be pure hex characters.

## Flag Output Routine

The `reveal_flag` function:

1. Opens `/flag.txt` in read mode.
2. Reads the entire file into memory.
3. Prints `Access granted: `.
4. Iterates backward through the file contents, printing one character at a time.
5. Every time the current reverse index is divisible by 4, it also prints the extra text `ftc_oc_ip`.

This means the displayed output is intentionally obfuscated:

- the flag is reversed
- junk text is inserted periodically

The hint matches this exactly: reverse the string and remove extra text.

## Remote Solve

Submitting the correct input:

```bash
nc green-hill.picoctf.net 57942
3e8
```

The service returned:

```text
Access granted: }1a9ftc_oc_ipb50aftc_oc_ip8_99ftc_oc_ip9_TGftc_oc_ip_xehftc_oc_ip_tigftc_oc_ipid_3ftc_oc_ip{FTCftc_oc_ipocipftc_oc_ip
```

## Decoding the Flag

First remove every `ftc_oc_ip` substring:

```text
}1a9b50a8_999_TG_xeh_tigid_3{FTCocip
```

Then reverse the remaining string:

```text
picoCTF{<redacted>}
```

## Final Answer

Input that grants access:

`3e8`

Recovered flag:

`picoCTF{<redacted>}`

## Short Takeaway

This challenge is a straightforward binary RE task:

- recover validation logic from `main`
- find the minimal passing input
- inspect the flag printing routine
- undo the output transformation

The only trick is that the flag is not printed directly. It is reversed and padded with repeated junk text, so you need to clean it before reading the final result.
