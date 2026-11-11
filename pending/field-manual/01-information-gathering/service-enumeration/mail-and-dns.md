---
title: "Mail, DNS, and Legacy Services"
description: "SMTP, POP3, IMAP, DNS, Kerberos, TFTP, and Finger enumeration with user-discovery and relay checks."
category: "Field Manual"
tags: ["field-manual", "cpts", "smtp", "dns", "kerberos", "enumeration"]
date: 2026-11-11
published: true
status: archive
---

# Mail, DNS, and Legacy Services

## SMTP (25, 465, 587)

### Cheatsheet

```bash
nmap -p25,465,587 -sV --script smtp-commands,smtp-open-relay,smtp-enum-users $IP
smtp-user-enum -M VRFY -U users.txt -t $IP
swaks --to user@target.htb --from test@target.htb --server $IP --ehlo test.htb --body "test"
```

| Command | Description |
|---|---|
| `telnet <FQDN/IP> 25` | Open an SMTP session with an interactive TCP client. |
| `openssl s_client -connect <FQDN/IP>:587 -starttls smtp` | Inspect the submission service after negotiating STARTTLS. |
| `openssl s_client -connect <FQDN/IP>:465` | Connect to SMTP using implicit TLS. |
| `sudo nmap 10.10.10.20 -p25 --script smtp-open-relay -v` | Display the relay-check results in detail. |

### Manual session

```bash
nc $IP 25
EHLO test.htb
VRFY root
EXPN staff
MAIL FROM:<test@test.htb>
RCPT TO:<user@target.htb>
DATA
Subject: test

test
.
QUIT
```

Additional commands inside an established SMTP session:

| Command | Description |
|---|---|
| `HELO test.htb` | Introduce the client without requesting ESMTP extensions. |
| `AUTH PLAIN` | Begin PLAIN authentication when advertised; credentials use base64, not encryption. |
| `RCPT TO:<user@target.htb> NOTIFY=success,failure` | Request delivery-status notifications when the server advertises DSN. |
| `RSET` | Abort the current mail transaction while keeping the connection open. |
| `NOOP` | Request a response without changing the current transaction. |

For an HTTP proxy that supports tunneling to SMTP, send `CONNECT 10.10.10.20:25 HTTP/1.0` followed by a blank line to the proxy first; enter SMTP commands only after a successful tunnel response.

### Methodology

- [ ] Banner and `EHLO` capabilities (`AUTH`, `STARTTLS`, `SIZE`).
- [ ] `VRFY` / `EXPN` / `RCPT TO` user enumeration.
- [ ] Open relay test to an external domain you control.
- [ ] Password spraying against discovered accounts (careful with lockout).
- [ ] Read local mailboxes if you get shell access (`/var/mail`, `/var/spool/mail`).
- [ ] Check for known version vulnerabilities (e.g. Exim, Sendmail).

### Notes

An open relay lets you send mail as the target, which is useful for phishing simulations but is not usually an exam objective. More often SMTP is a **username oracle**: different responses for valid/invalid recipients.

Port 465 is implicit TLS; 587 uses STARTTLS. `swaks --tls` for 587, `--tlsc` for 465.

### Postfix configuration clues

| Command | Description |
|---|---|
| `cat /etc/postfix/main.cf \| grep -v '#' \| sed -r '/^\s*$/d'` | Inspect the non-comment Postfix configuration with local file access. |

| Setting | Enumeration implication |
|---|---|
| `myhostname`, `mydestination` | Server identity and domains accepted for local delivery. |
| `mynetworks` | Networks that may receive trusted-client treatment in relay restrictions. |
| `mynetworks = 0.0.0.0/0` | Trusts all IPv4 clients; can permit open relay when used with `permit_mynetworks`. |
| `alias_maps`, `alias_database` | Local alias sources that may reveal users or forwarding destinations. |
| `home_mailbox` | Per-user mailbox location. |
| `smtpd_helo_restrictions` | Checks applied to the client's HELO/EHLO name. |

