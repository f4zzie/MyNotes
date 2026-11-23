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
| Resolve DC | `dig @"$DC_IP" +short SRV "_ldap._tcp.dc._msdcs.$DOMAIN"` |
| Null SMB/RPC | `enum4linux-ng -A "$DC_IP"` |
| Users via RID cycle | `nxc smb "$DC_IP" -u '' -p '' --rid-brute 10000` |
| Users via Kerberos | `kerbrute userenum --dc "$DC_IP" -d "$DOMAIN" -t 1 users.txt` |
| LDAP base | `ldapsearch -LLL -x -H "ldap://$DC_IP" -b '' -s base namingContexts` |
| Authenticated LDAP | `ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W -b "$BASE_DN" "(objectClass=domainDNS)"` |
| Directory graph (Linux, CE) | `bloodhound-ce-python -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" -ns "$DC_IP" -dc "$DC_HOST" -c DCOnly --zip` |
| Directory graph (Windows) | `SharpHound.exe -c DCOnly --zipfilename directory.zip` |
| Password policy | `nxc smb "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --pass-pol` |
| AD CS | `certipy find -u "$AD_USER@$DOMAIN" -p "$AD_PASSWORD" -dc-ip "$DC_IP" -stdout` |
| Trusts | `nltest /domain_trusts /all_trusts /v` |
| DNS records | `adidnsdump -u "$NETBIOS\\$AD_USER" -p "$AD_PASSWORD" "$DC_IP"` |

## Establish the collection context

Use a named assessment account rather than the shell's built-in `$USER` variable. These fictional values illustrate the inputs; replace them with the authorised environment's values. Keep credentials, collector archives, and directory exports outside the published notes.

```bash
DOMAIN='corp.example'
NETBIOS='CORP'
DC_HOST='dc01.corp.example'
DC_IP='192.0.2.10'
BASE_DN='DC=corp,DC=example'
AD_USER='assessor'
read -rsp 'Assessment password: ' AD_PASSWORD
```

`-W` makes `ldapsearch` prompt instead of placing a password in its arguments. Other tools may require a password argument; shell variables prevent hard-coded examples but do **not** hide expanded arguments from process inspection. Use a protected assessment workstation and the tool's prompt or Kerberos option where supported.

On a domain-connected Windows assessment host with RSAT available, initialise a separate PowerShell context:

```powershell
Import-Module ActiveDirectory
$DomainInfo = Get-ADDomain
$DOMAIN = $DomainInfo.DNSRoot
$NETBIOS = $DomainInfo.NetBIOSName
$BASE_DN = $DomainInfo.DistinguishedName
$DC_HOST = $DomainInfo.PDCEmulator
$DC_IP = Resolve-DnsName $DC_HOST -Type A | Where-Object Type -eq 'A' | Select-Object -First 1 -ExpandProperty IPAddress
$AD_USER = Read-Host 'Assessment account name'
$AD_CRED = Get-Credential -UserName "$NETBIOS\$AD_USER" -Message 'Authorised assessment identity'
$EVIDENCE_DIR = Read-Host 'Existing protected assessment-output directory'
```

The native discovery commands use the current Windows identity. In a non-domain or double-hop session, specify a known DC and explicit credentials where the command supports them; do not assume the Bash variables also exist in PowerShell. Verify that the selected DC address is correct before using it.

| Focused input | Populate from |
|---|---|
| `TARGET_USER`, `TARGET_COMPUTER`, `TARGET_GROUP` | The selected object's actual account/group identity from directory results |
| `TARGET_DN` | That selected object's complete distinguished name, not its display name |
| `TARGET_HOST` | The approved member host's DNS hostname |
| `GPO_NAME` | One policy's display name returned by `Get-GPO -All` |
| `REPORT_PATH` | A unique XML output path inside the existing protected `EVIDENCE_DIR` |

Populate only the inputs needed for the selected workflow, in the shell where that workflow runs. On PowerShell, for example, `$TARGET_DN = (Get-ADUser -Identity $TARGET_USER -Server $DC_HOST).DistinguishedName` resolves a selected user, and `$REPORT_PATH = Join-Path $EVIDENCE_DIR 'selected-gpo.xml'` chooses a local report path.

