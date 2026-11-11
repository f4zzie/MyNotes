---
title: "Service Enumeration"
description: "Port-driven enumeration playbook for the services most common in CPTS labs and internal networks."
category: "Field Manual"
tags: ["field-manual", "cpts", "enumeration", "services"]
date: 2026-11-11
published: true
status: archive
---

# Service Enumeration

Enumeration is not “run the tool named after the port.” For each service, answer:

1. What product and version is it?
2. What authentication does it require, and can it be bypassed?
3. What data or files can I read or write?
4. What does it trust (files, network, other services, domain accounts)?
5. What known vulnerability family applies to this version/configuration?

## Port map

| Port | Service | Note |
|---|---|---|
| 20/tcp | FTP active data | Data connections originate here in active mode; control uses 21/tcp |
| 21 | FTP | Anonymous, writable roots, vsftpd backdoor |
| 22 | SSH | Keys, weak creds, forwarding, agent hijack |
| 23/tcp | Telnet | Cleartext remote login; sometimes exposed on BMCs |
| 25/465/587 | SMTP | User enum, open relay, password reset abuse |
| 53 | DNS | Zone transfer, subdomains, cache snooping |
| 69/udp | TFTP | Unauthenticated file read/write |
| 79 | Finger | User enumeration |
| 88 | Kerberos | User enum, AS-REP/Kerberoast |
| 110/995 | POP3 | Mailbox access, creds |
| 111/2049 | NFS/RPC | Exports, `no_root_squash` |
| 135/tcp + dynamic RPC | WMI/DCOM | Endpoint mapper followed by negotiated RPC ports; wmiexec also uses SMB |
| 137/udp, 138/udp | NetBIOS | Name service and datagrams; complement SMB session enumeration |
| 139/445 | SMB | Shares, null sessions, relay, AD |
| 143/993 | IMAP | Mailbox access |
| 161/162/udp | SNMP | Community strings, system data |
| 389/636 | LDAP | Directory data, AD |
| 512–514 | R-services | Legacy trust, `.rhosts` |
| 513/udp | Rwho | Logged-in user announcements, distinct from rlogin on 513/tcp |
| 623/udp | IPMI | Default creds, password hash leak |
| 873 | Rsync | Unauthenticated modules |
| 1433/1434/2433 | MSSQL | SQL access, `xp_cmdshell`, linked servers |
| 1521 | Oracle TNS | SID, default accounts, `odat` |
| 2049 | NFS | See above |
| 3306 | MySQL | SQL access, file read/write |
| 3389 | RDP | Interactive logon, pass-the-hash |
| 5985/5986 | WinRM | PowerShell remoting |
| 8080/8443 | HTTP(S) alt | Web apps, admin panels |

DNS uses both TCP and UDP 53; AXFR normally uses TCP. SQL Server Browser uses UDP 1434, while database instances may use dynamic TCP ports. RDP can also use UDP 3389. NFSv3 may require additional RPC services; NFSv4 normally uses TCP 2049 directly.

## Universal first pass

```bash
nmap -Pn -n -sC -sV -p- --min-rate 5000 -oA nmap/full $IP
nmap -Pn -n -sU --top-ports 50 -oA nmap/udp $IP
```

Then open the relevant note:

- [[pending/field-manual/01-information-gathering/service-enumeration/remote-access|FTP, SSH, RDP, WinRM]]
- [[pending/field-manual/01-information-gathering/service-enumeration/mail-and-dns|SMTP, POP3, IMAP, DNS, Kerberos, TFTP, Finger]]
- [[pending/field-manual/01-information-gathering/service-enumeration/smb-and-nfs|SMB, RPC, NFS]]
- [[pending/field-manual/01-information-gathering/service-enumeration/network-management|SNMP, LDAP, IPMI, Rsync]]
- [[pending/field-manual/01-information-gathering/service-enumeration/databases|MSSQL, Oracle TNS, MySQL]]
- [[pending/field-manual/01-information-gathering/service-enumeration/tools|Nmap, tcpdump, creds, Windows LOTL]]

### From footprint to protocol client

| Observation | Next check | Useful result |
|---|---|---|
| Anonymous FTP or guest SMB | List paths, inspect permissions, retrieve a small relevant file | Filenames, usernames, application roots, and configurations |
| NFS export | Mount and compare numeric UID/GID ownership | Client identity assumptions and export restrictions |
| Mail or remote-access TLS | Inspect the certificate and protocol capabilities | Internal FQDNs, organization names, authentication modes |
| DNS NS or internal zone | Query each authoritative server and test that zone's transfer policy | Additional hosts, services, and delegated zones |
| SNMP response | Walk accessible OIDs with the confirmed community | Processes, software, interfaces, and management contacts |
| Database listener | Identify the instance/SID, then authenticate with the native client | Accessible databases, roles, and deployment details |

The port's service label is a hint until version detection or a protocol response confirms it. Compare automated output with one direct client interaction, especially when a scanner reports blank credentials or conflicting product names.

## Default credentials

Always try a short, high-probability list before brute force:

| Service | Candidates |
|---|---|
| FTP | `anonymous:anonymous`, `ftp:ftp` |
| SSH | `root:root`, `admin:admin`, image defaults |
| SMB | `guest:''`, `administrator:password` |
| MSSQL | `sa:sa`, `sa:Password123`, blank |
| MySQL | `root:''`, `root:root` |
| Oracle | `scott:tiger`, `system:manager`, `sys:change_on_install` |
| IPMI | `ADMIN:ADMIN`, `admin:admin` |
| Dell iDRAC (older defaults) | `root:calvin` |
| HP iLO (model-dependent factory setup) | `Administrator`, unique device-label password |
| Tomcat | `tomcat:tomcat`, `admin:admin` |
| Jenkins | `admin:admin` |
| SNMP | `public`, `private`, `manager` |

Check the product's documentation and the lab's hints; do not hammer accounts and trigger lockouts.

## Evidence to capture

- Full `nmap -oA` output.
- Exact service banners (`nc`, `curl -I`, protocol greeting).
- Every credential and where it was found.
- Every readable/writable path or share.
- Version numbers suitable for `searchsploit`.

## References

- [HackTricks](https://book.hacktricks.wiki/)
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [SecLists](https://github.com/danielmiessler/SecLists)
- [Nmap NSE docs](https://nmap.org/nsedoc/)
