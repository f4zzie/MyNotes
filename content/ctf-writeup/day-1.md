---
title: "DAY 1"
description: "CyberStudents Day 1 challenge covering binary to ASCII, hex decoding, and Base64 encoding and decoding transformations to recover hidden flags."
category: "CTF Writeup"
tags: ["ctf", "writeup"]
published: true
---
Here is the challenge description:
![Image](/images/Pasted_image_20251221225724.png)

Output of the start.txt is as follows:
![Image](/images/Pasted_image_20251221225858.png)

## 🔹 Step 1: Binary → ASCII

Each group of **8 bits** represents **one ASCII character**.

Example:

`00110101 → 53 (decimal) → '5' 00111001 → 57 → '9' 00110011 → 51 → '3'`

Doing this for the entire sequence converts the binary into a readable ASCII string:

`59334e6b6531637a624747774e664f474644533138334d4639685a48597a546a64664d6a41794e583033d`

So after Step 1, we have a **hex-looking string** (characters 0–9 and a–f).

## 🔹 Step 2: ASCII → Hex decoding
That ASCII output is actually **hexadecimal**.

Hex pairs represent bytes:

`59 → 'Y' 33 → '3' 4e → 'N' 6b → 'k' 65 → 'e' 31 → '1' 63 → 'c' 7a → 'z' ...`

Decoding the entire hex string gives:

`Y3NkezVlbGNvbWVfOGFDS180MF9hZHYzTjdfejAyNX0=`

Now this clearly ends with `=` — a big hint 👀  
That means…
## 🔹 Step 3: Base64 decoding

The string is **Base64-encoded**.

Decoding it produces:

`csd{W3lc0m3_8aCK_70_adv3N7_2025}`