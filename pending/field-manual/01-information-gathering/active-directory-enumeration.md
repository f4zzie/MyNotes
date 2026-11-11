---
title: "Active Directory Enumeration"
description: "Enumeration of AD hosts, users, groups, password policy, ACLs, delegation, AD CS, and trusts from Linux and Windows."
category: "Field Manual"
tags: ["field-manual", "cpts", "active-directory", "enumeration"]
date: 2026-11-11
published: true
status: archive
---

# Active Directory Enumeration

## Cheatsheet

| Goal | Command |
|---|---|
| Resolve DC | `nslookup -type=SRV _ldap._tcp.dc._msdcs.$DOMAIN` |
| Null SMB/RPC | `enum4linux-ng -A $DC_IP` |
| Users via RID cycle | `nxc smb $DC_IP -u '' -p '' --rid-brute 10000` |
| Users via Kerberos | `kerbrute userenum --dc $DC_IP -d $DOMAIN users.txt` |
| LDAP base | `ldapsearch -x -H ldap://$DC_IP -s base namingcontexts` |
| Authenticated LDAP | `ldapsearch -x -H ldap://$DC_IP -D "$USER@$DOMAIN" -w "$PASS" -b "DC=target,DC=htb"` |
| All AD data (Linux) | `bloodhound-python -u "$USER" -p "$PASS" -d "$DOMAIN" -ns $DC_IP -c All --zip` |
| All AD data (Windows) | `SharpHound.exe -c All --zipfilename loot.zip` |
| Password policy | `nxc smb $DC_IP -u "$USER" -p "$PASS" --pass-pol` |
| AD CS | `certipy find -u "$USER@$DOMAIN" -p "$PASS" -dc-ip $DC_IP -vulnerable -stdout` |
| Trusts | `nltest /domain_trusts /all_trusts /v` |
| DNS records | `adidnsdump -u "$DOMAIN\\$USER" -p "$PASS" $DC_IP` |

## Ports that matter

| Port | Service | Why |
|---|---|---|
| 53 | DNS | SRV records, zone transfer, ADIDNS |
| 88 | Kerberos | User enumeration, roasting, tickets |
| 135 | MSRPC | RPC enumeration, lateral movement |
| 139/445 | SMB | Shares, null sessions, RID cycling, relay |
| 389/636 | LDAP/LDAPS | Users, groups, ACLs, trusts, ADCS objects |
| 464 | kpasswd | Password changes |
| 3268/3269 | Global Catalog | Cross-domain/forest queries |
| 5985/5986 | WinRM | Remote management once privileged |
| 9389 | AD Web Services | Rare, but AD-specific |

## Unauthenticated enumeration

### SMB and RPC

```bash
enum4linux-ng -A $DC_IP
nxc smb $DC_IP -u '' -p '' --shares --users --groups --pass-pol
nxc smb $DC_IP -u '' -p '' --rid-brute 10000

rpcclient -U '' -N $DC_IP
# enumdomusers
# enumdomgroups
# querydominfo
# getdompwinfo
# netshareenumall
```

Null sessions are increasingly disabled, but RID cycling and Kerberos user enumeration often still work.

### Kerberos user enumeration

```bash
kerbrute userenum --dc $DC_IP -d $DOMAIN /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt -t 20
```

A `KDC_ERR_PREAUTH_FAILED` response means the user exists; `KDC_ERR_C_PRINCIPAL_UNKNOWN` means it does not.

### LDAP

```bash
ldapsearch -x -H ldap://$DC_IP -s base namingcontexts
ldapsearch -x -H ldap://$DC_IP -b "DC=target,DC=htb" "(objectClass=user)" sAMAccountName
```

Try anonymous binds, then authenticated binds with any recovered credential.

## Authenticated enumeration

### NetExec

```bash
nxc smb $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --users --groups --computers --shares --sessions --loggedon-users
nxc smb $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --pass-pol
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --users --groups --computers
nxc smb $DC_IP -u "$USER" -p "$PASS" --laps
```

Modules worth listing early:

```bash
nxc smb $DC_IP -u "$USER" -p "$PASS" -M enum_av
nxc ldap $DC_IP -u "$USER" -p "$PASS" -M adcs
```

### LDAP queries

```bash
# Users with descriptions (often contain passwords)
ldapsearch -x -H ldap://$DC_IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(&(objectClass=user)(description=*))" sAMAccountName description

# SPNs (Kerberoastable)
ldapsearch -x -H ldap://$DC_IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(&(objectClass=user)(servicePrincipalName=*))" sAMAccountName servicePrincipalName

# AS-REP roastable
ldapsearch -x -H ldap://$DC_IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))" sAMAccountName

# AdminCount / privileged users
ldapsearch -x -H ldap://$DC_IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(&(objectClass=user)(adminCount=1))" sAMAccountName
```