- [ ] Record whether the starting identity is local, domain, computer, or service-account based.
- [ ] Confirm the permitted domains, OUs, member hosts, collection methods, and time window.
- [ ] Resolve the DC and service FQDNs through the domain DNS server; a hosts-file entry does not supply SRV records.
- [ ] Compare the local clock with the DC before diagnosing Kerberos failures.
- [ ] Verify one credential pair once, then prefer authenticated directory reads over additional login attempts.
- [ ] Separate directory-only collection from host/session queries and secret-recovery operations.

### DNS, RootDSE, and time

```bash
dig @"$DC_IP" +short SRV "_ldap._tcp.dc._msdcs.$DOMAIN"
dig @"$DC_IP" +short SRV "_kerberos._tcp.$DOMAIN"
dig @"$DC_IP" +short SRV "_ldap._tcp.gc._msdcs.$DOMAIN"
dig @"$DC_IP" +short A "$DC_HOST"
ldapsearch -LLL -x -H "ldap://$DC_IP" -b '' -s base \
  defaultNamingContext configurationNamingContext rootDomainNamingContext \
  dnsHostName currentTime supportedSASLMechanisms
date -u
```

RootDSE is a base-scope query for directory metadata, not an anonymous dump of all users. Derive `BASE_DN` from `defaultNamingContext`; use `configurationNamingContext` for forest configuration such as PKI. `rootDomainNamingContext` identifies the forest-root domain, which may differ from the current child domain. If anonymous RootDSE is blocked, repeat it with the approved authenticated bind.

Kerberos normally tolerates only a small clock difference, commonly five minutes. Correct the assessment host's time through the approved process rather than changing a DC or treating `KRB_AP_ERR_SKEW` as a bad password. For LDAPS, resolve the certificate's hostname and trust the appropriate issuing CA; disabling TLS validation is not a fix for LDAP signing or channel-binding enforcement.

## Ports that matter

| Port | Service | Why |
|---|---|---|
| 53 | DNS | SRV records, zone transfer, ADIDNS |
| 88 | Kerberos | User enumeration, roasting, tickets |
| 135 | MSRPC | RPC enumeration, lateral movement |
| 139/445 | SMB | Shares, null sessions, RID cycling, relay |
| 389/636 | LDAP/LDAPS | Users, groups, ACLs, trusts, AD CS objects; UDP 389 is CLDAP |
| 464 | kpasswd | Password changes |
| 3268/3269 | Global Catalog | Cross-domain/forest queries |
| 5985/5986 | WinRM | Remote management once privileged |
| 9389 | AD Web Services | Rare, but AD-specific |

RPC-based host collection can also require negotiated dynamic ports, commonly TCP 49152–65535 on modern Windows. A reachable endpoint mapper on 135 does not prove that WMI, session collection, or replication will work through a firewall or pivot. The Global Catalog exposes a partial attribute set; use the object's own domain DC for attributes absent from the GC.

## Unauthenticated enumeration

### SMB and RPC

```bash
enum4linux-ng -A "$DC_IP"
nxc smb "$DC_IP" -u '' -p '' --shares --users --groups --pass-pol
nxc smb "$DC_IP" -u '' -p '' --rid-brute 10000
rpcclient -U '' -N "$DC_IP"
```

Within the RPC client, select the required read-only query:

```text
enumdomusers
enumdomgroups
querydominfo
getdompwinfo
netshareenumall
```

Null sessions and anonymous RID lookups are increasingly restricted. An access-denied response establishes a limit for that interface, not the absence of users or shares. Do not immediately expand the RID range or substitute a large username list.

### Kerberos user enumeration

```bash
kerbrute userenum --dc "$DC_IP" -d "$DOMAIN" candidates.txt -t 1
```

