# Safaricom CTF (safctf) — Beginner Writeups

Beginner-friendly, step-by-step writeups for the challenges we solved. Each follows the same
10-section format (Overview → What You Need → Recon → Identify the Vuln → Exploit →
Capture the Flag → Why It Works → Common Mistakes → How to Defend → Key Takeaways). Tooling
favors **curl / browser DevTools / Burp / standard CLI**; where a solver script is genuinely
needed it's kept optional at the end under *"Advanced Alternative."*

| Pts | Challenge | Category | Core technique | Writeup |
|----:|-----------|----------|----------------|---------|
| 150 | Pixel Courier | Reversing | ELF crackme: recover password, XOR-decode flag | [pixel-courier-writeup.md](pixel-courier-writeup.md) |
| 200 | Night Bus | Web / IDOR | Hidden order; object id = `sha256(reference)[:24]` | [night-bus-writeup.md](night-bus-writeup.md) |
| 250 | Second Pressing | Forensics | SQLite WAL holds overwritten (base64+zlib) flag | [second-pressing-writeup.md](second-pressing-writeup.md) |
| 300 | Captain Orders | AI / Prompt Injection | Base64-encode bypass of a keyword guardrail | [captain-orders-writeup.md](captain-orders-writeup.md) |
| 300 | Fancy Details | Forensics / Stego | EXIF ROT13 → `password`; openssl PBKDF2 iter=100000 | [fancy-details-writeup.md](fancy-details-writeup.md) |
| 300 | Harbor Lights | Web / Access Control | Path-traversal past a `public/` prefix check | [harbor-lights-writeup.md](harbor-lights-writeup.md) |
| 350 | Stageworks | Web / Access Control | AssumeRole: leaked ExternalId + session tag | [stageworks-writeup.md](stageworks-writeup.md) |
| 450 | Prism Orchestra | Reversing | Bytecode VM; invert ops to recover password | [prism-orchestra-writeup.md](prism-orchestra-writeup.md) |
| 550 | Blue Meridian | Web / Correlation | Triangulate the voyage → `SHA256(ref\|station\|HH:MMZ)` | [blue-meridian-writeup.md](blue-meridian-writeup.md) |

**Total: 9 solved, 2550 points.**

## Flags

```
Pixel Courier     safctf{e7802274-4b04-488a-9319-39ca86e83c9f}
Night Bus         safctf{81a90dc817371a5aa190e8069ebcde2c}
Second Pressing   safctf{12bbc51d-7450-44c6-af3f-1723514b8aad}
Captain Orders    safctf{4d19e2980e16abb93f0ff0481e4729e1}
Fancy Details     safctf{245ccf0110f6422d41671064cee8da68}
Harbor Lights     safctf{0a7fe9c5e49d7fbe62cea634195d0adf}
Stageworks        safctf{b9d2678027feea5870c41931b663fd6d}
Prism Orchestra   safctf{406279bd-3201-499f-9a4a-f14e8918eb37}
Blue Meridian     safctf{756f7d81426571a6d6dac9b1aae5f271}
```

## Still open (not solved here)

- **Citrus Proof** (`:8320`) — JWT role escalation; signature uses a strong secret, `alg:none`
  and other forgeries rejected. No hidden route found. Unsolved.
- **Quick Recovery** (`:8010`) — enumeration stalled before completion.

> Targets were event-local (`54.72.82.22:<port>`) and are likely offline after the CTF.

---

## Numbered beginner series (this set)

These 12 writeups follow the exact 10-section beginner format (Overview → What You
Need → Recon → Identify the Vuln → Exploit → Capture the Flag → Why It Works →
Common Mistakes → How to Defend → Key Takeaways). Tooling favors **curl / browser
DevTools / Burp / standard CLI**; the rare solver script is kept short and explained
line by line, with a fuller version under an optional *Advanced Alternative* heading.

| Pts | Challenge | Category | Core technique | Writeup |
|----:|-----------|----------|----------------|---------|
| 200 | Know Your Limits | Web | SQL injection login bypass (`admin'--`) | [01-know-your-limits.md](01-know-your-limits.md) |
| 250 | Head Office | Web / Access Control | Spoofed `X-Real-IP: 127.0.0.1` header | [02-head-office.md](02-head-office.md) |
| 250 | Archived | Web | XXE file read (`/fetch_user`) | [03-archived.md](03-archived.md) |
| 300 | Second Look | Web / RCE | SSTI via `message` parameter | [04-second-look.md](04-second-look.md) |
| 300 | Secret Vault | Web | SQLi + decrypting with a weak Base64 key | [05-secret-vault.md](05-secret-vault.md) |
| 300 | Upload Your Art | Web | Unrestricted PHP upload → webshell | [06-upload-your-art.md](06-upload-your-art.md) |
| 350 | Ginger Juice Shop | Web / RCE | SSTI with a WAF-bypass payload | [07-ginger-juice-shop.md](07-ginger-juice-shop.md) |
| 450 | Tomcat Path Traversal | Web | Path traversal → leaked Basic creds → `/admin` | [08-tomcat-path-traversal.md](08-tomcat-path-traversal.md) |
| 150 | Comeback Pocket | Forensics / Crypto | Android backup + PBKDF2/AES-GCM | [09-comeback-pocket.md](09-comeback-pocket.md) |
| 200 | Northern Lights | Forensics / Crypto | iOS backup + PBKDF2/AES-GCM | [10-northern-lights.md](10-northern-lights.md) |
| 300 | Three Encores | Crypto | Håstad broadcast attack (`e=3`, reused `c`) | [11-three-encores.md](11-three-encores.md) |
| 350 | Parallel Lines | Crypto | Keystream reuse + byte permutation | [12-parallel-lines.md](12-parallel-lines.md) |

**Total: 12 solved — 3400 points.**

### Flags

```
Know Your Limits        safctf{30f33ad5be8abc02f034b5b266ff6b81}
Head Office             safctf{e657eef1b0b097c60911f62cfe4ec61b}
Archived                safctf{960c0e8a73c24bd9b1aee314ded96157}
Second Look             safctf{ac4c0d4a503d4ef281530c5ca9dc8fa4}
Secret Vault            safctf{7877e854c9f06a8362af26ee280a6574}
Upload Your Art         safctf{059507cb1ce1b9fa4dbf4ad6cfb83a4a}
Ginger Juice Shop       safctf{42dd8c3f359acdfc9b4250f4864ffc35}
Tomcat Path Traversal   safctf{e9e46fabe7b282f4eb4eff39b378eff3}
Comeback Pocket         safctf{408e83b586354238e5a8e968a74b8b64}
Northern Lights         safctf{3fd96340be891c629f7e3f3a42202743}
Three Encores           safctf{0471ad15e84bb9f630e394e49dde85a9}
Parallel Lines          safctf{8d6447b3f694f59efef1f015f58d04a7}
```

(For Comeback Pocket, Northern Lights, Three Encores, and Parallel Lines the value you
recover offline is an *internal answer*; the value above is what `POST /submit`
returns. See each writeup's Section 6.)
