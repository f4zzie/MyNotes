---
title: "Wiretap — perfectRoot CTF Writeup"
description: "Category: Forensics / Network / Crypto"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Category:** Forensics / Network / Crypto
**Flag:** `r00t{thr33_pr0t0c0ls_1_pcap__dns_KEY_plus_icmp_IV_plus_http_AES_z1p_x0r}`

---

## TL;DR

A single 49-packet PCAP hides one secret split across **three protocols**:

| Protocol | Role | Value |
|----------|------|-------|
| **DNS** (`NN-XX.beacon.perfectroot.wiki`) | supplies **key material** | `51e3f43d85a993942885e38f7eff86e4` |
| **ICMP** (echo-request payload byte, ordered by `icmp.seq`) | supplies the **IV** | `23a695dbd42f14e735a5e54f9a132a5d` |
| **HTTP** (`payload.b64`) | supplies the **ciphertext** (96 bytes) | base64 body |

Decryption pipeline:

```
key = SHA-256(DNS_bytes)                       # 32-byte AES-256 key
plaintext_L1 = AES-256-CBC(ct, key, iv=ICMP)   # then strip PKCS7
plaintext_L2 = zlib.inflate(plaintext_L1)      # zlib stream (78 da ...)
flag         = plaintext_L2 XOR (DNS_bytes repeated)
```

The name of the challenge — *Wiretap* — plus the flag itself spell out the intended solution: **DNS = KEY, ICMP = IV, HTTP = AES ciphertext, then z1p + x0r**.

---

## 1. Recon

Extract and profile the capture:

```bash
unzip "Wiretap capture.zip" -d extracted
capinfos extracted/capture.pcap
tshark -r extracted/capture.pcap -q -z io,phs
```

49 packets, 6.5 ms of traffic, all between host `10.10.14.7` and a couple of destinations. Protocol hierarchy:

```
frame: 49
  eth / ip
    udp -> dns    frames:25
    icmp          frames:18
    tcp           frames:6
      http        frames:1
```

Three data-bearing channels — DNS, ICMP, and one HTTP transaction. In a challenge called *Wiretap*, the intended message is clearly spread across all three.

---

## 2. Channel 1 — DNS (the key)

```bash
tshark -r extracted/capture.pcap -Y dns -T fields -e dns.qry.name
```

```
00-51.beacon.perfectroot.wiki
01-e3.beacon.perfectroot.wiki
02-f4.beacon.perfectroot.wiki
03-3d.beacon.perfectroot.wiki
04-85.beacon.perfectroot.wiki
05-a9.beacon.perfectroot.wiki
06-93.beacon.perfectroot.wiki
07-94.beacon.perfectroot.wiki
08-28.beacon.perfectroot.wiki
09-85.beacon.perfectroot.wiki
10-e3.beacon.perfectroot.wiki
11-8f.beacon.perfectroot.wiki
12-7e.beacon.perfectroot.wiki
13-ff.beacon.perfectroot.wiki
14-86.beacon.perfectroot.wiki
15-e4.beacon.perfectroot.wiki
```

Classic DNS-exfiltration beaconing. Each label is `INDEX-BYTE` where:
- `INDEX` = `00`–`15` (decimal) — the ordering,
- `BYTE` = one hex byte of the payload.

Sorted by index and concatenated:

```
51 e3 f4 3d 85 a9 93 94 28 85 e3 8f 7e ff 86 e4
```

→ **`51e3f43d85a993942885e38f7eff86e4`** (16 bytes).

**Decoy noise** — several unrelated queries are mixed in to distract:
`discord.gg`, `fonts.googleapis.com`, `pool.ntp.org`, and `cdn0..5.perfectroot.wiki`. Only the `NN-XX.beacon` names carry data.

---

## 3. Channel 2 — ICMP (the IV)

```bash
tshark -r extracted/capture.pcap -Y "icmp.type==8" \
  -T fields -e icmp.seq -e icmp.ident -e data.data
```

The key detail: **order by `icmp.seq`, not by packet number** — the packets are deliberately shuffled in the capture. Each echo-request carries a single payload byte, sequenced `0`–`15`:

```
seq  byte
0    23
1    a6
2    95
3    db
4    d4
5    2f
6    14
7    e7
8    35
9    a5
10   e5
11   4f
12   9a
13   13
14   2a
15   5d
```

→ **`23a695dbd42f14e735a5e54f9a132a5d`** (16 bytes = one AES block = the IV).

**Decoys:** two packets with `icmp.ident=1` and `seq=100/101` carry the classic `abcdefgh...` Windows/`ping` filler payload. Ignore them — the real data packets share `ident=16962`.

---

## 4. Channel 3 — HTTP (the ciphertext)

