---
title: "Network Management — SNMP, LDAP, IPMI, Rsync"
description: "Enumeration of management protocols that frequently expose credentials, host data, and unauthenticated file access."
category: "Field Manual"
tags: ["field-manual", "cpts", "snmp", "ldap", "ipmi", "rsync"]
date: 2026-11-11
published: true
status: archive
---

# Network Management Services

## SNMP (161/162 UDP)

### Cheatsheet

```bash
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt $IP
snmpwalk -v2c -c public $IP
snmp-check $IP -c public
nmap -sU -p161 --script snmp-info,snmp-sysdescr,snmp-interfaces,snmp-processes,snmp-netstat $IP
```

| Command | Description |
|---|---|
| `onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp.txt 10.10.10.20` | Test the broader SecLists SNMP community list. |
| `snmpwalk -v2c -c public 10.10.10.20 .1` | Walk from the ISO root, including accessible enterprise branches outside MIB-II. |
| `braa 'public@10.10.10.20:.1.3.6.*'` | Walk matching OIDs using a known community string. |
| `cat /etc/snmp/snmpd.conf \| grep -v '#' \| sed -r '/^\s*$/d'` | Inspect agent bindings, communities, users, and views with local file access. |

Quote Braa's wildcard so the shell passes it to the tool. Community names can follow host or environment naming patterns; a community accepted from one source address may be restricted from another.

### Methodology

- [ ] Discover the community string (`public`, `private`, `manager`, custom).
- [ ] Walk the full tree; don't stop at `system`.
- [ ] Extract users, processes, installed software, network interfaces, routes, ARP, and listening ports.
- [ ] Look for credentials in process arguments, scripts, and description fields.
- [ ] Check write access (`snmpset`) for configuration changes.
- [ ] SNMPv3: enumerate users and test auth/priv.

Useful OIDs:

| OID | Data |
|---|---|
| `1.3.6.1.2.1.1` | System description, contact, location |
| `1.3.6.1.2.1.25.1.6` | Running processes |
| `1.3.6.1.2.1.25.4.2.1.2` | Process names |
| `1.3.6.1.2.1.25.4.2.1.5` | Process paths |
| `1.3.6.1.2.1.25.6.3.1.2` | Installed software |
| `1.3.6.1.2.1.4.20` | IP addresses |
| `1.3.6.1.2.1.6.13.1.3` | Listening TCP ports |
| `1.3.6.1.2.1.1.4.0` | System contact |
| `1.3.6.1.2.1.1.5.0` | Configured system name |
| `1.3.6.1.2.1.1.6.0` | System location |
| `1.3.6.1.2.1.25.4.2.1.4` | Executable paths in HOST-RESOURCES-MIB |
| `1.3.6.1.4.1` | Vendor-specific enterprise branches |

```bash
snmpwalk -v2c -c public $IP 1.3.6.1.2.1.25.4.2.1.5
snmpwalk -v2c -c public $IP 1.3.6.1.2.1.25.6.3.1.2
```

SNMPv3:

```bash
snmpwalk -v3 -l authPriv -u $USER -a SHA -A "$AUTHPASS" -x AES -X "$PRIVPASS" $IP
```

In HOST-RESOURCES-MIB, `1.3.6.1.2.1.25.1.6` is the process **count**, `1.3.6.1.2.1.25.4.2.1.4` contains executable paths, and `1.3.6.1.2.1.25.4.2.1.5` contains process parameters.

### MIBs, versions, and access views

A MIB describes object names, types, access rights, and their numeric OIDs; it is not a copy of the device's current values. The agent returns only the objects allowed by the selected view.

| Setting | Enumeration implication |
|---|---|
| `agentaddress` | Interfaces and addresses on which the agent listens. |
| `view systemonly included .1.3.6.1.2.1.1` | Restricts an included view to the system branch. |
| `rocommunity public default -V systemonly` | Read-only community access constrained to the named view. |
| `rwcommunity <community> <source>` | Grants read/write access subject to the configured source and view restrictions. |
| `rwcommunity6 <community> <source>` | IPv6 read/write community access with its own restrictions. |
| `rwuser <user> noauth` | Allows a named SNMPv3 user read/write access without authenticated messages. |
| `rouser <user> authpriv -V systemonly` | Requires authenticated, encrypted SNMPv3 traffic and limits its view. |

SNMPv1 and v2c send community strings without encryption. SNMPv3's `noAuthNoPriv`, `authNoPriv`, and `authPriv` levels offer different protections; version 3 alone does not imply encryption. UDP 161 carries queries and management requests; UDP 162 normally receives asynchronous traps.

### Notes

SNMP is UDP; a silent response may mean a wrong community string or a firewall, not a closed port. `snmp-check` formats the output into readable sections.

## LDAP (389/636)

### Cheatsheet

```bash
ldapsearch -x -H ldap://$IP -s base namingcontexts
ldapsearch -x -H ldap://$IP -b "DC=target,DC=htb" "(objectClass=*)"
ldapwhoami -x -H ldap://$IP
ldapdomaindump -u "$DOMAIN\\$USER" -p "$PASS" $IP
windapsearch -d $DOMAIN --dc-ip $IP -u "$USER" -p "$PASS" --da
```

### Methodology

