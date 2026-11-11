---
title: "Windows Enumeration → Privilege Escalation Procedure"
description: "Ordered Windows checklist from shell context to SYSTEM, credential collection, and cleanup."
category: "Field Manual"
tags: ["field-manual", "cpts", "windows", "procedure", "privesc"]
date: 2026-11-11
published: true
status: archive
---

# Windows Enumeration → Privilege Escalation Procedure

## Step 0 — Context

```cmd
whoami /all
hostname
systeminfo
ipconfig /all
```

- [ ] User, groups, privileges, integrity level.
- [ ] Domain or workgroup.
- [ ] OS build and patch level.
- [ ] AV/EDR and AppLocker status.

## Step 1 — Quick wins

- [ ] `cmdkey /list`.
- [ ] PowerShell history.
- [ ] `unattend.xml`, `sysprep.inf`, `web.config`.
- [ ] Writable service binaries/directories.
- [ ] `AlwaysInstallElevated`.
- [ ] Saved credentials in registry.

## Step 2 — Services and tasks

```cmd
sc query
wmic service get name,displayname,pathname,startmode
schtasks /query /fo LIST /v
```

- [ ] Unquoted service paths.
- [ ] Weak service ACLs (`accesschk`).
- [ ] Writable service binaries.
- [ ] Scheduled tasks running as SYSTEM with writable actions.

## Step 3 — Privileges and groups

```cmd
whoami /priv
net localgroup administrators
```

- [ ] `SeImpersonate` → potato.
- [ ] `SeBackup`/`SeRestore` → registry/SAM.
- [ ] `SeDebug` → LSASS.
- [ ] `SeTakeOwnership` → take files.
- [ ] `SeLoadDriver` → driver.
- [ ] Backup Operators, DnsAdmins, Server Operators, Print Operators, Hyper-V Admins.

## Step 4 — Files and credentials

- [ ] `C:\Users`, `C:\Windows\Temp`, `C:\Users\Public`.
- [ ] `C:\Windows\Panther`, `sysprep`.
- [ ] IIS `web.config`, `applicationHost.config`.
- [ ] Browser profiles, Credential Manager.
- [ ] Registry autologon.
- [ ] GPP/SYSVOL.
- [ ] VHD/VHDX files.

## Step 5 — Choose a path

| Finding | Action |
|---|---|
| Writable service | Replace binary / change `binPath` |
| Unquoted path | Plant executable in earlier path |
| AlwaysInstallElevated | MSI payload |
| SeImpersonate | PrintSpoofer/GodPotato |
| SeBackup | Save SAM/SYSTEM, dump offline |
| SeDebug | Dump LSASS |
| DnsAdmins | DLL plugin |
| UAC + local admin | FodHelper/UACME |
| Missing patch | Verified local exploit |

## Step 6 — Escalate and collect

- [ ] Confirm `whoami /priv` and `whoami /groups`.
- [ ] Capture the flag (`C:\Users\*\Desktop\flag.txt`, `C:\flag.txt`).
- [ ] Dump SAM/LSA, LSASS, or NTDS as appropriate.
- [ ] Enumerate domain trusts, shares, and sessions.
- [ ] Re-run BloodHound with new access.

## Step 7 — Cleanup

- [ ] Remove services, scheduled tasks, files, registry keys.
- [ ] Restore modified binaries/configs.
- [ ] Remove created users and machine accounts.
- [ ] Document all changes and hashes.

## Stop conditions

- SYSTEM/Administrator achieved and flag captured.
- Exploit would crash a production-like host.
- Action is outside scope or destructive.

## References

- [HackTricks — Windows privesc](https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/index.html)
- [PayloadsAllTheThings — Windows privesc](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [UACME](https://github.com/hfiref0x/UACME)

## Engagement-stage framing

Local Windows enumeration and escalation normally sit inside the engagement's **Post-Exploitation** stage. Keep the local proof separate from the next access transition so the report can explain how a workstation or server foothold affected the wider environment.

| Process stage | Windows application | Completion evidence |
|---|---|---|
| Pre-Engagement | Carry forward the host/domain scope, objectives, time window, Rules of Engagement, and permitted configuration changes. | Associate the host with the agreed target list and objective. |
| Information Gathering | Steps 0–4: establish identity, integrity level, privileges, build/patch state, services, tasks, and reachable resources. | Record the starting security context and host/service inventory. |
| Vulnerability Assessment | Step 5: correlate the finding with real ACLs, token rights, service identity, patch state, and execution conditions. | State the exact prerequisite and how the current user satisfies it. |
| Exploitation | Step 6: execute the selected local path and verify the resulting token and access. | Capture the transition to Administrator/SYSTEM or the specific delegated access obtained. |
| Post-Exploitation | Enumerate again with the new rights; identify the data or credential sources relevant to the assessment objective. | Record access evidence and references to useful host information. |
| Lateral Movement | Use the new information to test another in-scope SMB, WMI, WinRM, or database service. | Record the destination identity and rights; local SYSTEM alone does not establish domain control. |
| Proof-of-Concept | Reconstruct the initial foothold, local escalation, and any later enterprise/AD transition. | Include the exact configuration, tool versions, invocation, output, and remediation. |
| Post-Engagement | Complete Step 7, reconcile all host changes, deliver the walkthrough, archive evidence, and retest fixes. | Change/cleanup record and repeatable retest instructions. |

### Correlate external discovery with local context

From the attack host, the Getting Started SMB discovery probe can provide a reported hostname, workgroup/domain, and OS for comparison with Step 0:

```bash
nmap --script smb-os-discovery.nse -p445 "$IP"
```

Confirm those observations inside the session. SMB can be served by Samba on Linux, and SSH can run on Windows; the listening protocol alone does not establish the operating system. Similarly, a reported version must be checked against actual patch/configuration state before selecting an exploit.

### PoC handoff to the engagement report

- [ ] Preserve the starting account, groups, privileges, and integrity level alongside the resulting context.
- [ ] Record the vulnerable object's ACL/configuration, its execution identity, and the trigger that crosses the privilege boundary.
- [ ] Tie any discovered credential to its source and validated service through an evidence reference.
- [ ] If the path continues into AD, hand off the domain identity, reachable hosts, and useful rights to [[pending/field-manual/06-procedures/active-directory-compromise|Active Directory compromise]].
- [ ] Show which remediation breaks the demonstrated path and which services, tasks, binaries, or registry settings were restored.