```bash
tshark -r extracted/capture.pcap -Y http
# GET http://cdn.perfectroot.wiki/artifacts/payload.b64
```

The body is base64. **Gotcha:** the TCP segments are out of order, and the HTTP response body is split across two data packets (`Content-Length: 128`). Reassemble by TCP sequence number — the segment carrying the HTTP `200 OK` header (frame 26) comes first, then the continuation (frame 7):

```
I3MStGwU8x8M5fqJZ433ysRQUfNFkoVT5sq9tFd4tK+NGB8i3YgiHwgD+vt5QEVR   (frame 26, after headers)
0yLVdx88ppgshrxQx8avpIq6MDlcIwW7EiTL03WyGFZCuTeSqg9m57md3KVEnk7x   (frame 7)
```

Decoded → **96 bytes** of ciphertext:

```
237312b46c14f31f0ce5fa89678df7ca
c45051f345928553e6cabdb45778b4af
8d181f22dd88221f0803fafb79404551
d322d5771f3ca6982c86bc50c7c6afa4
8aba30395c2305bb1224cbd375b21856
42b93792aa0f66e7b99ddca5449e4ef1
```

96 bytes = 6 AES blocks — consistent with AES-CBC + PKCS7.

---

## 5. Putting it together

### 5.1 Finding the scheme

Raw DNS/ICMP bytes as an AES-128 key/IV produced only garbage in every ordering and mode. The winning move was a **padding-oracle sweep**: try many key derivations × IVs × modes and keep only results with valid PKCS7 padding.

The hit: **`key = SHA-256(DNS_bytes)`** (a 32-byte AES-**256** key) with **CBC** mode gave valid padding (`0x0d` × 13). Crucially, across every candidate IV the *tail* of the plaintext was identical and only block 0 changed — the textbook CBC signature that the key is correct and only the IV block is still wrong.

That constant tail began `78 da 01 48 00 ...` — **`78 da` is a zlib header** (best-compression). The correct IV is the one that also turns block 0 into a valid zlib stream: **`iv = ICMP_bytes`**.

### 5.2 The final layer

`zlib.decompress` succeeds and yields 72 bytes that still look random. The flag's own text (`...z1p_x0r`) hints at the last step: **XOR with the DNS key bytes**, repeated across the length. That produces printable ASCII — the flag.

### 5.3 Solve script

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import hashlib, zlib

dns  = bytes.fromhex("51e3f43d85a993942885e38f7eff86e4")   # DNS  -> KEY material
icmp = bytes.fromhex("23a695dbd42f14e735a5e54f9a132a5d")   # ICMP -> IV
ct = bytes.fromhex(
    "237312b46c14f31f0ce5fa89678df7ca"
    "c45051f345928553e6cabdb45778b4af"
    "8d181f22dd88221f0803fafb79404551"
    "d322d5771f3ca6982c86bc50c7c6afa4"
    "8aba30395c2305bb1224cbd375b21856"
    "42b93792aa0f66e7b99ddca5449e4ef1")

key   = hashlib.sha256(dns).digest()                       # AES-256 key
step1 = unpad(AES.new(key, AES.MODE_CBC, icmp).decrypt(ct), 16)
step2 = zlib.decompress(step1)                             # zlib inflate
ks    = (dns * ((len(step2)//16)+1))[:len(step2)]
flag  = bytes(a ^ b for a, b in zip(step2, ks)).decode()   # XOR with DNS bytes
print(flag)
# r00t{thr33_pr0t0c0ls_1_pcap__dns_KEY_plus_icmp_IV_plus_http_AES_z1p_x0r}
```

---

## 6. Flag

```
r00t{thr33_pr0t0c0ls_1_pcap__dns_KEY_plus_icmp_IV_plus_http_AES_z1p_x0r}
```

---

## 7. Lessons / gotchas

1. **Correlate across protocols.** No single channel holds the secret — DNS, ICMP, and HTTP each carry one piece (key / IV / ciphertext).
2. **Respect sequence fields, not packet order.** ICMP data had to be sorted by `icmp.seq`; the HTTP body had to be reassembled by TCP sequence (header segment before its continuation).
3. **Filter decoys.** `discord.gg`, `pool.ntp.org`, `cdn*` DNS names and the `abcdefgh` ICMP pings (ident=1, seq 100/101) are noise.
4. **Key material is often hashed.** Raw bytes failed; `SHA-256(dns)` as an AES-256 key was the unlock. A PKCS7 padding-oracle sweep found it quickly.
5. **Recognize magic bytes.** `78 da` = zlib stream; spotting it revealed the next layer.
6. **Read the flag for hints.** `dns_KEY_plus_icmp_IV_plus_http_AES_z1p_x0r` literally documents the full pipeline.
