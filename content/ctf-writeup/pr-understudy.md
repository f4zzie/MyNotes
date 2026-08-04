---
title: "UnderStudy — CORVID STUDIOS Incident — Writeup"
description: "Flag (reconstructed from evidence):"
category: "CTF Writeup"
tags: ["ctf", "writeup", "perfectroot"]
published: true
---
**Flag (reconstructed from evidence):**
```
r00t{svc_rendercache_Administrator_090217}
```
Format: `r00t{compromised_credential_impacted_account_true_start_time}`, time = hhmmss.

> Reconstructed purely from the exported logs. If the scoreboard rejects the exact
> string, the only defensible variant is casing on the account:
> `r00t{svc_rendercache_administrator_090217}`. There is **no** literal `true`/`false`
> token — "true start time" is a descriptor for the real start time.

---

## Evidence
Six exported event logs across CORVID.LOCAL (also provided as `dump_evtx.py` XML dumps):

| Host | Logs | Notable IDs |
|---|---|---|
| wks-wren07 | security, sysmon | 4624, 4769, 4698, 1102, sysmon 1/3 |
| srv-render02 | security, sysmon | 4624, sysmon 3 |
| dc01 | security | 4662, 4661 |
| wks-okafor03 | security | 4624 |

Raw `.evtx` record counts match the XML dumps exactly (e.g. dc01 = 15/15) — nothing hidden.

## The key discriminator: the `.884Z` marker
Every genuine attacker event carries fractional seconds **`.884Z`**; all benign noise and
decoy events end in **`.000`**. This cleanly separates the attack from background activity
across all six logs. (The collector `TimeCreated` is uniformly 2026-08-01 — the collection
run — so the embedded `EventTime`/`UtcTime` is the real event time.)

## Kill chain (all `.884Z`, IP-stitched 10.20.4.41 → 10.20.4.52)

| Time (UTC) | Host | Event | Meaning |
|---|---|---|---|
| **09:02:17** | wks-wren07 | Sysmon 1: `WINWORD.EXE` → `powershell -NoP -W Hidden -Enc` (user **wren.ashworth**), doc `CallSheet_ProductionSchedule_v3.docm` | **Initial access — true start** |
| 09:02:18 | wks-wren07 | Sysmon 3: powershell → 203.0.113.44:8080 | C2 beacon |
| 09:22:17 | wks-wren07 | Sysmon 1: `dsquery.exe user -limit 0` | Domain recon |
| 09:29:17 | wks-wren07 | Sysmon 1: `dsquery.exe group -limit 0` | Domain recon |
| 09:36:17 | wks-wren07 | Sysmon 1: `setspn.exe -Q */*` | Kerberoast SPN enumeration |
| **13:05:17** | wks-wren07 | 4769 `HTTP/rendercache-internal`, **enc=0x17 (RC4)**, ip=10.20.4.41 | **Kerberoast → svc_rendercache credential compromised** |
| 13:29 / 13:32 / 13:40 | wks-wren07 | 4769 backup-agent / MSSQLSvc / print-svc, **enc=0x12 (AES)** | Decoy TGS requests (AES = not the cracked one) |
| **15:13:17** | wks-wren07 / srv-render02 | 4624 **svc_rendercache** LogonType 9 (runas, 127.0.0.1) + LogonType 3 (WinRM from 10.20.4.41) | Lateral movement to render server |
| 15:13:15 | srv-render02 | Sysmon 3: svchost → 10.20.4.52:5985 (WinRM) | Pivot toward DC |
| **18:06:17** | dc01 | 4662 **svc_rendercache** on `CN=Administrator`, replication GUIDs `1131f6aa…`/`1131f6ad…`, ip=10.20.4.52 | **DCSync — Administrator impacted** |
| 18:26:17 | wks-wren07 | 1102 Security log cleared (svc_rendercache) | Anti-forensics ("suspiciously empty" log) |
| 18:29:17 | wks-wren07 | 4698 scheduled task `\RenderCacheSync` → `powershell … IEX(New-Object Net.WebClient)` | Persistence |

## The decoy
`t.okafor-adm` accessing `CN=svc_legacy00..03,OU=Disabled` (4661) wears the `.884Z` marker
but has **no IP linkage** to the real 10.20.4.41 → 10.20.4.52 chain. It is disabled-account
"cleanup" bait, themed to mislead (the challenge name *UnderStudy* / legacy accounts). The
4662 events on `CN=<staff>,OU=Staff` (`.000`) are ordinary directory reads — also noise.

## The three report facts
1. **compromised_credential = `svc_rendercache`** — the Kerberoasted service account. The tell
   is the lone **RC4 (0x17)** service ticket for `HTTP/rendercache-internal` sitting among
   AES (0x12) decoys; RC4 is the crackable one, and the successful 15:13 logon *as*
   svc_rendercache confirms the crack.
2. **impacted_account = `Administrator`** — the DCSync at 18:06 reads `CN=Administrator` with
   the directory-replication control access rights (`DS-Replication-Get-Changes` /
   `…-All`), dumping its secrets. That is the climax the report must name.
3. **true start time = `090217`** — the macro→PowerShell initial access at 09:02:17, the real
   incident start, versus the *apparent* start (render pipeline failing / "flaky render
   server" from ~15:13). `wren.ashworth` is patient-zero and is represented by this timestamp,
   not by a separate slot.

**→ `r00t{svc_rendercache_Administrator_090217}`**