Build `candidates.txt` from observed naming conventions and approved source material. `KDC_ERR_C_PRINCIPAL_UNKNOWN` indicates an unknown principal. `KDC_ERR_PREAUTH_REQUIRED` is the usual existence signal from an AS request without preauthentication; `KDC_ERR_PREAUTH_FAILED` indicates failed preauthentication, not a successful login. Tool output also distinguishes disabled, expired, and locked accounts. Keep generated names, confirmed names, and excluded accounts in separate lists.

### LDAP

```bash
ldapsearch -LLL -x -H "ldap://$DC_IP" -b '' -s base namingContexts
ldapsearch -LLL -x -H "ldap://$DC_IP" -b "$BASE_DN" \
  "(&(objectCategory=person)(objectClass=user))" sAMAccountName
```

The second query works only when anonymous subtree reads are permitted. Use an approved recovered credential for follow-up; do not send an LDAP simple-bind password over an unprotected connection. Prefer LDAPS or a correctly configured SASL/GSSAPI bind.

## Authenticated enumeration

### NetExec

```bash
nxc smb "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --users --groups --shares --pass-pol
nxc ldap "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --users --groups --computers
```

List protocol-specific help and installed modules before choosing a follow-up:

```bash
nxc smb --help
nxc ldap --help
nxc smb -L
nxc ldap -L
nxc ldap "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" -M adcs
```

### LDAP queries

```bash
ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W \
  -E pr=1000/noprompt -b "$BASE_DN" \
  "(&(objectCategory=person)(objectClass=user)(description=*))" \
  sAMAccountName distinguishedName description info

ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W \
  -E pr=1000/noprompt -b "$BASE_DN" \
  "(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))" \
  sAMAccountName servicePrincipalName pwdLastSet msDS-SupportedEncryptionTypes

ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W \
  -b "$BASE_DN" \
  "(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))" \
  sAMAccountName userAccountControl

ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W \
  -b "$BASE_DN" "(&(objectCategory=person)(objectClass=user)(adminCount=1))" \
  sAMAccountName memberOf adminCount
```

Paging avoids silently interpreting a server size limit as a complete inventory. Narrow `-b` to an authorised OU where appropriate. `objectClass=user` alone also matches computer objects; `objectCategory=person` separates human/service user accounts here. `adminCount=1` can remain after historical protected-group membership and does not prove current administrative access.

To expand a known user's nested group memberships, set `TARGET_DN` to its actual distinguished name:

```bash
ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W \
  -b "$BASE_DN" "(&(objectCategory=group)(member:1.2.840.113556.1.4.1941:=$TARGET_DN))" \
  sAMAccountName distinguishedName
```

The `1.2.840.113556.1.4.1941` matching rule follows nested membership links. Escape LDAP filter metacharacters when inserting collected values, and check the user's primary group separately: it is not represented by an ordinary `memberOf` link.

### Password policy and fine-grained policies

```powershell
Import-Module ActiveDirectory
Get-ADDefaultDomainPasswordPolicy | Format-List
Get-ADFineGrainedPasswordPolicy -Filter * |
    Select-Object Name,Precedence,LockoutThreshold,LockoutDuration,LockoutObservationWindow
Get-ADUserResultantPasswordPolicy -Identity $TARGET_USER | Format-List
net accounts /domain
```

A null resultant-policy result normally means the default domain policy applies, not that there is no policy. Fine-grained password policies can give selected users/groups different thresholds and windows. Read access can vary; if the effective policy is unknown, do not infer a safe spray budget from the default policy alone.

```bash
ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W \
  -b "$BASE_DN" -s base "(objectClass=domainDNS)" \
  minPwdLength pwdHistoryLength maxPwdAge lockoutThreshold lockoutDuration lockOutObservationWindow
```

AD interval attributes commonly use negative 100-nanosecond units: for a finite interval, `abs(value) / 600000000` gives minutes. Special values, missing attributes, and indefinite lockout require separate interpretation. Record policy per target account and coordinate any password testing with the engagement's lockout and monitoring rules. See [[pending/field-manual/03-exploitation/active-directory-credential-attacks#Password spraying|Password spraying]] for the execution gate.

### BloodHound

Choose a collector that produces the schema accepted by the deployed BloodHound edition:

