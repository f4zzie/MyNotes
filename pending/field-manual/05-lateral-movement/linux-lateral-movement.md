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

Start with the actual source user/host, approved destination, and required operation. `TARGET_HOST`, `TARGET_USER`, `KEY_FILE`, `KEYTAB`, `PRINCIPAL`, and `CCACHE` must come from accessible, authorised evidence—not another lab's paths. For AD-integrated hosts, use the realm/DC context from [[pending/field-manual/01-information-gathering/active-directory-enumeration#Establish the collection context|AD enumeration]].

Set `WORDLIST` to a reviewed local candidate file, `AGENT_SOCKET` to the exact approved session socket, and `ASSESSMENT_CCACHE` to a separate unique path in protected storage. `RECOVERED_PASSWORD` belongs to the selected account/service only. For a tunnel, independently set `PIVOT_USER`, `PIVOT_HOST`, `INTERNAL_HOST`, and `TARGET_IP` from the approved transport plan; service hostnames and numeric routing addresses are not interchangeable Kerberos identities. An absent/undefined input is a reason to stop and establish it, not to run a command with an empty argument.

| Material / relationship | Next bounded check | Important limit |
|---|---|---|
| SSH private key | One named user/host with public-key authentication | File possession does not prove the destination accepts that key |
| Forwarded SSH agent | List accessible key fingerprints, then one approved destination | Socket access offers signing operations, not private-key extraction |
| Kerberos ccache | Principal/SPN/lifetime inspection and one service operation | Time-limited tickets; a service ticket is not necessarily a TGT |
| Keytab | Inspect principal/key versions, then request one TGT into a separate cache | Long-term keys, not already-issued tickets; machine identity is not a human administrator |
| Shared configuration/storage | Specific accessible file and its account/service mapping | Credential scope and destination authorisation remain separate |

Keep recovered keys, caches, and credentials in protected assessment storage. Do not turn a single host lead into a recursive all-user secret collection or a subnet-wide reuse sweep.

## SSH keys

```bash
find "$HOME/.ssh" /opt -type f \( -name id_rsa -o -name id_ed25519 \) -ls 2>/dev/null
ls -ld "$HOME/.ssh"
ssh-keygen -F "$TARGET_HOST" -f "$HOME/.ssh/known_hosts"
```

Inspect only the relevant accessible key/configuration. An unencrypted private key is a candidate authentication method, not proof of login: the remote user's `authorized_keys`, key options, account policy, and server algorithms must accept it. For an approved encrypted-key recovery, process a copy offline:

```bash
ssh2john "$KEY_FILE" > selected-key.hash
john --wordlist="$WORDLIST" selected-key.hash
ssh -o IdentitiesOnly=yes -o PreferredAuthentications=publickey -i "$KEY_FILE" "$TARGET_USER@$TARGET_HOST" 'id; hostname'
```

Use a protected copy with suitable file permissions and verify the server host-key fingerprint through the approved channel. `IdentitiesOnly=yes` avoids offering unrelated agent keys; specifying public-key authentication avoids falling through to an unplanned password attempt. `known_hosts` identifies previously known hosts/keys, **not usernames**; hashed entries need targeted lookup, and a stale record does not prove the host is in scope or currently reachable. SSH config/history may provide usernames separately.

Do not append a key to a production user's `authorized_keys` as a default validation step. If a write is specifically approved, preserve the original content/options/permissions, add one uniquely identified assessment key, test the intended operation, and remove only that introduced entry afterward.

## SSH agent forwarding

If a user forwarded their agent (`ssh -A`), the socket is available in the environment:

```bash
printenv SSH_AUTH_SOCK
ssh-add -l
```

An accessible forwarded agent can sign authentication requests using its loaded keys. For a specifically approved other-user socket assessment, use the exact socket discovered in that session:

```bash
SSH_AUTH_SOCK="$AGENT_SOCKET" ssh-add -l
SSH_AUTH_SOCK="$AGENT_SOCKET" ssh -o PreferredAuthentications=publickey "$TARGET_USER@$TARGET_HOST" 'id; hostname'
```

Socket access depends on permissions/session context; root is one possible route, not a property of agent forwarding itself. The agent does not reveal the private key, and the destination still needs to accept a loaded public key. Confirmation prompts, agent expiry, hardware-backed keys, and destination-constrained agents can limit use. Do not unload someone else's keys, kill their agent, or enable forwarding globally as cleanup/troubleshooting. Prefer `ProxyJump` over forwarding an agent to an untrusted jump host when only transport is needed.

## SSH config and history

```bash
ssh -G "$TARGET_HOST"
stat "$HOME/.ssh/config"
```

`ssh -G` prints effective client configuration without establishing a login, including host, user, port, identity, and jump/proxy choices. Review a specific authorised config/history file when needed; histories can contain passwords/tokens, so do not export or publish them wholesale. Check that a configured `ProxyCommand`/jump host is itself approved and that transport discovery does not silently expand the target scope.

## Kerberos

```bash
realm list
printenv KRB5CCNAME
klist
klist -A
```

Inspect the represented principal, realm, TGT/service tickets, and lifetime. Cache implementations include FILE, DIR, KCM, and KEYRING; a non-FILE cache is not automatically a transferable Impacket file. Use a protected copy of one approved FILE cache:

```bash
export KRB5CCNAME="$CCACHE"
klist
impacket-smbclient -k -no-pass "$DOMAIN/$TARGET_USER@$TARGET_HOST"
```

For a selected readable keytab, request a TGT into a **separate** assessment cache:

```bash
klist -k -t "$KEYTAB"
kinit -c "$ASSESSMENT_CCACHE" -k -t "$KEYTAB" "$PRINCIPAL"
klist -c "$ASSESSMENT_CCACHE"
```

