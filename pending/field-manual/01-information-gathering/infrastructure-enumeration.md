---
title: "Infrastructure Enumeration & OSINT"
description: "Passive infrastructure mapping, Google/GitHub dorking, certificate transparency, and canary tokens for scope awareness."
category: "Field Manual"
tags: ["field-manual", "cpts", "osint", "recon", "infrastructure"]
date: 2026-11-11
published: true
status: archive
---

# Infrastructure Enumeration & OSINT

Passive first: learn as much as possible without touching the target, then confirm actively.

## Cheatsheet

| Goal | Command / source |
|---|---|
| DNS records | `dig +short A target.htb`, `dig MX`, `dig TXT`, `dig NS` |
| Zone transfer | `dig AXFR @$NS target.htb` |
| Certificate transparency | `curl -s "https://crt.sh/?q=%25.target.htb&output=json" \| jq -r '.[].name_value'` |
| Subdomains (passive) | `subfinder -d target.htb -all -silent` |
| Subdomains (brute) | `ffuf -u http://target.htb -H "Host: FUZZ.target.htb" -w subs.txt -fs 0` |
| Historical URLs | `waybackurls target.htb`, `gau target.htb` |
| Tech fingerprint | `whatweb -a 3 https://target.htb` |
| Shodan (CLI) | `shodan search "hostname:target.htb"` |
| ASN / netblock | `whois -h whois.radb.net -- '-i origin AS12345'` |
| GitHub secrets | `github-search` queries, `trufflehog github --org=ORG` |
| Canary token | Create at `canarytokens.org`, place in a document, detect access |

## Passive infrastructure

### DNS

```bash
dig +short A target.htb
dig +short MX target.htb
dig +short TXT target.htb
dig +short NS target.htb
dig +short SRV _ldap._tcp.dc._msdcs.target.htb
dig AXFR @ns1.target.htb target.htb
```

TXT records leak SPF, verification tokens, and internal service names. SRV records reveal domain controllers and Kerberos services.

| Command | Description |
|---|---|
| `nslookup target.htb` | Resolve the domain with the system resolver. |
| `nslookup -query=PTR 10.10.10.20` | Look up the hostname associated with an IP address. |
| `nslookup -query=ANY target.htb` | Request the records the resolver is willing to return for this name. |
| `nslookup -query=TXT target.htb` | Inspect verification, SPF, and other text records. |
| `nslookup -query=MX target.htb` | Identify mail exchangers and their priorities. |
| `dig A target.htb @10.10.10.53` | Query a specific nameserver for IPv4 addresses. |
| `dig AAAA target.htb @10.10.10.53` | Query a specific nameserver for IPv6 addresses. |
| `dig ANY target.htb @10.10.10.53` | Ask a selected server for records at the zone apex. |
| `dig -x 10.10.10.20 @10.10.10.53` | Perform a reverse lookup using the selected nameserver. |
| `dig SOA target.htb @10.10.10.53` | Obtain the primary nameserver, administrative contact, and zone serial. |

`ANY` is not a zone dump; repeat explicit record-type queries when responses are minimal. In an SOA contact such as `hostmaster.target.htb.`, the first unescaped dot represents `@`.

### Certificate transparency

```bash
curl -s "https://crt.sh/?q=%25.target.htb&output=json" \
  | jq -r '.[].name_value' | sort -u
```

Certificates often expose staging, VPN, mail, and internal hostnames that DNS brute forcing misses.

| Command | Description |
|---|---|
| `curl -s "https://crt.sh/?q=%25.target.htb&output=json" \| jq -r '.[] \| "\(.name_value)\n\(.common_name)"' \| sort -u > subs.txt` | Save both SAN entries and common names for later resolution. |

Remove wildcard prefixes and unrelated names before treating `subs.txt` as a host list.

### Search engines and archives