- [ ] Anonymous bind and root DSE (`namingcontexts`, `defaultNamingContext`).
- [ ] Base object and schema; identify AD vs OpenLDAP vs 389 Directory Server.
- [ ] Users, groups, computers, OUs, GPOs, trusts.
- [ ] Attributes that leak: `description`, `info`, `comment`, `userPassword`, `ms-Mcs-AdmPwd`.
- [ ] Password policy (`lockoutThreshold`, `minPwdLength`).
- [ ] ACLs and delegation (`nTSecurityDescriptor`).
- [ ] AD CS objects (`pKIEnrollmentService`, `msPKI-*`).

### Common queries

```bash
# All users
ldapsearch -x -H ldap://$IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(objectClass=user)" sAMAccountName cn description

# Groups and members
ldapsearch -x -H ldap://$IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(objectClass=group)" cn member

# Computers
ldapsearch -x -H ldap://$IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(objectClass=computer)" cn dNSHostName operatingSystem

# LAPS passwords (if readable)
ldapsearch -x -H ldap://$IP -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=target,DC=htb" "(ms-Mcs-AdmPwd=*)" ms-Mcs-AdmPwd
```

`ldapdomaindump` writes HTML/JSON/ grep-friendly files; useful for offline review. `windapsearch` has shortcuts: `--da`, `--admins`, `--unconstrained-users`, `--privileged-users`.

## IPMI (623 UDP)

### Cheatsheet

```bash
nmap -sU -p623 --script ipmi-version,ipmi-brute $IP
ipmitool -I lanplus -H $IP -U ADMIN -P ADMIN chassis status
```

### Methodology

- [ ] Version and cipher suite support.
- [ ] Default credentials (`ADMIN:ADMIN`, `admin:admin`, vendor defaults).
- [ ] Password hash disclosure via RAKP (CVE-2013-4786) — crack offline.
- [ ] Authenticated access: chassis control, SOL console, user list, FRU data.
- [ ] Reuse IPMI credentials against the host OS/AD.

```bash
ipmitool -I lanplus -H $IP -U $USER -P "$PASS" user list
ipmitool -I lanplus -H $IP -U $USER -P "$PASS" fru print
ipmitool -I lanplus -H $IP -U $USER -P "$PASS" sol activate
```

The RAKP hash can be captured with Metasploit's `auxiliary/scanner/ipmi/ipmi_dumphashes`, then cracked with Hashcat mode `7300`.

### BMC identification and factory accounts

| Product | Factory-account clue |
|---|---|
| Dell iDRAC | Older deployments commonly used `root:calvin`; newer systems can use unique passwords. |
| HP iLO | `Administrator` with a device-specific password; some older models used eight uppercase letters/digits. |
| Supermicro IPMI | Older deployments commonly used `ADMIN:ADMIN`; newer hardware can use unique passwords. |

The BMC is a separate management endpoint and may remain powered while the host OS is off. Correlate its web certificate, SSH/Telnet banner, vendor, and management IP with the server inventory. For complete Metasploit and offline-testing commands, see [[pending/field-manual/01-information-gathering/service-enumeration/remote-access#IPMI (623 UDP)|IPMI discovery and RAKP workflow]].

## Rsync (873)

### Cheatsheet

```bash
nmap -p873 --script rsync-list-modules $IP
rsync rsync://$IP/
rsync -av rsync://$IP/module/ ./module/
```

| Command | Description |
|---|---|
| `sudo nmap -sV -p873 10.10.10.20` | Identify the rsync daemon and advertised protocol version. |
| `nc -nv 10.10.10.20 873` | Open a raw rsync daemon connection for banner and module inspection. |
| `rsync -av --list-only rsync://10.10.10.20/dev` | List a module's contents and metadata without downloading files. |
| `rsync -av -e ssh user@10.10.10.20:/srv/dev/ ./dev/` | Transfer a remote directory over SSH rather than the rsync daemon. |
| `rsync -av -e 'ssh -p2222' user@10.10.10.20:/srv/dev/ ./dev/` | Use an SSH transport on a non-standard port. |

In the raw TCP session, echo the server's advertised greeting (for example `@RSYNCD: 31.0`), then send `#list` to request modules. The `host:/path` syntax selects a remote-shell transport; `rsync://host/module` addresses a daemon module.

### Methodology

- [ ] List modules; some require auth, some do not.
- [ ] Read every module; look for source code, backups, keys, configs.
- [ ] Test write access with a canary file.
- [ ] If a module maps to a web root or cron directory, upload a payload.
- [ ] Check `rsyncd.conf` if readable for `auth users`, `secrets file`, and paths.

```bash
rsync -av ./payload/ rsync://$IP/module/
rsync rsync://$USER@$IP/module/
```

Rsync can preserve ownership and permissions (`-a`), which is useful for planting SUID files if running as root on the server.

## Pitfalls

- SNMP community strings are case-sensitive.
- LDAP referrals can send queries to another DC; use `-o referral=no` if results are confusing.
- IPMI over UDP is often filtered; verify with the vendor tool, not only Nmap.
- Rsync module names are not paths; `rsync://host/` lists them.
- Management services often reuse the same credentials as the OS or domain.

## References

- [HackTricks — SNMP](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-snmp/index.html)
- [HackTricks — LDAP](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ldap.html)
- [HackTricks — IPMI](https://book.hacktricks.wiki/en/network-services-pentesting/623-udp-ipmi.html)
- [HackTricks — Rsync](https://book.hacktricks.wiki/en/network-services-pentesting/873-pentesting-rsync.html)