Confirm relay behavior from SMTP responses: trusting a network and accepting an external recipient are related configuration facts, not interchangeable observations.

## POP3 (110, 995)

```bash
nmap -p110,995 -sV --script pop3-capabilities,pop3-ntlm-info $IP
nc $IP 110
USER user
PASS password
STAT
LIST
RETR 1
QUIT
```

```bash
curl --url "pop3://$IP" --user "user:pass"
curl --url "pop3://$IP/1" --user "user:pass"
```

Look for cleartext credentials, mailbox contents, password-reset tokens, and internal information. Port 995 is implicit TLS; use `--ssl` with curl or `openssl s_client`.

### TLS and additional POP3 commands

| Command | Description |
|---|---|
| `openssl s_client -connect <FQDN/IP>:pop3s` | Inspect the certificate and interact with POP3 over implicit TLS on 995. |
| `openssl s_client -connect <FQDN/IP>:110 -starttls pop3` | Upgrade a plaintext POP3 connection with STLS. |

Inside the POP3 session:

| Command | Description |
|---|---|
| `CAPA` | List supported capabilities, including authentication and STLS support. |
| `DELE 1` | Mark message 1 for deletion; a successful QUIT commits deletions. |
| `RSET` | Clear deletion marks during the current transaction. |

## IMAP (143, 993)

```bash
nmap -p143,993 -sV --script imap-capabilities,imap-ntlm-info $IP
nc $IP 143
a1 LOGIN user password
a2 LIST "" "*"
a3 SELECT INBOX
a4 FETCH 1 BODY[]
a5 LOGOUT
```

```bash
curl --url "imap://$IP/" --user "user:pass"
curl --url "imap://$IP/INBOX;UID=1" --user "user:pass"
```

Mailboxes often contain credentials, internal hostnames, and attachments that reveal software versions. Search for `password`, `vpn`, `backup`, and `admin`.

### TLS and mailbox operations

| Command | Description |
|---|---|
| `curl -k -v 'imaps://<FQDN/IP>' --user '<user>:<password>'` | List mailboxes while displaying the TLS negotiation, certificate, and server greeting. |
| `openssl s_client -connect <FQDN/IP>:imaps` | Open an interactive IMAP-over-TLS session on 993. |
| `openssl s_client -connect <FQDN/IP>:143 -starttls imap` | Upgrade the IMAP connection with STARTTLS. |
| `sudo nmap 10.10.10.20 -sV -p110,143,993,995 -sC` | Compare POP3/IMAP capabilities and certificates across plaintext and TLS listeners. |

The cURL example uses `-k` for self-signed lab certificates. IMAP commands require a tag so that replies can be associated with requests; the examples below continue an authenticated session.

| Command | Description |
|---|---|
| `a6 LSUB "" "*"` | List subscribed mailboxes. |
| `a7 FETCH 1 ALL` | Retrieve message flags, internal date, size, and envelope metadata. |
| `a8 UNSELECT` | Leave the selected mailbox without expunging deleted messages, if supported. |
| `a9 CREATE "ToRead"` | Create a new mailbox. |
| `a10 RENAME "ToRead" "Important"` | Rename a mailbox. |
| `a11 DELETE "Important"` | Delete the named mailbox. |
| `a12 CLOSE` | Close a selected read-write mailbox and expunge messages marked `\Deleted`. |

`UNSELECT` takes no mailbox argument. Execute `CLOSE` only while a mailbox is selected. POP3 has no IMAP-style folder hierarchy.

### Dovecot configuration clues

| Setting | Enumeration implication |
|---|---|
| `auth_debug` | Authentication debug logging is enabled. |
| `auth_debug_passwords` | Debug logs may contain submitted passwords and authentication schemes. |
| `auth_verbose` | Failed authentication attempts and their reasons are logged. |
| `auth_verbose_passwords` | Authentication logs may include password values or representations. |
| `auth_anonymous_username` | Names the account used for the ANONYMOUS SASL mechanism. |

