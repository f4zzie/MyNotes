---
title: "Information Gathering"
description: "Phase 1 overview: turn an IP range or domain into an attack surface map of services, applications, identities, and trust."
category: "Field Manual"
tags: ["field-manual", "cpts", "information-gathering", "enumeration"]
date: 2026-11-11
published: true
status: archive
---

# Phase 1 — Information Gathering

> “Enumeration is the exam.” Almost every hard flag becomes easy once the exposed service, version, virtual host, user, share, or permission is identified. Slow down here.

## Output of this phase

By the end you should have, for every reachable host:

- IP, hostname, OS guess, domain membership.
- All TCP/UDP ports and service versions.
- Every web vhost, path, parameter, and discovered technology.
- Shares, users, groups, password policy, ACLs, trusts.
- Credentials or hashes found in files, configs, Git history, and metadata.
- A ranked list of candidate weaknesses.

## Workflow

```text
Scope → host discovery → full TCP scan → targeted UDP → service-specific enumeration
      → web enumeration (vhosts, content, params) → identity enumeration (AD/LDAP/SMB)
      → credential discovery → re-enumerate with new access → rank candidates
```

### 1. Build the target list

```bash
# Single host or range from scope
printf '%s\n' 10.10.10.0/24 > targets.txt

# Resolve supplied domains
for d in target.htb app.target.htb; do dig +short "$d"; done
```

### 2. Fast triage

```bash
nmap -Pn -n -p- --min-rate 5000 -oA nmap/allports 10.10.10.0/24
nmap -Pn -n -sU --top-ports 100 -oA nmap/udp 10.10.10.10
nmap -Pn -n -sC -sV -p 21,22,25,53,80,88,110,139,143,389,443,445,464,587,636,993,995,1433,2049,3306,3389,5985,5986,8080 -oA nmap/services 10.10.10.10
```

### 3. Enumerate by service

Use the service notes; don't run every tool blindly. Each service note starts with a decision table.

### 4. Re-enumerate with every new credential

New access changes the visible surface:

- SMB shares → new files, scripts, configs.
- LDAP → users, groups, SPNs, ACLs, trusts, ADCS.
- MSSQL → linked servers, `xp_cmdshell`, file reads.
- Local admin → SAM/LSASS, scheduled tasks, sessions.

## Notes

- [[pending/field-manual/01-information-gathering/active-directory-enumeration|Active Directory enumeration]]
- [[pending/field-manual/01-information-gathering/infrastructure-enumeration|Infrastructure enumeration & OSINT]]
- [[pending/field-manual/01-information-gathering/reverse-engineering-javascript|JavaScript deobfuscation]]
- [[pending/field-manual/01-information-gathering/service-enumeration/index|Service enumeration]]
- [[pending/field-manual/01-information-gathering/web-enumeration|Web enumeration]]
  - [[pending/field-manual/01-information-gathering/web-enumeration#WHOIS|WHOIS]] and [[pending/field-manual/01-information-gathering/web-enumeration#DNS record enumeration|DNS records / zone transfers]]
  - [[pending/field-manual/01-information-gathering/web-enumeration#Certificate transparency logs|Certificate transparency]] and [[pending/field-manual/01-information-gathering/web-enumeration#DNS subdomain discovery|subdomain discovery]]
  - [[pending/field-manual/01-information-gathering/web-enumeration#Host-header discovery and confirmation|Virtual hosts / Host headers]]
  - [[pending/field-manual/01-information-gathering/web-enumeration#robots.txt and sitemaps|robots.txt / sitemaps]] and [[pending/field-manual/01-information-gathering/web-enumeration#Well-known URIs|well-known URIs]]
  - [[pending/field-manual/01-information-gathering/web-enumeration#Search engine discovery|Search engines]] and [[pending/field-manual/01-information-gathering/web-enumeration#Web archives|web archives]]
  - [[pending/field-manual/01-information-gathering/web-enumeration#Crawling|Crawling / ReconSpider]] and [[pending/field-manual/01-information-gathering/web-enumeration#Automating recon|recon automation]]
- [[pending/field-manual/01-information-gathering/web-app-enumeration|Common web applications]]
  - [[pending/field-manual/01-information-gathering/web-app-enumeration#Directory and parameter discovery|Directory, path-combination and parameter fuzzing]]
  - [[pending/field-manual/01-information-gathering/web-app-enumeration#Web proxy enumeration|Burp / ZAP enumeration, replay and match-and-replace rules]]
- [[pending/field-manual/01-information-gathering/wifi-enumeration|Wi-Fi enumeration]]

## Evidence discipline

For every finding, record:

```text
Host / URL:
Command:
Raw output (file):
Why it matters:
Next action:
```

Screenshot the exact output, but keep the text output too. Reports and reproducibility need commands, not just images.

## Common mistakes

- Scanning only top 1000 ports; missing 8080/8443/5985/1433/3306/2049.
- Forgetting UDP: SNMP, TFTP, NTP, DNS.
- Treating a 403 as “nothing there” instead of testing vhosts and paths.
- Not adding discovered hostnames to `/etc/hosts`, then blaming TLS/SNI.
- Failing to re-enumerate after the first credential.
- Writing “nothing found” instead of listing what was tried.

## References

- [HTB Academy — Penetration Tester path](https://academy.hackthebox.com/path/preview/penetration-tester)
- [HackTricks — Pentesting methodology](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/pentesting-methodology.html)
- [Nmap documentation](https://nmap.org/book/man.html)
