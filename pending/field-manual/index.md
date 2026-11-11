---
title: "Field Manual — CPTS & Internal Pentesting"
description: "A working field manual for the HTB CPTS path and exam: structures, checklists, commands, and the methodology behind them."
category: "Field Manual"
tags: ["field-manual", "cpts", "pentesting", "methodology"]
date: 2026-11-11
published: true
status: archive
---

# Field Manual — CPTS & Internal Pentesting

A working manual for the Hack The Box **Certified Penetration Tester Specialist (CPTS)** path, its exam, and internal network pentesting in general. It follows the five-phase methodology used by [Bruno Rocha Moura](https://www.brunorochamoura.com/posts/cpts-tips/) in his own CPTS field manual, plus a procedures and toolkit section.

> [!info] Status
> This is a living vault, not a finished book. Every page has a **cheatsheet at the top** and an **explanation below**, so it is usable under exam pressure and still teaches the underlying mechanic. Gaps are marked `TODO`.
>
> These notes are published on this site. They are an original study synthesis — summaries, checklists, and command references — written around the HTB CPTS path. Hack The Box course material itself remains the property of Hack The Box and is subject to its terms; check those terms before redistributing.

## The idea

A field manual is not a copy of the course cheatsheets. It is a **hierarchical, searchable document** that answers three questions in seconds:

1. What do I do next in this scenario?
2. What have I already tried?
3. Why does this technique work?

During the exam, you should never be juggling browser tabs to remember one flag. `Ctrl+T` on a note name, or `Ctrl+Shift+F` inside note contents, should land you on the answer.

The author's manual at exam time: **376 nodes, 114,331 words**, organised into five phases plus a NetExec category. Each note is split into a cheatsheet table and a deeper information section.

![[field-manual-structure.png|The full field manual hierarchy published by Bruno Rocha Moura]]

The original hierarchy is also available as a single reference image: ![[cpts-field-manual-tree.png|Top-level field manual tree]]

## How each note is built

| Section | Purpose |
|---|---|
| Frontmatter | Title, category, tags, publication status |
| Cheatsheet | Copy-paste commands, ports, paths, payloads |
| Methodology | Ordered checklist: what to check, in what order |
| How it works | Why the technique exists and what makes it exploitable |
| Pitfalls | Common exam roadblocks and false negatives |
| References | Course module, docs, articles |

Example from the source manual: the SMTP note keeps a command table on top and protocol explanation below.

![[cpts-smtp-note-example.png|SMTP note with a cheatsheet table above the explanatory section]]

A methodology can be tiny — the Drupal methodology shown by the author is a handful of checkboxes:

![[cpts-drupal-methodology.png|Drupal methodology example: version fingerprinting, known CVEs, admin shell, brute force]]

## Navigation

### 0. Start here

- [[pending/field-manual/cpts-exam-playbook|CPTS exam playbook]] — preparation, AEN, exam strategy, time and flags.
- [[pending/field-manual/cpts-report-playbook|CPTS report playbook]] — trigger-based reporting with SysReptor.
- [[pending/field-manual/progress-tracker|Progress tracker]] — module and technique coverage.

### 1. Information Gathering

- [[pending/field-manual/01-information-gathering/index|Phase overview]]
- [[pending/field-manual/01-information-gathering/active-directory-enumeration|Active Directory enumeration]]
- [[pending/field-manual/01-information-gathering/infrastructure-enumeration|Infrastructure enumeration & OSINT]]
- [[pending/field-manual/01-information-gathering/reverse-engineering-javascript|JavaScript deobfuscation]]
- [[pending/field-manual/01-information-gathering/service-enumeration/index|Service enumeration]]
  - [[pending/field-manual/01-information-gathering/service-enumeration/remote-access|FTP, SSH, RDP, WinRM]]
  - [[pending/field-manual/01-information-gathering/service-enumeration/mail-and-dns|SMTP, POP3, IMAP, DNS, Kerberos, TFTP, Finger]]
  - [[pending/field-manual/01-information-gathering/service-enumeration/smb-and-nfs|SMB, RPC, NFS]]
  - [[pending/field-manual/01-information-gathering/service-enumeration/network-management|SNMP, LDAP, IPMI, Rsync]]
  - [[pending/field-manual/01-information-gathering/service-enumeration/databases|MSSQL, Oracle TNS, MySQL]]
  - [[pending/field-manual/01-information-gathering/service-enumeration/tools|Nmap, tcpdump, creds, Windows LOTL]]
- [[pending/field-manual/01-information-gathering/web-enumeration|Web enumeration]]
- [[pending/field-manual/01-information-gathering/web-app-enumeration|Common web applications]]
- [[pending/field-manual/01-information-gathering/wifi-enumeration|Wi-Fi enumeration]]

### 2. Pre-Exploitation

- [[pending/field-manual/02-pre-exploitation/index|Phase overview]]
- [[pending/field-manual/02-pre-exploitation/shells|Shells and shell escapes]]
- [[pending/field-manual/02-pre-exploitation/exploitation-tooling|MSF, MSFVenom, Searchsploit, Shellter]]
- [[pending/field-manual/02-pre-exploitation/password-wordlists|Password & wordlist generation]]

### 3. Exploitation

- [[pending/field-manual/03-exploitation/index|Phase overview]]
- [[pending/field-manual/03-exploitation/active-directory-credential-attacks|AD credential attacks]]
- [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl|AD delegation, ACLs, trusts]]
- [[pending/field-manual/03-exploitation/adcs-exploitation|AD CS exploitation]]
- [[pending/field-manual/03-exploitation/client-side-initial-access|Client-side initial access]]
- [[pending/field-manual/03-exploitation/service-exploitation|Service exploitation]]
- [[pending/field-manual/03-exploitation/web-exploitation|Web exploitation]]
- [[pending/field-manual/03-exploitation/wifi-exploitation|Wi-Fi exploitation]]
- [[pending/field-manual/03-exploitation/kiosk-breakout|Kiosk breakout]]

