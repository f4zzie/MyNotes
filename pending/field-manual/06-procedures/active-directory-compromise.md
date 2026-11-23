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

This is an objective-driven workflow, not a requirement to obtain Domain Admin on every engagement. Use the smallest authorised proof that demonstrates the selected risk, and stop when the agreed application, host, domain, or lab objective is met. Commands use the context from [[pending/field-manual/01-information-gathering/active-directory-enumeration#Establish the collection context|AD enumeration]].

## Phase 0 — Scope and foothold

- [ ] Confirm in-scope domains, IPs, and excluded hosts.
- [ ] Obtain any provided credentials.
- [ ] Identify the initial foothold: web shell, VPN, workstation, service.
- [ ] Establish a stable shell and note the host/user context.
- [ ] Confirm permitted account changes, spraying, coercion/relay, credential collection, CA edits, trust traversal, and cleanup owners separately.
- [ ] Agree a success operation and abort conditions; an in-scope network range does not authorise every technique or a trusted external forest.
- [ ] Set up restricted evidence storage and use references rather than actual passwords/keys in the published workflow.

## Phase 1 — Domain discovery

- [ ] Resolve the DC (`nslookup -type=SRV _ldap._tcp.dc._msdcs.$DOMAIN`).
- [ ] Validate DC/service FQDNs, domain DNS, RootDSE naming contexts, local time, and supported secure LDAP authentication.
- [ ] Identify domain name, NetBIOS, SID, functional level.
- [ ] Enumerate users (Kerberos/RPC/LDAP).
- [ ] Enumerate groups, computers, trusts, password policy.
- [ ] Collect CE/legacy-compatible directory-only BloodHound data with the actual acting user; record partial/failed coverage.

```bash
nxc smb "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --users --groups --pass-pol
nxc ldap "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --computers --find-delegation
bloodhound-ce-python -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" \
  -ns "$DC_IP" -dc "$DC_HOST" -c DCOnly --zip
```

Choose only the needed inventory actions. `DCOnly` avoids member-host session collection; expand to selected approved hosts only when the candidate path needs those edges. Default domain password policy is not necessarily the effective fine-grained policy for every target account.

## Phase 2 — Initial domain credentials

Prioritise existing readable credential leads and offline work before active password testing or poisoning:

- [ ] Reused local/admin credentials.
- [ ] Credentials in accessible shares, scripts, configs, descriptions, or the foothold application.
- [ ] GPP `cpassword` in SYSVOL.
- [ ] Kerberoastable SPNs.
- [ ] AS-REP roastable users.
- [ ] Password spray only after effective-policy, exclusions, attempt-window, and monitoring approval.
- [ ] Poisoning/relay only after confirming the approved source segment, protocol-specific protection gates, and destination action.

```bash
nxc smb "$DC_IP" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" -M gpp_password
impacket-GetUserSPNs "$DOMAIN/$AD_USER" -dc-ip "$DC_IP" \
  -request-user "$SPN_USER" -outputfile selected-kerberoast.txt
impacket-GetNPUsers "$DOMAIN/" -usersfile eligible-users.txt -dc-ip "$DC_IP" \
  -no-pass -format hashcat -outputfile selected-asrep.txt
```

Crack offline, then validate:

```bash
nxc smb "$TARGET_HOST" -u "$RECOVERED_USER" -p "$RECOVERED_PASSWORD" -d "$DOMAIN"
```

The collection commands are alternatives selected by the observed account/configuration, not a blanket batch. Impacket uses `-usersfile` here; choose the cracking mode from the actual returned format/etype. Validate a recovered credential once on the selected service and distinguish authentication from authorisation or local administration. Full prerequisites are in [[pending/field-manual/03-exploitation/active-directory-credential-attacks|AD credential attacks]].

## Phase 3 — Map the shortest path

- [ ] Mark owned users/computers in BloodHound.
- [ ] Find candidate paths to the agreed objective; the shortest graph path is not necessarily the lowest-impact path.
- [ ] Check ACL edges (`GenericAll`, `WriteDACL`, `ForceChangePassword`, `AddMember`).
- [ ] Check delegation (unconstrained/constrained/RBCD).
- [ ] Check AD CS enrolment, issuance, SID mapping, and service-access conditions; use current ESC documentation, not only an ESC1–ESC8 label.
- [ ] Check sessions/local-admin/remoting rights on selected high-value hosts, not an automatic domain-wide host sweep.
- [ ] Revalidate every chosen edge against the current target object/service, effective trustee/group rights, deny/inheritance rules, and destination scope.
- [ ] Record the original configuration, approved mutation, proof operation, and restoration plan for the next transition.

| Candidate | Required current evidence | Handoff |
|---|---|---|
| User/group/object ACL | Principal/group SID → exact right/property → target DN | [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl#ACL abuse\|ACL validation]] |
| Classic delegation / RBCD | Controlled service principal, allowed SPN/resource, eligible represented user | [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl#Delegation\|Delegation]] |
| AD CS | Published CA/template, enrolment, issuance policy, issued SID, actual mapped identity | [[pending/field-manual/03-exploitation/adcs-exploitation\|AD CS]] |
| Host movement | Listener, account scope, endpoint/resource rights, required ports | [[pending/field-manual/05-lateral-movement/windows-lateral-movement\|Windows movement]] / [[pending/field-manual/05-lateral-movement/linux-lateral-movement\|Linux movement]] |
| Trust | Accepted authentication direction, filtering, selective authentication, foreign resource/group rights | [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl#Trusts\|Trust validation]] |

## Phase 4 — Execute the path

### ACL

- [ ] Prefer an existing right; if a change is required, apply one approved membership/SPN/ACE delta with the original state saved.
- [ ] Treat password resets as potentially irreversible/service-breaking; do not reset an ordinary production account to prove a permissions finding.
- [ ] Re-enumerate with the new rights.
- [ ] Validate a newly authenticated context; changed LDAP membership does not update every existing logon token/ticket.

### Delegation

- [ ] Unconstrained: confirm eligible Kerberos delegation and the controlled host's cache access; an NTLM connection is not a forwarded TGT.
- [ ] Constrained: validate `msDS-AllowedToDelegateTo`, protocol transition/forwardable evidence-ticket requirements, and the intended service SPN.
- [ ] RBCD: validate the resource-side `msDS-AllowedToActOnBehalfOfOtherIdentity` write path and controlled SPN-bearing account, save the original descriptor, then request one eligible service ticket.
- [ ] Prove the selected resource operation and restore only the introduced delegation relationship.

### ADCS

- [ ] Read the intended target principal/UPN/SID and select a genuinely published/enrollable CA/template.
- [ ] Preserve one request ID and its matching private key; verify what the CA actually issued.
- [ ] Validate current strong-mapping behaviour and the identity accepted by PKINIT/Schannel; self-enrolment is not escalation.
- [ ] Prefer `certipy auth -no-hash` and one service operation for the initial proof; hash recovery is a separate sensitive action.
- [ ] Restore any approved CA/template changes and coordinate certificate revocation independently.

### Credential reuse

- [ ] Validate one next in-scope service using the correct local/domain/service identity.
- [ ] Establish the new host/user/token context and distinguish local administrator from domain rights.
- [ ] Collect a selected SAM/LSA/session artifact only if specifically approved and necessary; do not dump each newly accessible host by default.
- [ ] Refresh only relevant graph relationships and diagnose [[pending/field-manual/05-lateral-movement/windows-lateral-movement#Kerberos double-hop diagnosis|double-hop]] limitations before blaming valid credentials.

## Phase 5 — Domain compromise

- [ ] Demonstrate the agreed administrative/domain-equivalent capability, if that is actually the objective.
- [ ] For approved replication, confirm both required rights on the domain root and use a selected-account `-just-dc-user` proof.
- [ ] Access only the agreed proof resource; retrieve a lab flag only where the lab objective explicitly requires it.
- [ ] Treat full NTDS/VSS/password review as a separate, high-impact approval—not a mandatory reporting step.
- [ ] Inventory trust risk, but traverse a destination only after confirming that forest/domain is authorised.
- [ ] Document the shortest path; do not over-exploit.

```bash
impacket-secretsdump "$DOMAIN/$AD_USER@$DC_HOST" -dc-ip "$DC_IP" -just-dc-user "$TARGET_USER"
```

This is targeted DRSUAPI replication, not a VSS database copy. Local administration on a member does not confer DCSync, and a CIFS service ticket alone does not imply domain replication rights. Stop if one approved result demonstrates the objective; acquiring `krbtgt`, all users, password history, or trust keys needs separate justification and scope.

## Phase 6 — Evidence and cleanup

- [ ] Record every credential source and validation.
- [ ] Record ACL/template/service changes.
- [ ] Remove created machine accounts, ACLs, services, and files.
- [ ] Re-read the modified object and compare with its baseline; preserve concurrent legitimate changes and original memberships/SPNs.
- [ ] Close assessment-only listeners/tunnels/logon sessions; leave real user caches and unrelated services/VSS snapshots intact.
- [ ] Coordinate certificate revocation and credential/key remediation; file deletion is not credential invalidation.
- [ ] Capture BloodHound path screenshots.
- [ ] Write the walkthrough while it is fresh.
- [ ] Record each starting identity, required right, destination operation, evidence reference, detection opportunity, and owner-confirmed cleanup outcome.

## Stop conditions

- You have the flag/objective and domain compromise evidence.
- The next step would be destructive or outside scope.
- You are repeating the same failed technique without new information.
- A lockout, endpoint instability, unexpected policy impact, or owner request triggers the agreed abort condition.

## References

- [BloodHound docs](https://bloodhound.readthedocs.io/)
- [The Hacker Recipes — AD](https://www.thehacker.recipes/ad/)
- [HackTricks — AD methodology](https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/index.html)
- [SpecterOps — BloodHound documentation](https://bloodhound.specterops.io/)
- [buduboti — AD Enumeration & Attacks](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/20.%20Active%20Directory%20Enumeration%20%26%20Attacks.md)
- [Cavementech — AD enumeration](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/ad-enumeration)
- [Cavementech — ACL abuse tactics](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/access-control-list-acl-abuse-primer/acl-abuse-tactics)
- [Cavementech — AD CS attacks](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/active-directory-certificate-services-ad-cs-attacks)

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
| Authentication relay | ntlmrelayx.py | Forward one live NTLM authentication exchange to an approved reachable service; a saved NetNTLM response is not a replayable relay session. |
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