Keytabs hold long-term principal keys. `klist -k` lists principal/key-version metadata; it does **not** extract hashes or recover a password. `kinit -k -t` uses a listed principal's current key to obtain new tickets. `/etc/krb5.keytab` commonly represents the Linux machine account, and an automatically managed machine/gMSA key is generally not a dictionary-cracking target. Key export is a separate sensitive operation with its own scope.

For Linux → AD movement, distinguish credential material from routing: domain DNS/service FQDNs, clock alignment, KDC reachability, service SPNs, and authorisation must all work. An NT hash can support NTLM PtH or RC4 Kerberos only where permitted; an AES key is not an NT hash. Use current Samba `--use-kerberos=required -N` for a Samba client, and Impacket `-k -no-pass` for an Impacket client. Full keytab/cache inspection, conversion, and TCP-only pivot details are in [[pending/field-manual/03-exploitation/active-directory-credential-attacks#Pass-the-Ticket from Linux|Linux PtT]].

| Failure | First distinction |
|---|---|
| `KRB_AP_ERR_SKEW` | Assessment host/DC time difference |
| Expired ticket or stale key version | Ticket lifetime, account rotation, selected cache/keytab principal |
| Unknown service principal | FQDN/SPN, realm routing, and canonicalisation—not automatically a bad password |
| Valid ticket but access denied | Intended principal's resource rights, account restrictions, and ticket checks |
| KCM cache works with one client but not Impacket | Cache backend/export support rather than principal privilege |

## Credential reuse

- Approved readable application/database configuration, with explicit source/account mapping.
- Same local admin password across hosts.
- SSH keys copied to multiple servers.
- Ansible inventory/vault credentials.
- Docker registry credentials.
- CI/CD tokens with repository access.

Select one documented destination/account pair, not every service on every host:

```bash
ssh "$TARGET_USER@$TARGET_HOST" 'id; hostname'
nxc ssh "$TARGET_HOST" -u "$TARGET_USER" -p "$RECOVERED_PASSWORD"
```

These are alternative validations. SSH prompts where password authentication is permitted; a recovered application/database password need not be a valid OS/domain credential. Lockout/throttling, MFA, and login restrictions still apply. Keep the actual recovered value out of shell history, public notes, and command transcripts.

## Shared storage and services

- NFS home directories → read keys/history.
- SMB shares mounted on Linux (`mount.cifs`) → credentials in `/etc/fstab`.
- Databases with linked servers.
- Docker socket (`/var/run/docker.sock`) → host access.
- Kubernetes service account tokens.

Use `findmnt` to identify existing mounts and inspect the relevant export/share permissions before reading a specific credential lead. NFS root-squash, UID mapping, Kerberos-secured mounts, and file ACLs can prevent the assumed access. Docker sockets, registry credentials, and Kubernetes tokens lead to different host/registry/API boundaries; validate the token's intended service, scope, and permitted operations instead of treating them as generic root credentials.

## Pivoting from Linux

```bash
ssh -N -D 127.0.0.1:1080 -o ExitOnForwardFailure=yes "$PIVOT_USER@$PIVOT_HOST"
ssh -N -L "127.0.0.1:8080:$INTERNAL_HOST:80" -o ExitOnForwardFailure=yes "$PIVOT_USER@$PIVOT_HOST"
ssh -N -R '127.0.0.1:4444:127.0.0.1:4444' -o ExitOnForwardFailure=yes "$PIVOT_USER@$PIVOT_HOST"
```

Use `proxychains` for tools that do not support SOCKS natively:

```bash
proxychains4 nmap -sT -Pn -n -p 22,80,445 "$TARGET_IP"
```

These are alternative foreground tunnels with loopback-only listener bindings, not three commands to run together. A reverse forward listens on the SSH-server side; its destination is reached from the client side. SOCKS/Proxychains primarily carries supported TCP connect calls, not raw SYN/ICMP or ordinary UDP. Test one known service first and do not scan a whole new subnet simply because the tunnel is connected. See [[pending/field-manual/05-lateral-movement/pivoting-and-tunneling|Pivoting and tunneling]].

## Cleanup

- Remove only assessment-added authorised-key entries and restore their recorded options/permissions.
- Close the exact assessment SSH sessions/listeners; do not kill another user's agent or unrelated SSH connections.
- Retain or remove only assessment-created key/cache copies under the evidence policy; leave live user caches/keytabs intact.
- Restore only cron/service/configuration changes explicitly introduced by the assessment.
- Record source and destination identity, key fingerprint or credential evidence reference, protocol, successful operation, and owner-confirmed restoration.

## References

- [HackTricks — Linux lateral movement](https://book.hacktricks.wiki/en/linux-hardening/linux-post-exploitation/index.html)
- [HackTricks — SSH](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ssh.html)
- [Impacket](https://github.com/fortra/impacket)
- [OpenSSH — ssh client and forwarding](https://man.openbsd.org/ssh)
- [MIT Kerberos — klist](https://web.mit.edu/kerberos/krb5-latest/doc/user/user_commands/klist.html)
- [MIT Kerberos — kinit](https://web.mit.edu/kerberos/krb5-latest/doc/user/user_commands/kinit.html)
- [Cavementech — Pivoting from Linux to Active Directory](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/pivoting-from-linux-to-active-directory)
- [Cavementech — Linux PtT](https://notes.cavementech.com/pentesting-quick-reference/active-directory-pentesting/active-directory/post-compromise/pass-attacks/pass-the-ticket/pass-the-ticket-ptt-from-linux)
- [buduboti — Password Attacks](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/17.%20Password%20Attacks.md)

These independently written workflows retain the public references' key/cache/SSH concepts while replacing lab-specific paths and credentials with authorised assessment inputs.
