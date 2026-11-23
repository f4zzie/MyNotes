---
title: "Toolkit"
description: "Quick-reference tooling: NetExec, PoC snippets, and the commands used most often during a CPTS-style engagement."
category: "Field Manual"
tags: ["field-manual", "cpts", "toolkit", "netexec"]
date: 2026-11-11
published: true
status: archive
---

# Toolkit

- [[pending/field-manual/07-toolkit/netexec|NetExec cheat sheet]]
- [[pending/field-manual/07-toolkit/poc-snippets|PoC snippets]]

## Tool map

| Phase | Tools |
|---|---|
| Recon | nmap, masscan, rustscan, whatweb, ffuf, feroxbuster, gobuster, subfinder, dnsx |
| AD | NetExec, BloodHound, Impacket, Certipy, Rubeus, PowerView, bloodyAD |
| Web | Burp Suite, ffuf, sqlmap, nuclei, wpscan, joomscan, droopescan |
| Credentials | Responder, ntlmrelayx, hashcat, John, secretsdump, Mimikatz |
| Windows | winPEAS, Seatbelt, PowerUp, SharpUp, Rubeus, PrintSpoofer |
| Linux | LinPEAS, pspy, GTFOBins, linux-exploit-suggester |
| Pivot | chisel, ligolo-ng, sshuttle, socat, proxychains |
| Transfer | impacket-smbserver, Python HTTP server, certutil, curl |
| Report | SysReptor, screenshots, DPAT |

## Wordlists

```bash
/usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
/usr/share/seclists/Discovery/Web-Content/raft-medium-files.txt
/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
/usr/share/seclists/Usernames/xato-net-10-million-usernames.txt
/usr/share/wordlists/rockyou.txt
```

## Aliases

```bash
alias nxc='netexec'
alias ll='ls -lah'
alias www='python3 -m http.server 8000'
alias listen='rlwrap nc -lvnp 4444'
```

## Notes

- Stage reviewed, compatible releases and record their versions (`nxc --version`, `certipy -v`, collector help/version). Avoid changing an assessment's runtime or updating target packages in the middle of a reproducible test.
- Verify tool output manually; scanners produce false positives.
- Prefer the tool already installed on the target to avoid transfers.
- Record versions in the report when a tool behaviour matters.

## Learning path / module index

