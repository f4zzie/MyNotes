---
title: "Lateral Movement"
description: "Phase 5 overview: reuse credentials and trust to move across Windows, Linux, and network pivots."
category: "Field Manual"
tags: ["field-manual", "cpts", "lateral-movement"]
date: 2026-11-11
published: true
status: archive
---

# Phase 5 — Lateral Movement

Lateral movement is credential and trust reuse. You rarely “exploit” your way to the next host; you authenticate with something you already own.

## Inputs

- Local admin hashes/passwords from SAM/LSASS.
- Domain credentials and tickets.
- SSH keys and Kerberos caches.
- Trusted relationships: AD trusts, delegated rights, shared storage.
- Network position: a dual-homed host or VPN foothold.

## Decision flow

```text
Have a credential/hash/ticket?
├── SMB reachable → nxc smb / psexec / smbexec / wmiexec
├── WinRM reachable → evil-winrm / Enter-PSSession
├── RDP reachable → xfreerdp (PTH if allowed)
├── MSSQL reachable → xp_cmdshell / linked server
├── SSH reachable → ssh / keys / agent
└── Only one host reachable → pivot (chisel/ligolo/ssh)

Have a ticket?
├── ccache → KRB5CCNAME + impacket -k
├── keytab → kinit -k -t
└── Windows → Rubeus ptt / mimikatz kerberos::ptt
```

## Contents

- [[pending/field-manual/05-lateral-movement/windows-lateral-movement|Windows lateral movement]]
- [[pending/field-manual/05-lateral-movement/linux-lateral-movement|Linux lateral movement]]
- [[pending/field-manual/05-lateral-movement/pivoting-and-tunneling|Pivoting and tunneling]]

## Rules

- Test credentials on one host at a time; avoid mass authentication that triggers lockouts/alerts.
- Prefer the least noisy protocol that achieves the objective.
- Record every host where a credential was validated.
- Clean up services, files, and sessions you create.
- Do not reuse a domain admin credential on a compromised workstation unless necessary; it exposes the credential to LSASS/EDR.

## Common chains

| Start | Chain |
|---|---|
| Local admin hash | SMB → PsExec/WMI → SAM/LSASS on next host |
| Domain user | BloodHound → local admin on a server → DA |
| Kerberoast crack | Service account → local admin → DCSync |
| NTLM relay | Coerce DC → relay LDAP → RBCD → DA |
| SSH key | Next Linux host → agent forwarding → more hosts |
| Dual-homed host | Pivot → internal subnet → new services |
