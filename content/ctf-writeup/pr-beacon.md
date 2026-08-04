---
title: "Beacon (Hybrid-01) — Progress Writeup"
description: "Status: Pipeline fully reverse-engineered; final key fragments not yet confirmed against the SHA3 oracle. Flag not yet recovered."
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Status:** Pipeline fully reverse-engineered; final key fragments not yet confirmed against the SHA3 oracle. Flag not yet recovered.

## Archive contents
Unzipping `Hybrid-01-beacon.zip` yields:
- `guardian.py` — the validator / reference unseal pipeline.
- `mwenge.png` — 256×160 RGB gradient image, carries hidden fragments.
- `cecafa_2002.csv` — 12 football matches (CECAFA 2002).
- `ram.bin` — 4096 bytes of **decoys**.

## The guardian pipeline (from `guardian.py`)
The sealed flag (`BLOB`) is unwrapped as:

```
raw = base64decode( rot47(BLOB)[::-1] )
pt  = AES-CBC-decrypt(raw, key, iv)
pt  = strip_PKCS7(pt)
pt  = zlib.decompress(pt)
flag = pt XOR frag   # frag repeated
```

Key derivation:
```
aes_key = sha256(frag + b"|" + frag2 + b"|" + cap + b"|" + tally).digest()[:32]
iv      = sha256(tally).digest()[:16]
```
where `frag` (8 bytes) and `frag2` (8 bytes) are hidden in `mwenge.png`,
`cap` (5 bytes) comes from `mwenge.png`, and `tally` (2 bytes) from `cecafa_2002.csv`.

Validation target: `FLAG_SHA3 = 19f410ef1319a2a8299aac9b20ba9b79103baba16ab1b5dc4ed5e8b65e5c6f3b`.

## Decoys ruled out
- `ram.bin` base64 → `r00t{B3nj4m1n_Mkap4_Stad1um_2002_CECAFA}` — **fails** SHA3.
- `guardian.py` `_hint` rot13 → `r00t{the_torch_was_lit_in_1961}` — **fails** (explicitly a trap).
- `ram.bin` also contains `TXOR_KEY=MWENGE`, `xTK=MQ` — misdirection.

## Steganography analysis (mwenge.png)
The image is an exact algebraic gradient:
```
R = (2x) % 256 ,  G = (3y) % 256 ,  B = (x+y) % 256
```
Hidden data = **deviations** from this formula (±1 = LSB flips). Only four rows deviate:

| Channel | Rows | Encoding found |
|---|---|---|
| R | 50, 51 | grid sample **step 5, offset 0**, MSB-first → `UHURU_` (row 50); row 51 sparse |
| B | 100, 101 | anomalies at cols ≡0 mod 7 (row 100) and ≡3 mod 7 (row 101) |

- Row 50, R-LSB, step 5 offset 0, MSB-first decodes **cleanly** to ASCII `UHURU_` (52 sampled bits → 6 bytes `55 48 55 52 55 5F`). This is solid — thematically "Uhuru Torch".
- The remaining 2 bytes of `frag` (to reach 8) come from row 51 and are **not yet cleanly recovered** (row 51 has only 3 anomaly columns: 34, 39, 54 → all ≡4 mod 5).
- `frag2` (B channel, rows 100/101) does **not** yield clean ASCII under the grid method — extraction rule still unconfirmed.

## Candidate values (unconfirmed)
- `frag`  ≈ `UHURU_??`  (confirmed prefix `UHURU_`)
- `frag2` ≈ ? (B-channel; `MWENGE`-themed suspected but unverified)
- `cap`   ∈ {`60000` (tEXt Capacity), `13000` (tEXt Attendance)}
- `tally` ∈ {`21` (goal sum), `12` (match count)}

A 2-byte `tally` brute × several `cap`/`frag` candidates did **not** hit the SHA3 target,
so at least one of `frag`/`frag2`/`cap` bytes is still wrong.

## Next steps to finish
1. Nail the exact bit-extraction rule for row 51 (finishing `frag`) and rows 100/101 (`frag2`) — the step/offset must be read from the anomaly column arithmetic (row 51: step 5 offset 4; B rows: step 7).
2. Re-run `unseal()` with corrected fragments across `cap`∈{60000,13000}, `tally`∈{21,12} (or full 2-byte space).
3. Confirm `sha3_256(flag) == FLAG_SHA3`, then finalize `solve.py`.