The historical [0x1ceKing CPTS README](https://github.com/0x1ceKing/HTB-Certified-Penetration-Testing-Specialist) groups 10 module entries and 27 cheatsheet/topic entries. Those counts describe that public repository, **not the current Academy syllabus or this manual's coverage**. Use the source indexes for orientation, then apply the existing technique pages and [[pending/field-manual/06-procedures/index#Penetration testing process|penetration testing process]] rather than creating duplicate module pages.

### Modules

| Order | Module | Working checkpoint |
|---|---|---|
| 1 | Penetration Testing Process | Define the engagement stages, scope, evidence, and deliverables. |
| 2 | Getting Started | Establish the workstation, connectivity, enumeration, shell, and transfer basics. |
| 3 | [Network Enumeration with Nmap](https://academy.hackthebox.com/module/details/19) | Identify hosts, ports, services, versions, and useful script results. |
| 4 | Footprinting | Build service-specific and infrastructure context. |
| 5 | Information Gathering - Web Edition | Map domains, web assets, technologies, and exposed functionality. |
| 6 | Vulnerability Assessment | Configure Nessus/OpenVAS, validate results, and export usable evidence. |
| 7 | [File Transfers](https://academy.hackthebox.com/module/details/24) | Move files between the attack host and target and check transfer integrity. |
| 8 | Shells & Payloads | Select a usable shell and understand connection direction and payload requirements. |
| 9 | Using the Metasploit Framework | Select modules, configure options, validate conditions, and manage sessions. |
| 10 | Password Attacks | Evaluate credentials and recover supported password/hash material. |

### Cheatsheets and follow-on topics

| Order | Earlier README topic | Practice focus |
|---|---|---|
| 1 | Getting Started | VPN, terminal tools, service checks, shells, and transfer commands. |
| 2 | Network Enumeration NMAP | Host/port discovery, service fingerprinting, and NSE. |
| 3 | Foot-printing | Protocol-specific information gathering. |
| 4 | Information Gathering | Web/domain reconnaissance and asset mapping. |
| 5 | File Transfers | Platform-appropriate upload/download methods. |
| 6 | Shells and Payloads | Reverse, bind, web, and interactive shells. |
| 7 | MetaSploit MSFconsole | Module discovery, options, execution, and session handling. |
| 8 | Password Attacks | Online credential testing and offline recovery. |
| 9 | Attack Common Services | Service-specific assessment and exploitation. |
| 10 | Pivoting, Tunnelling, and Port Forwarding | Reach additional networks through an existing foothold. |
| 11 | Active Directory Enumeration & Attacks | Domain discovery, identity relationships, and attack paths. |
| 12 | Active Directory Tools | Select the collection, authentication, execution, or audit tool for the task. |
| 13 | Using Web Proxies | Capture, modify, and replay application traffic. |
| 14 | [Attacking Web Applications with Ffuf](https://academy.hackthebox.com/module/details/54) | Discover content, virtual hosts, and application inputs. |
| 15 | Login Brute Forcing | Test login mechanisms and credential candidates. |
| 16 | SQL Injection Fundamentals | Identify and validate SQL injection behaviour. |
| 17 | SQLMap Essentials | Configure automated SQL injection testing from a confirmed input. |
| 18 | Cross-Site Scripting (XSS) | Identify browser-side execution and its application impact. |
| 19 | File Inclusion - LFI | Test file inclusion and traversal paths. |
| 20 | File Upload Attacks | Assess upload validation, storage paths, and execution behaviour. |
| 21 | Command Injections | Identify command/argument boundaries and validate execution. |
| 22 | Web Attacks | Chain application-specific weaknesses into a reproducible result. |
| 23 | Attacking Common Applications † | Assess widely deployed application stacks and management interfaces. |
| 24 | Linux Privilege Escalation † | Turn a Linux foothold into the required local privilege. |
| 25 | Windows Privilege Escalation † | Evaluate Windows tokens, permissions, services, and local elevation. |
| 26 | Documentation & Reporting † | Turn evidence and attack paths into reproducible findings and remediation. |
| 27 | Attacking Enterprise Networks † | Combine host, application, identity, and network paths end to end. |

† The earlier 0x1ceKing README points to a cheatsheet directory for these five topics rather than an individual document. The independently written workflows in this manual remain the working reference.

### Requested-source coverage and handoffs

The [buduboti walkthrough](https://github.com/buduboti/CPTS-Walkthrough) and [Cavementech quick reference](https://notes.cavementech.com/) are comparison sources, not command-output or credential inputs. Their substantive methods are integrated into these existing pages:

| Source focus | Working pages | Tool-selection checkpoint |
|---|---|---|
| AD enumeration and attacks — [buduboti 20](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/20.%20Active%20Directory%20Enumeration%20%26%20Attacks.md), [Cavementech enumeration](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/ad-enumeration) | [[pending/field-manual/01-information-gathering/active-directory-enumeration\|AD enumeration]], [[pending/field-manual/03-exploitation/active-directory-credential-attacks\|Credentials]], [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl\|ACLs/delegation/trusts]] | Acting identity, effective rights, selected object/service, CE versus legacy format, DNS/time, and proof resource |
| Certificate Services — [Cavementech AD CS](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/active-directory-certificate-services-ad-cs-attacks), [current Certipy ESC guide](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation) | [[pending/field-manual/03-exploitation/adcs-exploitation\|AD CS]] | Installed Certipy release, CA endpoint/name, template/enrolment rights, strong mapping, private-key ownership, and exact backup/request ID |
| Password attacks and stores — [buduboti 17](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/17.%20Password%20Attacks.md), [Cavementech cracking](https://notes.cavementech.com/pentesting-quick-reference/brute-forcing-password-cracking) | [[pending/field-manual/02-pre-exploitation/password-wordlists\|Candidate generation]], [[pending/field-manual/04-post-exploitation/hash-cracking\|Offline recovery]], [[pending/field-manual/04-post-exploitation/windows-credential-dumping\|Windows stores]] | Material format/etype, matched artifacts, bounded candidate cost, and a separate live-account budget |
| Network and common services — [buduboti 10](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/10.%20Network%20Enumeration%20with%20NMAP.md), [buduboti 18](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/18.%20Attacking%20Common%20Services.md), [Cavementech scanning](https://notes.cavementech.com/pentesting-quick-reference/scanning) | [[pending/field-manual/01-information-gathering/service-enumeration/tools\|Nmap/native probes]], [[pending/field-manual/03-exploitation/service-exploitation\|Service exploitation]] | Confirmed open ports, saved scan XML, actual authentication namespace, and one service operation |
| Web attacks and proxies — [buduboti 25](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/25.%20SQLMap%20Essentials.md), [Cavementech SQL injection](https://notes.cavementech.com/pentesting-quick-reference/web-pentesting/sql-injection) | [[pending/field-manual/03-exploitation/web-exploitation\|Web exploitation]], [[pending/field-manual/06-procedures/web-pentest-procedure\|Web procedure]] | Captured request, owner/role, input/parser context, valid/invalid controls, and mutation/cleanup boundaries |
| Transfers and pivots — [buduboti 13](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/13.%20File%20Transfers.md), [buduboti 19](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/19.%20Pivoting%20Tunneling%2C%20and%20Port%20Forwarding.md), [Cavementech transfer](https://notes.cavementech.com/pentesting-quick-reference/uploading-shells-transferring-files) | [[pending/field-manual/04-post-exploitation/file-transfer\|File transfer]], [[pending/field-manual/05-lateral-movement/pivoting-and-tunneling\|Tunnels]] | Matching sender/receiver, endpoint direction, bind/authentication, OS/architecture, DNS/SPN/TLS, final byte count/digest, and exact route cleanup |

Search these methods at [/notes/](/notes/) by body-only identifiers such as [`DCOnly`](/notes/?q=DCOnly), [`msDS-AllowedToActOnBehalfOfOtherIdentity`](/notes/?q=msDS-AllowedToActOnBehalfOfOtherIdentity), or [`"write-configuration"`](/notes/?q=%22write-configuration%22). Exact tags can be combined with the query; Writeups stay in their own listing.

## AD tool inventory

The following inventory expands the public 0x1ceKing AD Tools list with the requested sources and upstream documentation. Impacket entries use upstream script names; distribution packages often expose equivalent `impacket-*` commands. A tool's presence does not establish reachability or authorisation; match collection formats, credential type, and service prerequisites to the selected task.

| Tool | One-line purpose |
|---|---|
| [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1) / [SharpView](https://github.com/dmchell/SharpView) | PowerShell/.NET AD situational awareness, object discovery, and targeted access checks. |
| [BloodHound CE](https://github.com/SpecterOps/BloodHound) / [legacy BloodHound](https://github.com/BloodHoundAD/BloodHound) | Graph relationships into candidate paths; validate current object rights/sessions before acting. |
| [SharpHound](https://github.com/SpecterOps/SharpHound) | Windows collector; choose directory-only methods or separately approved session methods and the matching ingestion format. |
| [BloodHound.py](https://github.com/dirkjanm/BloodHound.py) | Linux Python/Impacket collection: `bloodhound-ce-python` for CE, `bloodhound-python` for the corresponding legacy release; Python `DCOnly` avoids member-host queries. |
| [Certipy](https://github.com/ly4k/Certipy) | AD CS discovery, certificate requests/PKINIT, supported relay and key-credential workflows; configuration/key writes require explicit scope and restoration. |
| [bloodyAD](https://github.com/CravateRouge/bloodyAD) | Targeted LDAP object/permission queries and controlled modifications; separate read-only discovery from write/reset actions. |
| [Kerbrute](https://github.com/ropnop/kerbrute) | Use Kerberos preauthentication behaviour for account enumeration and password testing. |
| [Impacket toolkit](https://github.com/fortra/impacket) | Python implementations and example tools for Windows/AD network protocols; preserve exact installed-script help and credential/SPN context. |
| [Responder](https://github.com/lgandx/Responder) | LLMNR, NBT-NS, and mDNS poisoning with authentication-capture services. |
| [Inveigh.ps1](https://github.com/Kevin-Robertson/Inveigh/blob/master/Inveigh.ps1) | PowerShell network spoofing/poisoning and authentication capture. |
| [C# Inveigh (InveighZero)](https://github.com/Kevin-Robertson/Inveigh/tree/master/Inveigh) | C# Inveigh implementation with a console for inspecting captured authentication data. |
| [rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html) | Samba RPC client for remote account, domain, and service enumeration. |
| [[pending/field-manual/07-toolkit/netexec\|NetExec]] / [legacy CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) | Multi-protocol checks; older 0x1ceKing/buduboti examples use CME, while this manual uses current `nxc` syntax where supported. |
| [Rubeus](https://github.com/GhostPack/Rubeus) | C# Kerberos ticket operations and abuse tooling. |
| GetUserSPNs.py | Discover user-associated SPNs and request service-ticket material for Kerberoasting. |
| [Hashcat](https://hashcat.net/hashcat/) | Offline hash cracking and password recovery across supported formats. |
| [enum4linux](https://github.com/CiscoCXSecurity/enum4linux) | Gather Windows and Samba account/share/domain information. |
| [enum4linux-ng](https://github.com/cddmp/enum4linux-ng) | Reworked Windows/Samba enumeration with structured collection and output. |
| [ldapsearch](https://linux.die.net/man/1/ldapsearch) | Query LDAP directly with explicit search bases, filters, and attributes. |
| [windapsearch](https://github.com/ropnop/windapsearch) | Python LDAP enumeration of AD users, groups, computers, and custom queries. |
| [DomainPasswordSpray.ps1](https://github.com/dafthack/DomainPasswordSpray) | PowerShell domain password-spray testing. |
| [LAPSToolkit](https://github.com/leoloobeek/LAPSToolkit) | PowerView-based auditing of LAPS deployment and password-access permissions. |
| [Windows LAPS PowerShell](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-management-powershell) | Current LAPS reader/permission checks; encrypted-password read and decrypt rights are different from legacy LAPS access. |
| [ActiveDirectory PowerShell module](https://learn.microsoft.com/en-us/powershell/module/activedirectory/) | Native object/SID/resultant-policy, trust, and gMSA-reader inventory; module availability and credential/server context are prerequisites. |
| [smbmap](https://github.com/ShawnDEvans/smbmap) | Enumerate SMB shares and the current account's access across hosts. |
| psexec.py | Impacket service-based remote execution with a semi-interactive shell. |
| wmiexec.py | Impacket remote command execution over WMI. |
| [Snaffler](https://github.com/SnaffCon/Snaffler) | Find potentially useful files, including credential-bearing files, on accessible shares. |
| smbserver.py | Provide an SMB server for network file transfer and Windows interaction. |
| [setspn.exe](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc731241(v=ws.11)) | Read, add, modify, or delete service-account SPN registrations. |
| [Mimikatz (reference fork)](https://github.com/ParrotSec/mimikatz) | Inspect host credentials and Kerberos tickets and perform supported pass-the-hash operations. |
| secretsdump.py | Extract SAM/LSA secrets and, with suitable rights, domain credential material. |
| [evil-winrm](https://github.com/Hackplayers/evil-winrm) | Interactive remote shell over WinRM. |
| mssqlclient.py | Impacket client for authenticating to and querying Microsoft SQL Server. |
| [noPac.py](https://github.com/Ridter/noPac) | Chain CVE-2021-42278 and CVE-2021-42287 on affected AD configurations. |
| rpcdump.py | Query the RPC endpoint mapper to identify exposed RPC interfaces. |
| [CVE-2021-1675.py](https://github.com/cube0x0/CVE-2021-1675/blob/main/CVE-2021-1675.py) | Python PrintNightmare proof of concept for vulnerable print-spooler paths. |
| ntlmrelayx.py | Forward a **live** NTLM exchange to a selected supported service; saved NetNTLM response records are not replayable relay sessions. |
| [PetitPotam.py](https://github.com/topotam/PetitPotam) | Coerce Windows authentication through MS-EFSRPC calls. |
| [gettgtpkinit.py](https://github.com/dirkjanm/PKINITtools/blob/master/gettgtpkinit.py) | Request a Kerberos TGT using a certificate and private key through PKINIT. |
| [getnthash.py](https://github.com/dirkjanm/PKINITtools/blob/master/getnthash.py) | Use an existing TGT, the AS reply key, and a U2U PAC to recover the current account's NT hash. |
| [adidnsdump](https://github.com/dirkjanm/adidnsdump) | Enumerate and dump records from AD-integrated DNS. |
| [gpp-decrypt](https://github.com/t0thkr1s/gpp-decrypt) | Recover passwords from Group Policy Preferences `cpassword` values. |
| GetNPUsers.py | Find/request AS-REP material for accounts without required Kerberos preauthentication. |
| lookupsid.py | Enumerate account names by looking up candidate relative IDs under a SID. |
| ticketer.py | Create and customise TGT/TGS tickets with the required key material. |
| raiseChild.py | Automate eligible child-to-parent domain escalation with the necessary child-domain privileges. |
| [Active Directory Explorer](https://docs.microsoft.com/en-us/sysinternals/downloads/adexplorer) | Browse/edit AD objects and save, inspect, or compare directory snapshots. |
| [PingCastle](https://www.pingcastle.com/documentation/) | Assess AD security posture against a risk and maturity framework. |
| [Group3r](https://github.com/Group3r/Group3r) | Audit Group Policy Objects for security misconfigurations. |
| [ADRecon](https://github.com/adrecon/ADRecon) | Extract AD inventory into structured reports, including Excel summaries. |

For task order, use [[pending/field-manual/06-procedures/active-directory-compromise#AD tool selection by task|AD tool selection by task]]. `C:\Tools` in the [0x1ceKing notes](https://github.com/0x1ceKing/HTB-Certified-Penetration-Testing-Specialist) and [buduboti AD module](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/20.%20Active%20Directory%20Enumeration%20%26%20Attacks.md) is only a staging convention. Choose a private approved working directory and compatible platform/architecture; do not place credential outputs, certificates/private keys, caches, or collector archives in this published repository.

### Preflight before a tool run

1. Record the version/help, OS/architecture, dependencies, acting principal, credential type, target object/host/SPN, and expected success condition. Bash/PowerShell/interactive-tool inputs are separate contexts.
2. Confirm name resolution, clock, listener/service reachability, effective permissions, and a small normal/invalid comparison before expanding collection or automation.
3. Classify the command: read-only directory query, live authentication, poisoning/relay trigger, file/configuration write, remote service execution, or Tier-0 credential operation. Allocate the appropriate attempt/impact budget.
4. For changes, capture the precise original state, use a unique absent artifact/ACE/account, and agree on restoration. A tool's `auto`, `All`, `--continue-on-success`, or cleanup mode is not a safety contract.
5. Validate a finding with the intended resource operation and retain private evidence. Restore only introduced deltas, re-read state, and distinguish ticket issuance/import from accepted service access.

### Supporting reference collections

- [SecLists](https://github.com/danielmiessler/SecLists) — the wordlists used by many discovery and credential-testing examples.
- [Exploit-DB](https://www.exploit-db.com/) — public exploit references and the corpus searched locally by SearchSploit.
- [Rapid7 module database](https://www.rapid7.com/db/) — Metasploit module details, prerequisites, and references.
- [Introduction to Web Applications](https://academy.hackthebox.com/module/details/75) — supporting web architecture and vulnerability fundamentals.
- [0x1ceKing — CPTS notes](https://github.com/0x1ceKing/HTB-Certified-Penetration-Testing-Specialist), [buduboti — CPTS-Walkthrough](https://github.com/buduboti/CPTS-Walkthrough), and [Cavementech — Quick Reference](https://notes.cavementech.com/) — public method comparisons; individual technique pages identify the specific modules/pages used.
