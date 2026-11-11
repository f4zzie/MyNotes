---
title: "Active Directory Compromise Procedure"
description: "Ordered end-to-end checklist from an initial foothold to domain compromise and evidence collection."
category: "Field Manual"
tags: ["field-manual", "cpts", "active-directory", "procedure"]
date: 2026-11-11
published: true
status: archive
---

# Active Directory Compromise Procedure

## Phase 0 — Scope and foothold

- [ ] Confirm in-scope domains, IPs, and excluded hosts.
- [ ] Obtain any provided credentials.
- [ ] Identify the initial foothold: web shell, VPN, workstation, service.
- [ ] Establish a stable shell and note the host/user context.

## Phase 1 — Domain discovery

- [ ] Resolve the DC (`nslookup -type=SRV _ldap._tcp.dc._msdcs.$DOMAIN`).
- [ ] Identify domain name, NetBIOS, SID, functional level.
- [ ] Enumerate users (Kerberos/RPC/LDAP).
- [ ] Enumerate groups, computers, trusts, password policy.
- [ ] Collect BloodHound data with the current user.

```bash
nxc smb $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --users --groups --computers --pass-pol
bloodhound-python -u "$USER" -p "$PASS" -d "$DOMAIN" -ns $DC_IP -c All --zip
```

## Phase 2 — Initial domain credentials

Try in order:

- [ ] Reused local/admin credentials.
- [ ] GPP `cpassword` in SYSVOL.
- [ ] Kerberoastable SPNs.
- [ ] AS-REP roastable users.
- [ ] Password spray (respect lockout).
- [ ] Credentials in shares, scripts, configs, descriptions.
- [ ] Web app/database credentials.

```bash
nxc smb $DC_IP -u "$USER" -p "$PASS" -M gpp_password
impacket-GetUserSPNs "$DOMAIN/$USER:$PASS" -dc-ip $DC_IP -request
impacket-GetNPUsers "$DOMAIN/" -usersfile users.txt -dc-ip $DC_IP -no-pass -format hashcat
```

Crack offline, then validate:

```bash
nxc smb $DC_IP -u "$NEWUSER" -p "$NEWPASS" -d $DOMAIN
```

## Phase 3 — Map the shortest path

- [ ] Mark owned users/computers in BloodHound.
- [ ] Find shortest path to Domain Admins.
- [ ] Check ACL edges (`GenericAll`, `WriteDACL`, `ForceChangePassword`, `AddMember`).
- [ ] Check delegation (unconstrained/constrained/RBCD).
- [ ] Check ADCS (ESC1–ESC8).
- [ ] Check sessions on high-value hosts.
- [ ] Check local admin rights (`Find-LocalAdminAccess`).

## Phase 4 — Execute the path

### ACL

- [ ] Reset a password / add to group / grant DCSync.
- [ ] Re-enumerate with the new rights.

### Delegation

- [ ] Unconstrained: coerce + capture TGT.
- [ ] Constrained: S4U2Self/S4U2Proxy to a useful SPN.
- [ ] RBCD: write `msDS-AllowedToActivateTo`, request ticket, impersonate.

### ADCS

- [ ] Request certificate as DA → PKINIT → TGT/NT hash.
- [ ] Use the hash/ticket to access the DC.

### Credential reuse

- [ ] Test the credential on SMB/WinRM/RDP/MSSQL.
- [ ] Dump SAM/LSA on each new local admin host.
- [ ] Re-run BloodHound with new sessions.

## Phase 5 — Domain compromise

- [ ] Obtain Domain Admin or equivalent.
- [ ] DCSync (`secretsdump -just-dc`).
- [ ] Access the DC and capture the flag.
- [ ] Dump NTDS for the report/password review.
- [ ] Check trusts for further scope.
- [ ] Document the shortest path; do not over-exploit.

## Phase 6 — Evidence and cleanup

- [ ] Record every credential source and validation.
- [ ] Record ACL/template/service changes.
- [ ] Remove created machine accounts, ACLs, services, and files.
- [ ] Capture BloodHound path screenshots.
- [ ] Write the walkthrough while it is fresh.

## Stop conditions

- You have the flag/objective and domain compromise evidence.
- The next step would be destructive or outside scope.
- You are repeating the same failed technique without new information.

## References