- Google/Bing dorking (below).
- [Shodan](https://www.shodan.io/), [Censys](https://search.censys.io/), [FOFA](https://fofa.info/): exposed services, TLS certs, banners.
- [SecurityTrails](https://securitytrails.com/), [VirusTotal](https://www.virustotal.com/): passive DNS history.
- [Wayback Machine](https://web.archive.org/): old endpoints, JS, comments, credentials.
- [urlscan.io](https://urlscan.io/): observed requests, third-party scripts, vhosts.

| Command | Description |
|---|---|
| `waybackurls -dates https://target.htb > waybackurls.txt` | Save historical URLs with archive timestamps. |
| `theHarvester -d target.htb -b crtsh -f crtsh-target.htb` | Collect names from one selected backend and save a report. |

Run the installed theHarvester backends named in `sources.txt`, one backend per line:

```bash
while IFS= read -r source; do
  theHarvester -d target.htb -b "$source" -f "${source}-target.htb"
done < sources.txt
```

Backend names and API-key requirements depend on the installed version; examples include `crtsh`, `hackertarget`, `otx`, `urlscan`, and `virustotal`.

### ASN and netblocks

```bash
whois -h whois.radb.net -- '-i origin AS12345' | grep -E '^route'
amass intel -asn 12345
```

Scope is usually IP/domain-bound; confirming the netblock prevents both misses and out-of-scope testing.

| Command | Description |
|---|---|
| `whois target.htb` | Inspect registrar, registration dates, nameservers, and available registrant details. |
| `for h in $(cat subs.txt); do host "$h" \| grep 'has address' \| cut -d' ' -f1,4; done` | Associate resolved hostnames with IPv4 addresses, including canonical-name targets. |
| `for h in $(cat subs.txt); do host "$h" \| grep 'has address' \| cut -d' ' -f4; done \| sort -u > ip-addresses.txt` | Build a deduplicated address inventory from discovered names. |
| `for ip in $(cat ip-addresses.txt); do shodan host "$ip"; done` | Retrieve Shodan's existing service information for each address. |

Resolution alone does not establish ownership: retain CNAMEs and hosting-provider details alongside the address inventory. TXT verification entries and SPF `include:` domains can identify Microsoft 365, Google Workspace, Atlassian, Mailgun, or remote-management providers.

## Google dorking

| Goal | Query |
|---|---|
| Indexed pages on a domain | `site:target.htb` |
| Excluded pages | `site:target.htb -inurl:login` |
| Specific file types | `site:target.htb filetype:pdf OR filetype:xlsx OR filetype:sql` |
| Directory listings | `site:target.htb intitle:"index of"` |
| Config/env leaks | `site:target.htb ext:env OR ext:ini OR ext:conf` |
| Error pages | `site:target.htb "Fatal error" OR "stack trace"` |
| Login/admin panels | `site:target.htb inurl:admin OR inurl:login` |
| Exposed docs | `site:target.htb intitle:"confidential" OR intitle:"internal"` |
| Credentials in URLs | `site:target.htb inurl:password OR inurl:token` |
| Third-party mentions | `"target.htb" -site:target.htb` |

## GitHub dorking

Search code, issues, wikis, commits, and gists.

| Goal | Query |
|---|---|
| Org repositories | `org:TARGETORG` |
| Secrets in code | `org:TARGETORG "password"` |
| API keys | `org:TARGETORG "api_key" OR "apikey"` |
| Internal hosts | `org:TARGETORG ".target.htb"` |
| CI configs | `org:TARGETORG filename:.env` |
| Deleted/historical | Search commit hashes, old repo names, contributors |
| Employee repos | `"target.htb" in:readme` |

```bash
trufflehog github --org=TARGETORG --only-verified
gitleaks detect --source repo --report-format json
```

Always verify a secret is live and in scope before using it. Do not test third-party credentials.

## Canary tokens

Canary tokens are tripwires: a unique URL, DNS name, document, or AWS key that alerts when accessed.

Use cases in an assessment:

- Place a token in a sensitive-looking share/file you create.
- Detect whether a client's monitoring or another tester accesses it.
- Verify data-flow assumptions (e.g. does this uploader fetch remote URLs?).

```text
https://canarytokens.org/generate
```

Record the token and alert channel in your notes. Never place tokens on systems you do not own or have written permission to modify.

## Active confirmation

```bash
# Resolve all discovered names
for h in $(cat subs.txt); do getent hosts "$h" || echo "NXDOMAIN $h"; done

# Vhost fuzzing
ffuf -u http://$IP -H "Host: FUZZ.target.htb" -w subs.txt -fs 1234

# Web fingerprint
whatweb -a 3 http://target.htb
```

| Command | Description |
|---|---|
| `curl -I http://target.htb` | Inspect response headers without downloading the response body. |
| `wafw00f -v https://target.htb` | Fingerprint a web application firewall. |
| `cat subs.txt \| aquatone -out ./aquatone -screenshot-timeout 1000` | Capture screenshots of discovered web hosts. |
| `nslookup -type=AXFR target.htb ns1.target.htb` | Request a zone transfer using nslookup. |
| `gobuster dns -q -r 10.10.10.53 -d target.htb -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -p ./patterns.txt -o gobuster_target.htb.txt` | Enumerate DNS names using a selected resolver and a pattern file. |
| `curl -s http://10.10.10.20 -H 'Host: app.target.htb'` | Request a named virtual host directly from its IP address. |

Compare candidate virtual-host header lengths against an unconfigured hostname:

```bash
while IFS= read -r vhost; do
  printf '%s ' "$vhost"
  curl -s -I http://10.10.10.20 -H "Host: ${vhost}.target.htb" | grep -i '^Content-Length:'
done < vhosts.list
```

## Pitfalls

- Passive results include stale, out-of-scope, and third-party infrastructure.
- Wildcard DNS makes every subdomain “resolve”; compare response sizes and content.
- Certificate SANs may include internal names that do not resolve externally.
- Google/GitHub results can be years old; verify before exploiting.
- A leaked key may belong to a production third party — stop and check scope.

## References

- [HackTricks — OSINT](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/external-recon-methodology/index.html)
- [OWASP — Information Gathering](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/)
- [Canary Tokens](https://canarytokens.org/)
- [crtsh](https://crt.sh/)

## Cloud resource discovery

| Query | Description |
|---|---|
| `intext:"target" inurl:amazonaws.com` | Find indexed AWS-hosted resources mentioning the organization. |
| `intext:"target" inurl:blob.core.windows.net` | Find indexed Azure Blob Storage resources. |
| `intext:"target" inurl:storage.googleapis.com` | Find indexed Google Cloud Storage resources. |

Inspect page source for image, JavaScript, and stylesheet origins that point to object storage. Search organization abbreviations as well as the full name. Domain.Glass provides infrastructure context; GrayHatWarfare supports bucket and filename searches across cloud providers.

## Staff and technology clues

| Public evidence | Enumeration lead |
|---|---|
| LinkedIn/Xing employees and job advertisements | Names, roles, username patterns, and the likely operating systems and databases. |
| Flask, Django, Spring, or ASP.NET in job requirements | Framework-specific routes, configuration filenames, and deployment conventions. |
| Atlassian, CI, Git, SVN, or Perforce experience | Collaboration portals, build services, and source-control infrastructure. |
| Employee GitHub projects and commit history | Email naming conventions, internal hostnames, and application dependencies. |

Treat a job requirement as a technology lead, then confirm it through DNS, application responses, or service fingerprints.

## Legacy Sonar API queries

These reference endpoints require a working Sonar/Omnisint service; a failed request is not evidence that a name or address has no records.

| Command | Description |
|---|---|
| `curl -s https://sonar.omnisint.io/subdomains/target.htb \| jq -r '.[]' \| sort -u` | Retrieve subdomains for a domain. |
| `curl -s https://sonar.omnisint.io/tlds/target \| jq -r '.[]' \| sort -u` | Retrieve matching names across top-level domains. |
| `curl -s https://sonar.omnisint.io/all/target \| jq -r '.[]' \| sort -u` | Retrieve all matching names across TLDs. |
| `curl -s https://sonar.omnisint.io/reverse/10.10.10.20 \| jq -r '.[]' \| sort -u` | Retrieve reverse-name information for an IP address. |
| `curl -s https://sonar.omnisint.io/reverse/10.10.10.0/24 \| jq -r '.[]' \| sort -u` | Retrieve reverse-name information for a CIDR range. |

## Web content discovery

| Command | Description |
|---|---|
| `ffuf -recursion -recursion-depth 1 -u http://10.10.10.20/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-small-directories-lowercase.txt` | Discover directories with one level of recursive enumeration. |
| `ffuf -w ./folders.txt:FOLDERS,./wordlist.txt:WORDLIST,./extensions.txt:EXTENSIONS -u http://target.htb/FOLDERS/WORDLISTEXTENSIONS` | Combine folder, basename, and extension wordlists into candidate paths. |

Include the leading dot in extension entries such as `.php` or `.bak`.