## DNS (53)

### Cheatsheet

```bash
dig +short A target.htb
dig +short MX target.htb
dig +short TXT target.htb
dig +short NS target.htb
dig AXFR @$NS target.htb
dnsrecon -d target.htb -t std,brt
dnsenum target.htb
gobuster dns -d target.htb -w subdomains.txt
```

| Command | Description |
|---|---|
| `dig NS target.htb @10.10.10.53` | Ask a specific server which nameservers are authoritative for the zone. |
| `dig CH TXT version.bind @10.10.10.53` | Query the optional BIND version entry in the CHAOS class. |
| `dig ANY target.htb @10.10.10.53` | Request available records at this name from the selected server. |
| `dig SOA target.htb @10.10.10.53` | Read zone ownership, serial, and refresh information. |
| `dig AXFR internal.target.htb @10.10.10.53` | Test a discovered internal zone's transfer policy separately from its parent. |
| `dig -x 10.10.10.20 @10.10.10.53` | Resolve an in-scope address through the chosen DNS server. |
| `dnsenum --dnsserver 10.10.10.53 --enum -p 0 -s 0 -o found_subdomains.txt -f /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt target.htb` | Enumerate and brute-force names with an explicit resolver and wordlist. |

Resolve a wordlist directly when a tool's output needs cross-checking:

```bash
while IFS= read -r sub; do
  dig "$sub.target.htb" @10.10.10.53 | grep -v ';\|SOA' | sed -r '/^\s*$/d' | grep -F "$sub.target.htb" | tee -a subdomains.txt
done < /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
```

`version.bind` may be absent or deliberately misleading. `ANY` returns only what that server will disclose for the queried name; it does not enumerate the whole zone. Parent and internal zones can have different AXFR permissions.

### Methodology

- [ ] A/AAAA, MX, TXT, NS, SOA, CNAME, SRV records.
- [ ] Zone transfer against every NS (`AXFR`, `IXFR`).
- [ ] Subdomain brute force with a good wordlist; compare wildcard responses.
- [ ] Reverse lookups on in-scope IPs (`dig -x`).
- [ ] DNS cache snooping (`dig @$IP internal.target.htb`).
- [ ] SRV records for AD: `_ldap._tcp.dc._msdcs`, `_kerberos._tcp`, `_gc._tcp`.
- [ ] DNSSEC/NSEC zone walking if enabled.

### Notes

Wildcard DNS makes brute force noisy. Filter by response size, status, and content. A zone transfer is rare but high value: it can dump every internal hostname in one request.

`dnsx -d target.htb -w subs.txt -a -resp` is a fast resolver for large lists.

### BIND configuration and zone files

| Command | Description |
|---|---|
| `cat /etc/bind/named.conf.local` | Read zone declarations and their backing filenames with local file access. |
| `cat /etc/bind/db.target.htb` | Inspect a forward zone file named in the configuration. |
| `cat /etc/bind/db.10.10.10` | Inspect a configured reverse zone file for PTR records. |

| Setting / record | Meaning |
|---|---|
| `allow-query` | Clients allowed to query the server. |
| `allow-recursion` | Clients allowed to request recursive resolution. |
| `allow-transfer` | Clients allowed to receive zone transfers. |
| `zone-statistics` | Enables collection of per-zone statistics. |
| `A`, `AAAA` | IPv4 and IPv6 addresses. |
| `CNAME` | Alias to another DNS name. |
| `PTR` | Reverse address-to-name mapping. |
| `MX`, `NS` | Mail exchangers and authoritative nameservers. |
| `TXT` | Text records, including SPF and provider-verification information. |
| `SOA` | Primary nameserver, responsible contact, serial, and zone timers. |

