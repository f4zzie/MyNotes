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

- Keep tools updated (`nxc --version`, `searchsploit -u`, `msfupdate`).
- Verify tool output manually; scanners produce false positives.
- Prefer the tool already installed on the target to avoid transfers.
- Record versions in the report when a tool behaviour matters.

## Learning path / module index

The reference README lists 10 module entries and 27 cheatsheet/topic entries. Use the modules for the initial walkthrough, then revisit the corresponding cheatsheets while applying the [[pending/field-manual/06-procedures/index#Penetration testing process|penetration testing process]].

### Modules

| Order | Module | Working checkpoint |
|---|---|---|
| 1 | Penetration Testing Process | Define the engagement stages, scope, evidence, and deliverables. |
| 2 | Getting Started | Establish the workstation, connectivity, enumeration, shell, and transfer basics. |
| 3 | [Network Enumeration with Nmap](https://academy.hackthebox.com/module/details/19) | Identify hosts, ports, services, versions, and useful script results. |
| 4 | Footprinting | Build service-specific and infrastructure context. |
| 5 | Information Gathering - Web Edition | Map domains, web assets, technologies, and exposed functionality. |
| 6 | Security Assessments | Configure Nessus/OpenVAS, validate results, and export usable evidence. |
| 7 | [File Transfers](https://academy.hackthebox.com/module/details/24) | Move files between the attack host and target and check transfer integrity. |
| 8 | Shells & Payloads | Select a usable shell and understand connection direction and payload requirements. |
| 9 | Using the Metasploit Framework | Select modules, configure options, validate conditions, and manage sessions. |
| 10 | Password Attacks | Evaluate credentials and recover supported password/hash material. |

### Cheatsheets and follow-on topics

| Order | README topic | Practice focus |
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

† The reference README points to the cheatsheet directory for these five topics rather than an individual document.

## AD tool inventory

The following inventory expands the reference's AD Tools list. Impacket entries use upstream script names; distribution packages often expose equivalent `impacket-*` commands. Match BloodHound collectors and import formats to the deployed BloodHound version.

| Tool | One-line purpose |
|---|---|
| [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1) / [SharpView](https://github.com/dmchell/SharpView) | PowerShell/.NET AD situational awareness, object discovery, and targeted access checks. |
| [BloodHound](https://github.com/BloodHoundAD/BloodHound) | Graph AD relationships to identify and explain candidate attack paths. |
| SharpHound | C# collector for AD objects, ACLs, GPOs, attributes, and session data, producing importable JSON. |
| [BloodHound.py](https://github.com/fox-it/BloodHound.py) | Python/Impacket-based collection from a non-domain-joined attack host. |
| [Kerbrute](https://github.com/ropnop/kerbrute) | Use Kerberos preauthentication behaviour for account enumeration and password testing. |
| [Impacket toolkit](https://github.com/SecureAuthCorp/impacket) | Python implementations and example tools for Windows/AD network protocols. |
| [Responder](https://github.com/lgandx/Responder) | LLMNR, NBT-NS, and mDNS poisoning with authentication-capture services. |
| [Inveigh.ps1](https://github.com/Kevin-Robertson/Inveigh/blob/master/Inveigh.ps1) | PowerShell network spoofing/poisoning and authentication capture. |
| [C# Inveigh (InveighZero)](https://github.com/Kevin-Robertson/Inveigh/tree/master/Inveigh) | C# Inveigh implementation with a console for inspecting captured authentication data. |
| [rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html) | Samba RPC client for remote account, domain, and service enumeration. |
| [NetExec](netexec.md) / [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) | Multi-protocol enumeration, credential validation, and post-exploitation; the source uses the CME name. |
| [Rubeus](https://github.com/GhostPack/Rubeus) | C# Kerberos ticket operations and abuse tooling. |
| GetUserSPNs.py | Discover user-associated SPNs and request service-ticket material for Kerberoasting. |
| [Hashcat](https://hashcat.net/hashcat/) | Offline hash cracking and password recovery across supported formats. |
| [enum4linux](https://github.com/CiscoCXSecurity/enum4linux) | Gather Windows and Samba account/share/domain information. |
| [enum4linux-ng](https://github.com/cddmp/enum4linux-ng) | Reworked Windows/Samba enumeration with structured collection and output. |
| [ldapsearch](https://linux.die.net/man/1/ldapsearch) | Query LDAP directly with explicit search bases, filters, and attributes. |
| [windapsearch](https://github.com/ropnop/windapsearch) | Python LDAP enumeration of AD users, groups, computers, and custom queries. |
| [DomainPasswordSpray.ps1](https://github.com/dafthack/DomainPasswordSpray) | PowerShell domain password-spray testing. |
| [LAPSToolkit](https://github.com/leoloobeek/LAPSToolkit) | PowerView-based auditing of LAPS deployment and password-access permissions. |
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
| ntlmrelayx.py | Relay captured NTLM authentication to supported services, including SMB. |
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

For task order, use [[pending/field-manual/06-procedures/active-directory-compromise#AD tool selection by task|AD tool selection by task]]. The reference stages Windows tools in `C:\Tools` and uses a prepared Linux attack host for Linux-based AD work.

### Supporting reference collections

- [SecLists](https://github.com/danielmiessler/SecLists) — the wordlists used by many discovery and credential-testing examples.
- [Exploit-DB](https://www.exploit-db.com/) — public exploit references and the corpus searched locally by SearchSploit.
- [Rapid7 module database](https://www.rapid7.com/db/) — Metasploit module details, prerequisites, and references.
- [Introduction to Web Applications](https://academy.hackthebox.com/module/details/75) — supporting web architecture and vulnerability fundamentals.
