---
title: "Field Manual Progress Tracker"
description: "Coverage checklist for CPTS modules, techniques, and manual sections, with review dates and confidence levels."
category: "Field Manual"
tags: ["field-manual", "cpts", "tracker"]
date: 2026-11-11
published: true
status: archive
---

# Progress Tracker

Use one row per technique, not per module. Update after each lab, skill assessment, or AEN run.

Legend: `[ ]` not studied · `[-]` studied, not practised · `[x]` practised in a lab · `[!]` exam-ready (can execute from memory and explain why)

## Phase 1 — Information Gathering

- [ ] Network scanning workflow (host discovery → ports → services → scripts)
- [ ] FTP / SSH / SMTP / DNS / TFTP / Finger / Kerberos enumeration
- [ ] POP3 / IMAP enumeration
- [ ] SMB / RPC / NFS enumeration
- [ ] SNMP / LDAP / IPMI / Rsync enumeration
- [ ] MSSQL / Oracle TNS / MySQL enumeration
- [ ] RDP / WinRM enumeration
- [ ] Web server, vhost, directory, parameter fuzzing
- [ ] WordPress / Joomla / Drupal / Tomcat / Jenkins / Splunk / GitLab / PRTG / osTicket / ColdFusion / IIS / Magento
- [ ] JavaScript deobfuscation and secret discovery
- [ ] AD hosts, users, groups, password policy, ACLs, BloodHound
- [ ] GitHub/Google dorking, passive infrastructure, CanaryTokens
- [ ] Wi-Fi monitoring and enumeration

## Phase 2 — Pre-Exploitation

- [ ] Bind vs reverse shell selection
- [ ] Linux/Windows reverse shell one-liners
- [ ] Web shells and file-extension bypasses
- [ ] Shell stabilisation and TTY upgrade
- [ ] Shell jail escapes
- [ ] MSFConsole workflow (search, use, options, payload, sessions)
- [ ] MSFVenom payload formats and encoders/evasion
- [ ] Searchsploit and exploit adaptation
- [ ] Cross-compilation
- [ ] Password/wordlist generation (CeWL, crunch, hashcat rules, username mutations)

## Phase 3 — Exploitation

- [ ] Kerberoasting / AS-REP roasting
- [ ] GPP passwords
- [ ] Password spraying
- [ ] ACL abuse
- [ ] AD CS (ESC1–ESC8)
- [ ] DCSync
- [ ] Silver tickets
- [ ] Unconstrained / constrained / RBCD delegation
- [ ] Child→parent and interforest trusts
- [ ] MSSQL exploitation and linked servers
- [ ] RDP pass-the-hash
- [ ] SQL injection (union, blind, file read/write, RCE)
- [ ] XSS / CSRF
- [ ] LFI / directory traversal / PHP filters
- [ ] File upload
- [ ] Command injection
- [ ] SSTI
- [ ] XXE
- [ ] HTTP brute forcing
- [ ] Office macro / LNK / SCF / iCalendar / JScript / DLL hijack client-side chains
- [ ] Wi-Fi WEP/WPA/WPS/evil twin/WPA-Enterprise
- [ ] Kiosk breakout

## Phase 4 — Post-Exploitation

### Linux

- [ ] Enumeration (host, users, network, processes, packages, mounts)
- [ ] SUID/SGID abuse
- [ ] Sudo abuse and `LD_PRELOAD`/`LD_LIBRARY_PATH`
- [ ] Capabilities
- [ ] Cron jobs and timers
- [ ] PATH hijacking
- [ ] NFS `no_root_squash`
- [ ] Privileged groups (adm, disk, docker, lxc/lxd, shadow)
- [ ] Passwd/shadow read-write abuse
- [ ] PwnKit and kernel/version exploits
- [ ] Python/shared-object hijacking
- [ ] Tmux/session hijacking
- [ ] Wildcard injection
- [ ] Credential hunting
- [ ] Ansible abuse

### Windows

- [ ] Enumeration (host, users, groups, privileges, services, network)
- [ ] Weak service permissions / unquoted paths
- [ ] AlwaysInstallElevated
- [ ] Scheduled tasks
- [ ] DLL hijacking/proxying
- [ ] SCF/LNK abuse
- [ ] VHD/VHDX/VMDK secrets
- [ ] User privileges: SeBackup/SeRestore, SeDebug, SeImpersonate, SeLoadDriver, SeTakeOwnership
- [ ] Privileged groups: Backup Operators, DnsAdmins, Event Log Readers, Hyper-V Admins, Print Operators, Server Operators
- [ ] SAM/LSA, LSASS, NTDS dumping
- [ ] Credential Guard / LSA protection bypass
- [ ] Windows version exploits
- [ ] UAC bypass (FodHelper)
- [ ] AMSI bypass
- [ ] AppLocker/CLM bypass
- [ ] Firewall tampering
- [ ] VBA stomping

## Phase 5 — Lateral Movement

- [ ] LLMNR/NBT-NS poisoning
- [ ] NTLM pass-the-hash
- [ ] PsExec
- [ ] SMB NTLM relay
- [ ] WMI / WinRM
- [ ] Windows Kerberos pass-the-ticket
- [ ] Linux Kerberos pass-the-ticket (ccache, keytab)
- [ ] AD lateral movement patterns
- [ ] Pivoting recon, local/dynamic/reverse port forwarding, proxy chains
- [ ] DNS and HTTP tunneling

## Exam skills

- [ ] Methodology per phase written and tested
- [ ] Report trigger table memorised
- [ ] AEN blind run completed
- [ ] IppSec playlist stress test completed
- [ ] Time/energy plan written
- [ ] Mock finding + walkthrough written
- [ ] DPAT password review practised

## Review log

| Date | Section | Result | Next action |
|---|---|---|---|
| 2026-11-11 | Manual scaffold created | Structure imported from source | Fill notes as modules are studied |