Also inspect included `named.conf.options` and logging configuration when available. Use the filenames from zone declarations; the example `db.*` names are conventions, not mandatory paths.

## Kerberos (88)

```bash
nmap -p88 -sV --script krb5-enum-users --script-args krb5-enum-users.realm=target.htb $IP
kerbrute userenum --dc $DC_IP -d $DOMAIN users.txt
kerbrute passwordspray --dc $DC_IP -d $DOMAIN users.txt 'Summer2026!'
```

### Methodology

- [ ] Enumerate valid users via AS-REQ error differences.
- [ ] Check clock skew (`ntpdate`, `timedatectl`); Kerberos fails outside ~5 minutes.
- [ ] With credentials: request a TGT (`kinit`), list tickets (`klist`).
- [ ] Check for AS-REP roastable accounts (no pre-auth).
- [ ] Check for SPNs (Kerberoastable).
- [ ] Use `KRB5CCNAME` to pass a ccache between tools.

```bash
kinit $USER@$DOMAIN
klist
export KRB5CCNAME=FILE:/tmp/krb5cc_$(id -u)
```

## TFTP (69/udp)

```bash
nmap -sU -p69 --script tftp-enum $IP
tftp $IP
tftp> get filename
tftp> put localfile
```

TFTP has no authentication. Check for readable configuration files, backups, firmware, and writable directories. `atftp` gives better error messages and supports options.

At the `tftp>` prompt:

| Command | Description |
|---|---|
| `connect 10.10.10.20 69` | Select the remote server and port. |
| `status` | Display the connection, transfer mode, and timeout settings. |
| `verbose` | Toggle additional transfer output. |
| `quit` | Exit the client. |

TFTP has no directory-listing command; filenames must come from other evidence or a targeted filename list.

## Finger (79)

```bash
finger @$IP
finger user@$IP
nmap -p79 --script finger $IP
```

Legacy user enumeration. A valid user may return a real name, shell, home directory, and last login. Use discovered names to build username lists.

## R-services (512, 513, 514)

Legacy `rexec`, `rlogin`, and `rsh` trust `.rhosts`. Check whether a host trusts your source IP or a wildcard.

```bash
rlogin -l root $IP
rsh $IP id
```

These are rare outside old labs but appear in CPTS-style networks. If you find `.rhosts` with `+ +`, you have unauthenticated root.

### Trust files and logged-in users

| Command | Description |
|---|---|
| `sudo nmap -sV -p512,513,514 10.10.10.20` | Identify rexec, rlogin, and rsh listeners. |
| `cat /etc/hosts.equiv` | Inspect system-wide trusted host/user relationships with local access. |
| `cat ~/.rhosts` | Inspect trust relationships for the current account. |
| `rwho` | Display logged-in users from locally collected rwhod announcements. |
| `rusers -al 10.10.10.20` | Query remote login-session details through the rusers service. |

Trust-file entries normally use `host user` order, with `+` acting as a wildcard. The affected account is the owner of `.rhosts`; a wildcard in an ordinary user's file does not by itself grant root. PAM and daemon policy can add further restrictions. Rwhod announcements use UDP 513; rusers is a separate RPC service.

## Pitfalls

- Sending mail during an exam can be slow or blocked; confirm scope before testing relays.
- `VRFY` is often disabled; fall back to `RCPT TO` and response timing.
- DNS brute force against wildcard domains yields false positives.
- Kerberos depends on accurate time and correct FQDN/realm; use the DC as DNS.
- POP3/IMAP TLS versions differ; `openssl s_client -connect host:995` helps debug.

## References

- [HackTricks — SMTP](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-smtp/index.html)
- [HackTricks — DNS](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-dns.html)
- [HackTricks — Kerberos](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-kerberos-88/index.html)
- [PayloadsAllTheThings — DNS](https://github.com/swisskyrepo/PayloadsAllTheThings)