| Deployment | Linux package / executable | Windows collector |
|---|---|---|
| BloodHound Community Edition | `bloodhound-ce` / `bloodhound-ce-python` | A CE-compatible SharpHound release from the deployment's collector page |
| Legacy BloodHound | `bloodhound` / `bloodhound-python` | A matching legacy SharpHound release |

Keep the Linux packages in separate virtual environments if both are needed. Starting Neo4j and a legacy desktop GUI is not a BloodHound CE installation workflow. Record collector version, collection time, account, domain, methods, and import errors.

Start with directory-only Linux collection:

```bash
bloodhound-ce-python -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" \
  -ns "$DC_IP" -dc "$DC_HOST" -c DCOnly --zip
```

Windows directory-only collection:

```powershell
.\SharpHound.exe -c DCOnly --zipfilename directory.zip
```

For BloodHound.py, `DCOnly` covers `Group,Acl,Trusts,ObjectProps,Container` without member-host connections. `All` adds host-oriented collection but **excludes `LoggedOn`**; privileged logged-on-user collection is a distinct method requiring suitable host access. SharpHound methods and flags can differ by release. Do not assume a Python collection has every SharpHound relationship, especially GPO-derived local group data.

Only after host collection is authorised, collect selected Windows hosts, for example:

```powershell
.\SharpHound.exe -c Session,LocalAdmin,PSRemote --computerfile approved-computers.txt --zipfilename host-access.zip
```

Upload the returned archive through the deployment's import interface and check for successful ingestion. Prioritise:

- Shortest path to Domain Admin.
- Kerberoastable users with DA privileges.
- AS-REP roastable users.
- Unconstrained delegation hosts.
- Users with DCSync rights.
- ACL edges: `GenericAll`, `GenericWrite`, `WriteDACL`, `WriteOwner`, `ForceChangePassword`.
- Sessions on high-value hosts.

Treat every path as a hypothesis. Mark the controlled principal as owned, inspect the exact edge, and verify it with a current directory read or a single intended host operation. Session edges are point-in-time observations; hidden sessions or denied host queries are missing coverage, not proof that no session exists. A shortest graph path is not always the lowest-impact path.

### PowerView (Windows)

```powershell
Import-Module .\PowerView.ps1
Get-DomainUser -Properties samaccountname,description,memberof,useraccountcontrol
Get-DomainUser -SPN -Properties samaccountname,serviceprincipalname
Get-DomainGroupMember -Identity 'Domain Admins' -Recurse
Get-DomainComputer -Properties name,dnshostname,operatingsystem
Get-DomainComputer -Unconstrained
Get-DomainObjectAcl -Identity $TARGET_DN -ResolveGUIDs
Get-DomainTrust
Get-ForestTrust
```

### Windows living off the land

Begin with the host's current identity and domain connection rather than downloading collectors immediately:

```powershell
whoami /all
hostname
ipconfig /all
nltest /dsgetdc:$env:USERDNSDOMAIN
net user /domain
net group 'Domain Admins' /domain
net view /domain
```

`net user /domain` and `net group ... /domain` ask a domain controller; without `/domain`, they describe the local account database. `net view` is a visibility lead and can fail because browsing/SMB is restricted. Use the ActiveDirectory module when available:

```powershell
Get-ADDomain | Select-Object DNSRoot,NetBIOSName,DomainSID,DomainMode,PDCEmulator
Get-ADForest | Select-Object RootDomain,Domains,GlobalCatalogs,ForestMode
Get-ADUser -Identity $TARGET_USER -Properties Description,MemberOf,ServicePrincipalName,AdminCount
Get-ADComputer -Identity $TARGET_COMPUTER -Properties DNSHostName,OperatingSystem,TrustedForDelegation
Get-ADGroupMember -Identity $TARGET_GROUP -Recursive
```

When RSAT/PowerView is unavailable, a domain-authenticated Windows PowerShell session can make a paged LDAP query using .NET:

```powershell
$Root = [ADSI]'LDAP://RootDSE'
$BaseDN = [string]$Root.defaultNamingContext
$Search = New-Object System.DirectoryServices.DirectorySearcher
$Search.SearchRoot = [ADSI]("LDAP://$BaseDN")
$Search.PageSize = 500
$Search.Filter = '(&(objectCategory=person)(objectClass=user))'
[void]$Search.PropertiesToLoad.Add('samaccountname')
[void]$Search.PropertiesToLoad.Add('distinguishedname')
$Search.FindAll() | ForEach-Object {
    [pscustomobject]@{
        User = $_.Properties['samaccountname'][0]
        DN = $_.Properties['distinguishedname'][0]
    }
}
$Search.Dispose()
```

This uses the current Windows authentication context; a WinRM foothold may not have reusable credentials for the DC because of the [[pending/field-manual/05-lateral-movement/windows-lateral-movement#Kerberos double-hop diagnosis|double-hop problem]]. Restricted language mode or endpoint policy may also block .NET types. Record the limitation instead of disabling the control.

### Security controls and targeted host checks

```powershell
$ExecutionContext.SessionState.LanguageMode
Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled
Get-AppLockerPolicy -Effective -Xml
Get-CimInstance -Namespace root\Microsoft\Windows\DeviceGuard -ClassName Win32_DeviceGuard
```

These are read-only posture checks where the components and permissions exist. A missing Defender cmdlet is not proof that no security product exists; AppLocker output alone does not describe WDAC enforcement. Use the findings to select compatible, approved tools, not to disable AV, logging, Credential Guard, or LSASS protection.

For one selected host, with PowerView loaded:

```powershell
Get-NetLocalGroupMember -ComputerName $TARGET_HOST -GroupName 'Remote Management Users'
Get-NetLocalGroupMember -ComputerName $TARGET_HOST -GroupName 'Remote Desktop Users'
Get-NetSession -ComputerName $TARGET_HOST
Test-AdminAccess -ComputerName $TARGET_HOST
```

Host queries can require additional privileges and generate network/log activity. An access-group membership is not equivalent to a running listener, allowed logon right, or administrative token. Validate actual access through the [[pending/field-manual/05-lateral-movement/windows-lateral-movement|Windows lateral-movement]] workflow.

### ACL and write-permission enumeration

```bash
bloodyAD -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --host "$DC_IP" get writable --detail
```

Map principal → right → target DN → applicable attribute/extended right. Include group-derived permissions, inheritance, and deny ACEs. `WriteProperty` on an unrelated property is not arbitrary computer control, and replication rights matter on the domain naming-context root. Validate the transition and restoration plan in [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl|Delegation, ACLs, and trusts]].

### AD CS

```bash
certipy find -u "$AD_USER@$DOMAIN" -p "$AD_PASSWORD" -dc-ip "$DC_IP" -stdout
```

Retain the complete CA/template inventory before optionally filtering with `-vulnerable`. Record CA name **and** DNS hostname, published templates, enrolment principals, issuance gates, EKUs, SAN control, SID security-extension behaviour, CA management rights, and HTTP(S)/EPA settings. Modern Certipy identifies scenarios beyond ESC8; an ESC label is a candidate condition, not proof of impersonation. See [[pending/field-manual/03-exploitation/adcs-exploitation|AD CS exploitation]] for mapping-aware validation.

### Trusts

```powershell
nltest /domain_trusts /all_trusts /v
Get-ADTrust -Filter * | Select-Object Source,Target,Direction,TrustType,IntraForest,ForestTransitive,SelectiveAuthentication,SIDFilteringQuarantined,SIDFilteringForestAware
Get-DomainTrust -API
```

```bash
ldapsearch -LLL -x -H "ldaps://$DC_HOST" -D "$AD_USER@$DOMAIN" -W \
  -b "$BASE_DN" "(objectClass=trustedDomain)" \
  trustPartner trustDirection trustType trustAttributes securityIdentifier
```

Write the relationship as a sentence: **A trusts B → B's identities may authenticate to resources in A**. Resource authorisation and selective-authentication requirements still apply. Record the domain from which a direction label was obtained, transitivity, SID filtering, forest boundary, destination DNS/DCs, and whether that destination is in scope. A trust is not permission to test another forest.

### Delegation

```powershell
Get-DomainComputer -Unconstrained
Get-DomainUser -TrustedToAuth
Get-DomainComputer -TrustedToAuth
Get-DomainComputer -Properties name,msds-allowedtodelegateto,msds-allowedtoactonbehalfofotheridentity
Get-DomainUser -Properties samaccountname,msds-allowedtodelegateto
```

```bash
nxc ldap "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --find-delegation
```

`TrustedToAuth` identifies the protocol-transition flag, not every constrained-delegation account. Inspect `msDS-AllowedToDelegateTo` even when that flag is absent. For RBCD, the target resource stores a security descriptor in `msDS-AllowedToActOnBehalfOfOtherIdentity`; its mere presence does not mean the current user can change it or controls an allowed principal.

Current NetExec replaces the removed `--trusted-for-delegation` option with `--find-delegation`; confirm protocol help on an older installation rather than silently accepting an obsolete flag.

### GPOs and local admin rights

```powershell
Import-Module GroupPolicy
Get-GPO -All
Get-DomainGPO
Get-GPOReport -Name $GPO_NAME -ReportType XML -Path $REPORT_PATH
Get-ADOrganizationalUnit -Filter * -Properties gPLink,gPOptions | Select-Object DistinguishedName,gPLink,gPOptions
```

```bash
nxc smb "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" -M gpp_password
nxc smb "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" -M gpp_autologin
```

Distinguish policy-object write rights, SYSVOL file permissions, where the GPO is linked, and security/WMI filtering. Read existing logon/deployment scripts selectively rather than downloading an entire share. GPP secret recovery and LAPS password retrieval require their own evidence-handling approval; they are not mandatory parts of a directory inventory.

## What to record

| Category | Fields |
|---|---|
| Domain | FQDN, NetBIOS, SID, functional level, DCs |
| Users | Name, description, SPN, UAC flags, groups, adminCount |
| Groups | Members, nested privileges, local admin groups |
| Computers | OS, unconstrained delegation, LAPS, sessions |
| Policy | Default and resultant policy, lockout threshold/duration/window, testing exclusions |
| ACLs | Principal → right → target |
| AD CS | CA, templates, enrolment rights, web endpoints |
| Trusts | Direction, transitivity, SID filtering |
| Shares | Read/write, sensitive files |

### Enumeration handoff checklist

- [ ] Keep a domain/forest/DC map and distinguish DNS domains from NetBIOS names.
- [ ] Record confirmed usernames, disabled/locked accounts, SPN owners, and policy exceptions.
- [ ] Record collector coverage and failed interfaces; do not describe partial data as complete.
- [ ] Select one candidate path with a current principal, reachable service, required right, and success oracle.
- [ ] Keep credential values in restricted evidence storage and use references in reports/notes.
- [ ] After a privilege change, refresh only the objects or host relationships relevant to the next step.

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
- [BloodHound.py — CE branch and collection methods](https://github.com/dirkjanm/BloodHound.py/tree/bloodhound-ce)
- [SpecterOps — BloodHound documentation](https://bloodhound.specterops.io/)
- [NetExec — LDAP command arguments](https://github.com/Pennyw0rth/NetExec/blob/main/nxc/protocols/ldap/proto_args.py)
- [buduboti/CPTS-Walkthrough — Active Directory module](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/20.%20Active%20Directory%20Enumeration%20%26%20Attacks.md)
- [Cavementech — Credentialed enumeration from Linux](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/ad-enumeration/credentialed-enumeration-from-linux)
- [Cavementech — Living off the land](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/ad-enumeration/living-off-the-land)
- [Cavementech — Password policies](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/password-spraying/enumerating-and-retrieving-password-policies)
- [Cavementech — Collecting BloodHound data](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/bloodhound/collecting-the-loot)

The additional workflows are an independently written synthesis of these public references. Lab transcripts, credential values, and answers are not reproduced; current upstream collector documentation takes precedence over legacy command forms.