### 4. Post-Exploitation

- [[pending/field-manual/04-post-exploitation/index|Phase overview]]
- [[pending/field-manual/04-post-exploitation/linux-enumeration|Linux enumeration]]
- [[pending/field-manual/04-post-exploitation/linux-privilege-escalation|Linux privilege escalation]]
- [[pending/field-manual/04-post-exploitation/windows-enumeration|Windows enumeration]]
- [[pending/field-manual/04-post-exploitation/windows-privilege-escalation|Windows privilege escalation]]
- [[pending/field-manual/04-post-exploitation/windows-credential-dumping|Windows credential dumping]]
- [[pending/field-manual/04-post-exploitation/windows-evasion|Windows evasion]]
- [[pending/field-manual/04-post-exploitation/file-transfer|File transfer]]
- [[pending/field-manual/04-post-exploitation/hash-cracking|Hashcat & John]]

### 5. Lateral Movement

- [[pending/field-manual/05-lateral-movement/index|Phase overview]]
- [[pending/field-manual/05-lateral-movement/windows-lateral-movement|Windows lateral movement]]
- [[pending/field-manual/05-lateral-movement/linux-lateral-movement|Linux lateral movement]]
- [[pending/field-manual/05-lateral-movement/pivoting-and-tunneling|Pivoting and tunneling]]

### 6. Procedures

- [[pending/field-manual/06-procedures/index|Procedure index]]
- [[pending/field-manual/06-procedures/active-directory-compromise|Active Directory compromise]]
- [[pending/field-manual/06-procedures/linux-enum-privesc-procedure|Linux enum → privesc]]
- [[pending/field-manual/06-procedures/windows-enum-privesc-procedure|Windows enum → privesc]]
- [[pending/field-manual/06-procedures/web-pentest-procedure|Web pentest]]

### 7. Toolkit

- [[pending/field-manual/07-toolkit/index|Toolkit overview]]
- [[pending/field-manual/07-toolkit/netexec|NetExec]]
- [[pending/field-manual/07-toolkit/poc-snippets|PoC snippets]]

## The five phases

| Phase | Question it answers | Typical output |
|---|---|---|
| Information Gathering | What is exposed, and what is it running? | Ports, versions, vhosts, users, shares, technologies |
| Pre-Exploitation | How will I get code execution? | Payload, listener, staged exploit, wordlist |
| Exploitation | What can I break, and how? | Foothold, credentials, flags |
| Post-Exploitation | What does this host give me? | Local privilege, secrets, sessions, trust |
| Lateral Movement | Where can I go next? | New hosts, domains, pivots |

## Rules of engagement

- Only test systems you are explicitly authorised to test (HTB labs, your own infrastructure, signed scopes).
- Record the **exact command and output** that produced a finding; screenshots alone are not reproducible.
- Prefer the least destructive technique that answers the question.
- Clean up files, users, services, and scheduled tasks you create; log them for the report.
- Do not touch real-world third parties, public IPs, or data outside scope.

## Sources

- [HTB CPTS Tips & Tricks — Bruno Rocha Moura](https://www.brunorochamoura.com/posts/cpts-tips/)
- [HTB CPTS Reporting: The Easy Way](https://www.brunorochamoura.com/posts/cpts-report/)
- [Road to HTB CPTS](https://www.brunorochamoura.com/posts/road-to-cpts/)
- [My HTB CPTS Experience](https://www.brunorochamoura.com/posts/cpts-experience/)
- [HTB Academy — Penetration Tester path](https://academy.hackthebox.com/path/preview/penetration-tester)
- [HackTricks](https://book.hacktricks.wiki/) and [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) for technique-level detail.

> [!warning] Attribution
> The structure and study philosophy come from Bruno Rocha Moura's public write-up. Commands and explanations here are a working synthesis from public documentation and are meant for authorised labs only.