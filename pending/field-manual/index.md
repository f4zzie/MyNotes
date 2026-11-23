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

A working manual for the Hack The Box **Certified Penetration Testing Specialist (CPTS)** path, its exam, and internal network pentesting in general. It follows the five-phase methodology used by [Bruno Rocha Moura](https://www.brunorochamoura.com/posts/cpts-tips/) in his own CPTS field manual, plus a procedures and toolkit section.

> [!info] Status
> This is a living manual, not a finished book. Technique pages combine **quick-reference commands**, **ordered workflows**, and the **underlying mechanics**; overview and procedure pages provide navigation and handoffs. Gaps are marked `TODO`.
>
> These notes are published on this site. They are an original study synthesis — summaries, checklists, and command references — written around the HTB CPTS path. Hack The Box course material itself remains the property of Hack The Box and is subject to its terms; check those terms before redistributing.

## The idea

A field manual is not a copy of the course cheatsheets. It is a **hierarchical, searchable document** that answers three questions in seconds:

1. What do I do next in this scenario?
2. What have I already tried?
3. Why does this technique work?

During the exam, you should not need to juggle browser tabs to remember a command option. Search the published manual at [/notes/](/notes/); in the local vault, use your editor's filename navigation or full-content search.

### Search the published manual

- [/notes/](/notes/) contains the 52 manual pages; [/writeups/](/writeups/) contains 85 separate published notes. A manual search never adds Writeups results, and existing detail-page URLs are preserved.
- Search **titles, headings, explanations, command options, and body text**, not just descriptions. Multiple words match together: [`Kerberos DCOnly`](/notes/?q=Kerberos%20DCOnly) can match terms in different parts of a page.
- Use quotes for a phrase, such as [`"Kerberos double-hop"`](/notes/?q=%22Kerberos%20double-hop%22), or a pipe for alternatives: [`RBCD | msDS-KeyCredentialLink`](/notes/?q=RBCD%20%7C%20msDS-KeyCredentialLink).
- Category and exact-tag filters combine with the query. [`?q=replication&tag=active-directory`](/notes/?q=replication&tag=active-directory) is a shareable filtered search, not a separate copy of the AD pages.
- Title matches rank above body-only matches. **Reset search and filters** restores the listing; browser Back/Forward restores recorded filter states. If the full-text index cannot load, the page identifies its metadata-only fallback and offers **Retry search**.
- On a detail page, browser Find (`Ctrl+F`) locates the term in that page. Local-vault shortcuts do not search all published pages in a browser.

The author's manual at exam time: **376 nodes, 114,331 words**, organised into five phases plus a NetExec category. Each note is split into a cheatsheet table and a deeper information section.

![[field-manual-structure.png|The full field manual hierarchy published by Bruno Rocha Moura]]

Figure source: [Bruno Rocha Moura — CPTS Tips & Tricks](https://www.brunorochamoura.com/posts/cpts-tips/).

The original hierarchy is also available as a single reference image:

![[cpts-field-manual-tree.png|Top-level field manual tree]]

Figure source: [Bruno Rocha Moura — CPTS Tips & Tricks](https://www.brunorochamoura.com/posts/cpts-tips/).

## How each note is built

| Section | Purpose |
|---|---|
| Frontmatter | Title, category, tags, publication status |
| Cheatsheet | Copy-paste commands, ports, paths, payloads |
| Methodology | Ordered checklist: what to check, in what order |
| How it works | Why the technique exists and what makes it exploitable |
| Pitfalls | Common exam roadblocks and false negatives |
| References | Course module, docs, articles |

Example from Bruno Rocha Moura's public CPTS article: the SMTP note keeps a command table on top and protocol explanation below.

![[cpts-smtp-note-example.png|SMTP note with a cheatsheet table above the explanatory section]]

Figure source: [Bruno Rocha Moura — CPTS Tips & Tricks](https://www.brunorochamoura.com/posts/cpts-tips/).

A methodology can be tiny — the Drupal methodology shown by the author is a handful of checkboxes:

![[cpts-drupal-methodology.png|Drupal methodology example: version fingerprinting, known CVEs, admin shell, brute force]]

Figure source: [Bruno Rocha Moura — CPTS Tips & Tricks](https://www.brunorochamoura.com/posts/cpts-tips/).

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

- [buduboti — CPTS-Walkthrough](https://github.com/buduboti/CPTS-Walkthrough) — reviewed public snapshot `449d46a`; source-guided comparisons for AD, service/web exploitation, password material, file transfer, and pivoting.
- [Cavementech — Pentesting Quick Reference](https://notes.cavementech.com/) — AD collection, credential and ACL/trust paths, SQL request context, password strategy, and tunnel limitations.
- [0x1ceKing — CPTS notes](https://github.com/0x1ceKing/HTB-Certified-Penetration-Testing-Specialist) — the earlier command-family and module-coverage reference.
- [HTB CPTS Tips & Tricks — Bruno Rocha Moura](https://www.brunorochamoura.com/posts/cpts-tips/)
- [HTB CPTS Reporting: The Easy Way](https://www.brunorochamoura.com/posts/cpts-report/)
- [Road to HTB CPTS](https://www.brunorochamoura.com/posts/road-to-cpts/)
- [My HTB CPTS Experience](https://www.brunorochamoura.com/posts/cpts-experience/)
- [HTB Academy — Penetration Tester path](https://academy.hackthebox.com/path/preview/penetration-tester)
- [HackTricks](https://book.hacktricks.wiki/) and [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) for technique-level detail.

> [!warning] Attribution
> The structure and study philosophy come from Bruno Rocha Moura's public write-up. Technique pages cite the public notes and upstream documentation used for comparison. Workflows are independently written, parameterised, and validated against tool/runtime prerequisites; historical walkthrough output is not proof that a current deployment is vulnerable. Course text, exercise answers, flags, and recovered/source credentials are not reproduced. Keep assessment credentials, artifacts, screenshots, and transcripts in private evidence storage, not this publication repository.

### Where the source comparisons land

| Topic | Existing manual pages and practical handoff |
|---|---|
| AD discovery and authentication context | [[pending/field-manual/01-information-gathering/active-directory-enumeration\|AD enumeration]] — DNS/time/identity, anonymous versus authenticated queries, CE/legacy collector choice, policy, ACL/CA/trust inventory, and double-hop diagnosis |
| AD credential material | [[pending/field-manual/03-exploitation/active-directory-credential-attacks\|AD credential attacks]] — targeted roasting/replication, policy-aware spraying, GPP, tickets/keys, and independent credential proofs |
| ACLs, delegation, and trusts | [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl\|Delegation, ACLs, and trusts]] — effective object rights, controlled deltas, RBCD, GPO/LAPS/gMSA, accepted trust direction, and precise restoration |
| Certificate paths | [[pending/field-manual/03-exploitation/adcs-exploitation\|AD CS]] — enrolment and mapping prerequisites, ESC1–ESC8 distinctions, current Certipy restoration, live relay, PKINIT, and certificate/private-key handling |
| Host and network transitions | [[pending/field-manual/05-lateral-movement/windows-lateral-movement\|Windows]], [[pending/field-manual/05-lateral-movement/linux-lateral-movement\|Linux]], and [[pending/field-manual/05-lateral-movement/pivoting-and-tunneling\|Pivoting]] — service rights, ticket/SPN context, SSH agent proof, direction/DNS/transport, and cleanup |
| Network, service, and web inputs | [[pending/field-manual/01-information-gathering/service-enumeration/tools\|Enumeration tools]], [[pending/field-manual/03-exploitation/service-exploitation\|Service exploitation]], and [[pending/field-manual/03-exploitation/web-exploitation\|Web exploitation]] — saved scan evidence, selected service operations, actual request/parser context, and response controls |
| Passwords and private evidence | [[pending/field-manual/02-pre-exploitation/password-wordlists\|Wordlists]], [[pending/field-manual/04-post-exploitation/hash-cracking\|Hash recovery]], [[pending/field-manual/04-post-exploitation/windows-credential-dumping\|Windows stores]], and [[pending/field-manual/04-post-exploitation/file-transfer\|Transfer]] — candidate cost, format provenance, matched artifacts, receiver pairing, integrity, and retention |
| End-to-end execution | [[pending/field-manual/06-procedures/active-directory-compromise\|AD compromise procedure]] and [[pending/field-manual/07-toolkit/index\|Toolkit]] — choose one path, record each privilege/reachability transition, and hand verified evidence to reporting |