- [BloodHound docs](https://bloodhound.readthedocs.io/)
- [The Hacker Recipes — AD](https://www.thehacker.recipes/ad/)
- [HackTricks — AD methodology](https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/index.html)

## Enterprise engagement framing

Apply the eight-stage process from [[pending/field-manual/06-procedures/index|Procedures]] to each enterprise attack path. The engagement objective may be access to a particular application or dataset; use that objective to decide how far the domain path needs to go.

| Process stage | Apply it to this procedure | Evidence or handoff |
|---|---|---|
| Pre-Engagement | Extend Phase 0 with the NDA, goals, time window, Rules of Engagement, domain/forest boundaries, and permitted trust relationships. | Scope and objective associated with each domain and target range. |
| Information Gathering | Use Phase 1 plus service, share, DNS, and account discovery from the current network position. | Host/service map, domain identity, relationships, and the account used for collection. |
| Vulnerability Assessment | Evaluate Phases 2–3 candidates against real account rights, configuration, patch state, and reachability. | A prioritised path with prerequisites for each ACL, credential, delegation, or service edge. |
| Exploitation | Execute one validated Phase 4 transition and check the resulting access. | Starting identity, target, technique, and observed resulting identity/permission. |
| Post-Exploitation | On the new host, establish a usable session, assess local elevation, and identify useful data or credential sources. | Host context and references to the information that enables the next step. |
| Lateral Movement | Test the next in-scope host/service using the new access, then repeat discovery and post-exploitation. | Source host → destination host, protocol, credential reference, and successful access evidence. |
| Proof-of-Concept | Reconstruct the shortest successful path, including transitions outside AD such as a web or database foothold. | Reproduction steps, BloodHound/path evidence, prerequisites, and the fix that breaks each edge. |
| Post-Engagement | Finish Phase 6, review the report with the client, retain evidence under the agreed policy, and retest fixes. | Change/cleanup record, findings, management impact summary, and retest status. |

### Foothold-to-domain handoff

- [ ] Correlate discovered IPs, hostnames, services, and domain membership before importing them into the path map.
- [ ] Distinguish local administrator rights from domain privileges; record which identity actually gained access to each service.
- [ ] When a web-server foothold yields a reusable credential, validate the relevant database/SMB/remote-management service, then enumerate from that new position.
- [ ] Preserve the credential's source and an evidence reference at each move so the final chain explains how the access was obtained.
- [ ] Revisit the attack graph after a successful move or privilege change; earlier collection may not include newly visible objects or sessions.

Useful service/share checks from Getting Started, run on the attack host with the target variables set:

```bash
nmap --script smb-os-discovery.nse -p445 "$IP"
smbclient -N -L "//$IP"
smbclient -U "$USER" -W "$DOMAIN" "//$IP/$SHARE"
```

The first share command tests unauthenticated listing; the second prompts for the selected account's password. Within `smbclient`, use `ls`, `cd`, and `get` to inspect a specific accessible share. Record whether access is anonymous, guest, or authenticated.

## AD tool selection by task

This task-oriented inventory covers the reference's AD Tools cheatsheet. See [[pending/field-manual/07-toolkit/index#AD tool inventory|Toolkit — AD tool inventory]] for individual descriptions and project links.

| Task | Tools | What the result contributes |
|---|---|---|
| Targeted AD situational awareness | PowerView / SharpView | Users, computers, groups, access checks, and focused follow-up after gaining credentials. |
| Relationship collection and path analysis | BloodHound, SharpHound, BloodHound.py | Collected AD relationships and a graph of candidate paths; match collector output to the BloodHound version. |
| LDAP and Windows/Samba inventory | ldapsearch, windapsearch, enum4linux, enum4linux-ng | Queryable users/groups/computers and service/domain metadata. |
| RPC, SIDs, and DNS | rpcclient, rpcdump.py, lookupsid.py, adidnsdump | RPC endpoints, SID/account mappings, and AD-integrated DNS records. |
| Multi-protocol operations | Impacket toolkit, NetExec / CrackMapExec | Protocol-specific enumeration, credential validation, and post-exploitation over SMB, WMI, WinRM, or MSSQL. |
| Kerberos and SPNs | Rubeus, GetUserSPNs.py, GetNPUsers.py, setspn.exe | Service-account SPNs, preauthentication settings, roastable material, and Kerberos ticket operations. |
| Password testing and recovery | Kerbrute, DomainPasswordSpray.ps1, Hashcat | Account validation, policy-aware spray testing, and offline recovery of captured hashes. |
| Name-resolution and coerced authentication | Responder, Inveigh.ps1, C# Inveigh (InveighZero), PetitPotam.py | Authentication captured through name-resolution poisoning or MS-EFSRPC coercion. |
| Authentication relay | ntlmrelayx.py | Test whether a captured NTLM authentication can be relayed to a reachable service. |
| Group Policy and local-password review | gpp-decrypt, Group3r, LAPSToolkit | GPP password exposure, GPO misconfigurations, and LAPS access relationships. |
| Share discovery and relevant files | smbmap, Snaffler | Accessible shares and files that can explain a credential or data-access path. |
| Remote shell and database access | psexec.py, wmiexec.py, evil-winrm, mssqlclient.py | Validate access using service execution, WMI, WinRM, or a SQL session. |
| Host credential and ticket access | Mimikatz, secretsdump.py | In-memory credentials/tickets or SAM/LSA material, subject to the current host rights. |
| File transfer | smbserver.py | An SMB endpoint for transferring tools or assessment files. |
| Certificate-based Kerberos | gettgtpkinit.py, getnthash.py | Obtain a TGT using PKINIT, then use the necessary key material and U2U PAC data to recover the account's NT hash. |
| Ticket creation and domain trusts | ticketer.py, raiseChild.py | Ticket construction and eligible child-to-parent escalation paths with the required keys/privileges. |
| Vulnerability-specific paths | noPac.py, CVE-2021-1675.py | Validate the conditions for the noPac chain or PrintNightmare before selecting the relevant PoC. |
| Audit and evidence snapshots | Active Directory Explorer, PingCastle, ADRecon | Directory snapshots/diffs, AD security posture, and structured inventory for analysis/reporting. |

In the reference labs, Windows tools are commonly staged under `C:\Tools`; Linux collection can run from the provided non-domain-joined attack host. Identify the tool version and collection context before interpreting its output.