### BloodHound

Linux collector:

```bash
bloodhound-python -u "$USER" -p "$PASS" -d "$DOMAIN" -ns $DC_IP -c All --zip
```

Windows collector:

```powershell
.\SharpHound.exe -c All --zipfilename loot.zip
# or in memory
Invoke-BloodHound -CollectionMethod All
```

Upload the ZIP to BloodHound. Prioritise:

- Shortest path to Domain Admin.
- Kerberoastable users with DA privileges.
- AS-REP roastable users.
- Unconstrained delegation hosts.
- Users with DCSync rights.
- ACL edges: `GenericAll`, `GenericWrite`, `WriteDACL`, `WriteOwner`, `ForceChangePassword`.
- Sessions on high-value hosts.

### PowerView (Windows)

```powershell
Import-Module .\PowerView.ps1
Get-NetUser
Get-NetUser -SPN
Get-NetGroup "Domain Admins" -Recurse
Get-NetComputer
Get-NetComputer -Unconstrained
Find-LocalAdminAccess
Get-ObjectAcl -ResolveGUIDs | Where-Object {$_.ActiveDirectoryRights -match "GenericAll|WriteDacl"}
Invoke-ACLScanner -ResolveGUIDs
Get-DomainTrust
Get-ForestTrust
```

### ACL and write-permission enumeration

```bash
bloodyAD -u "$USER" -p "$PASS" -d "$DOMAIN" --host $DC_IP get writable
bloodyAD -u "$USER" -p "$PASS" -d "$DOMAIN" --host $DC_IP get writable --detail
```

Look for rights your current principal has over users, groups, computers, and OUs. These are the shortest paths to privilege escalation.

### AD CS

```bash
certipy find -u "$USER@$DOMAIN" -p "$PASS" -dc-ip $DC_IP -vulnerable -stdout
```

Check for ESC1–ESC8, web enrollment, and certificate templates allowing client authentication or SAN control. See [[pending/field-manual/03-exploitation/adcs-exploitation|AD CS exploitation]].

### Trusts

```powershell
nltest /domain_trusts /all_trusts /v
Get-ADTrust -Filter *
Get-DomainTrust -API
```

```bash
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --query "(&(objectClass=trustedDomain))"
```

Record direction, transitivity, SID filtering, and forest boundaries. Trusts are lateral-movement paths, not just inventory.

### Delegation

```powershell
Get-NetComputer -Unconstrained
Get-DomainUser -TrustedToAuth
Get-DomainComputer -TrustedToAuth
```

```bash
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --trusted-for-delegation
```

### GPOs and local admin rights

```powershell
Get-GPO -All
Get-GPOReport -All -ReportType HTML -Path C:\Windows\Temp\gpos.html
Get-DomainGPO
Find-LocalAdminAccess
```

```bash
nxc smb $DC_IP -u "$USER" -p "$PASS" -M gpp_password
nxc smb $DC_IP -u "$USER" -p "$PASS" -M gpp_autologin
```

## What to record

| Category | Fields |
|---|---|
| Domain | FQDN, NetBIOS, SID, functional level, DCs |
| Users | Name, description, SPN, UAC flags, groups, adminCount |
| Groups | Members, nested privileges, local admin groups |
| Computers | OS, unconstrained delegation, LAPS, sessions |
| Policy | Lockout threshold/duration, min length, complexity |
| ACLs | Principal → right → target |
| AD CS | CA, templates, enrolment rights, web endpoints |
| Trusts | Direction, transitivity, SID filtering |
| Shares | Read/write, sensitive files |

## Common mistakes

- Running BloodHound only as a domain admin — collect early with any user.
- Ignoring `description`, `info`, and `comment` fields.
- Forgetting to query the Global Catalog for cross-domain objects.
- Treating “no null session” as “no user enumeration” (Kerberos still works).
- Not checking password policy before spraying and locking accounts.
- Collecting ACLs but never mapping them to your principal.

## References

- [HackTricks — Active Directory methodology](https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/index.html)
- [BloodHound docs](https://bloodhound.readthedocs.io/)
- [NetExec wiki](https://www.netexec.wiki/)
- [The Hacker Recipes — AD](https://www.thehacker.recipes/ad/)
- [Certipy](https://github.com/ly4k/Certipy)
