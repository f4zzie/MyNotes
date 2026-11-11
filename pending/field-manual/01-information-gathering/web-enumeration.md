---
title: "Web Enumeration"
description: "Generic web surface mapping: servers, vhosts, content, parameters, APIs, source, and tooling."
category: "Field Manual"
tags: ["field-manual", "cpts", "web", "enumeration", "fuzzing"]
date: 2026-11-11
published: true
status: archive
---

# Web Enumeration

## Cheatsheet

| Task | Command |
|---|---|
| Fingerprint | `whatweb -a 3 http://$IP` |
| Headers / methods | `curl -i -X OPTIONS http://$IP` |
| Nmap web scripts | `nmap -p80,443 --script http-title,http-headers,http-methods,http-enum,http-robots.txt,http-git $IP` |
| Directory fuzz | `ffuf -u http://$IP/FUZZ -w wordlist.txt -mc all -fs 0` |
| Recursive content | `feroxbuster -u http://$IP -w wordlist.txt -x php,html,txt,bak -r` |
| Vhost fuzz | `ffuf -u http://$IP -H "Host: FUZZ.target.htb" -w subs.txt -fs 0` |
| Parameter fuzz | `ffuf -u "http://$IP/page.php?FUZZ=test" -w params.txt -fs 0` |
| Git dump | `git-dumper http://$IP/.git ./repo` |
| Screenshots | `eyewitness --web -f urls.txt --no-prompt` |
| Vulnerability scan | `nikto -h http://$IP` |

## Methodology

- [ ] Identify the web server, framework, language, CMS, and version.
- [ ] Fetch `/`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `/.well-known/`.
- [ ] Check response headers, cookies, CORS, security headers, and allowed methods.
- [ ] Enumerate virtual hosts and subdomains; add them to `/etc/hosts`.
- [ ] Content discovery with extensions and backups (`.bak`, `.old`, `.zip`, `.git`, `~`).
- [ ] Enumerate parameters and values (`arjun`, `ffuf`, manual).
- [ ] Review JavaScript for hidden routes and APIs.
- [ ] Enumerate users, login, registration, password reset, and admin panels.
- [ ] Look for APIs (`/api`, `/v1`, GraphQL, Swagger/OpenAPI).
- [ ] Test error handling and stack traces.
- [ ] Screenshot every discovered app for later review.

## WHOIS

Use registration data to seed the DNS and infrastructure map, then corroborate it with current DNS answers.

| Field | Recon value |
|---|---|
| Registrar / WHOIS server | Registration provider and the registry to query |
| Creation, update, expiry dates | Domain history and recent administrative changes |
| Registrant / administrative organization | Ownership clues; privacy-redacted contacts may reveal little |
| Name servers | Starting points for authoritative DNS queries and zone-transfer checks |
| Domain status / DNSSEC | Registration locks and signing status; neither establishes application security |

```bash
export TARGET="inlanefreight.com"
whois "$TARGET"
```

## DNS record enumeration

| Record | What to record | Example query |
|---|---|---|
| `A` | IPv4 web/service addresses | `dig inlanefreight.com A` |
| `AAAA` | IPv6 addresses; a separate reachable surface | `dig inlanefreight.com AAAA` |
| `CNAME` | Aliases and provider/legacy hostnames | `dig www.inlanefreight.com CNAME` |
| `MX` | Mail exchangers and their priorities | `dig inlanefreight.com MX` |
| `NS` | Authoritative name servers | `dig inlanefreight.com NS` |
| `TXT` | SPF and service-verification/provider clues | `dig inlanefreight.com TXT` |
| `SOA` | Primary server, administrative mailbox, serial and timers | `dig inlanefreight.com SOA` |
| `SRV` | Service target, port, priority and weight | `dig _sip._tcp.inlanefreight.com SRV` |
| `PTR` | Reverse lookup from an address to a hostname | `dig -x "<IP>"` |

Query the supplied DNS server when a lab/private zone is absent from public DNS. A DNS lookup and an HTTP `Host`-header check answer different questions.

```bash
nslookup -query=A inlanefreight.com
nslookup -query=MX inlanefreight.com
nslookup -query=TXT inlanefreight.com
nslookup -query=PTR "<IP>"
dig @1.1.1.1 inlanefreight.com A
dig @"<IP>" inlanefreight.com A
dig -x "<IP>" @"<FQDN>"
dig +trace inlanefreight.com
dig +short inlanefreight.com
dig +noall +answer inlanefreight.com MX
dig inlanefreight.com ANY
```

`ANY` is often refused or minimized; query record types individually. In full `dig` output, retain the status, answer, TTL, responding server and timestamp. `NOERROR` with an empty answer is different from `NXDOMAIN`; timeouts and `SERVFAIL` also need separate interpretation. `+short` is convenient for pipelines but hides these distinctions.

### DNS zone transfers

AXFR requests a copy of a DNS zone, normally over TCP/53. Start with the discovered authoritative servers; a successful transfer can expose hosts absent from public navigation and CT logs.

```bash
dig inlanefreight.com NS +short
dig axfr @ns1.inlanefreight.com inlanefreight.com
dig axfr @"<IP>" inlanefreight.com
nslookup -query=AXFR inlanefreight.com ns1.inlanefreight.com
```

Replace `ns1.inlanefreight.com` with an actual authoritative server. Check each listed server because transfer policy can differ. A complete AXFR is bracketed by SOA records; a refusal or partial response is not an empty zone. Record names, address mappings, MX/SRV targets and delegated zones for follow-up.

## Server and technology fingerprinting

```bash
whatweb -a 3 http://$IP
curl -i http://$IP
curl -I https://$IP -k
nmap -p80,443 --script http-title,http-headers,http-methods,http-enum,http-robots.txt,http-git $IP
```

Check:

- `Server`, `X-Powered-By`, `Set-Cookie` names, `X-AspNet-Version`.
- 404/500 page branding and default pages.
- `/server-status`, `/phpinfo.php`, `/actuator`, `/debug`.
- TLS certificate SANs and CN.

### Correlate headers, page content and tool signatures

| Tool / signal | Use |
|---|---|
| `curl -I` | Inspect each redirect's `Server`, `Location`, `X-Redirect-By` and `Link` headers |
| `whatweb` | Match technology signatures; `-a 3` selects more aggressive checks and `-v` shows detail |
| Wappalyzer | Browser-based CMS, framework, analytics and JavaScript-library identification |
| BuiltWith / Netcraft | Cross-check technology and hosting history from third-party reports |
| `wafw00f` | Identify a possible WAF before interpreting blocked or uniform responses |
| `nikto -Tuning b` | Restrict Nikto to software-identification tests |

```bash
curl -I http://inlanefreight.com
curl -I https://inlanefreight.com
curl -I https://www.inlanefreight.com
whatweb -a 3 https://inlanefreight.com -v
wafw00f -v https://inlanefreight.com
nikto -h inlanefreight.com -Tuning b
```

For example, `X-Redirect-By: WordPress` followed by a `Link` containing `wp-json` is a useful CMS lead. Correlate banners with cookies, HTML metadata and asset paths: proxies can replace headers, and a product match alone does not prove a vulnerable version.

## Content discovery

```bash
ffuf -u http://$IP/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -mc all -fs 0
ffuf -u http://$IP/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-files.txt -e .php,.html,.txt,.bak -mc all -fs 0
feroxbuster -u http://$IP -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,html,txt,bak -r -d 3
gobuster dir -u http://$IP -w wordlist.txt -x php,html,txt -t 30
```

Important paths:

```text
/robots.txt
/sitemap.xml
/.git/
/.env
/config.php.bak
/backup.zip
/admin
/login
/register
/api
/swagger
/graphql
/actuator
/phpinfo.php
/server-status
```

## robots.txt and sitemaps

Fetch these per hostname: different vhosts can publish different path inventories. `robots.txt` describes crawler preferences, not access controls or proof that a listed path exists.

| Directive | Example | Enumeration use |
|---|---|---|
| `User-agent` | `User-agent: *` | Identify which crawler a group of rules addresses |
| `Disallow` | `Disallow: /private/` | Add otherwise unlinked directories to the path inventory |
| `Allow` | `Allow: /public/` | Identify explicit exceptions and content structure |
| `Crawl-delay` | `Crawl-delay: 10` | Suggested request spacing; support varies by crawler |
| `Sitemap` | `Sitemap: https://inlanefreight.com/sitemap.xml` | Seed discovery with published URL lists and child sitemaps |

```bash
curl -sS https://inlanefreight.com/robots.txt
curl -sS https://inlanefreight.com/sitemap.xml
```

Follow the actual `Sitemap` URLs rather than assuming a single filename. Record disallowed paths, then check their current status manually; login redirects and custom 404 pages can masquerade as discovered content.

## Well-known URIs

The `/.well-known/` namespace standardizes service metadata. Request individual resources even when the directory itself returns 403 or 404.

| Path | What it can reveal |
|---|---|
| `/.well-known/security.txt` | Security contacts, policy and related URLs |
| `/.well-known/change-password` | The application's password-change route, often through a redirect |
| `/.well-known/openid-configuration` | Identity-provider issuer, authentication/token endpoints, JWKS URL and supported capabilities |
| `/.well-known/assetlinks.json` | Associated Android applications and domain-to-app relationships |
| `/.well-known/mta-sts.txt` | Mail policy and MX patterns; normally served at `mta-sts.inlanefreight.com` |

```bash
curl -sS https://inlanefreight.com/.well-known/security.txt
curl -I https://inlanefreight.com/.well-known/change-password
curl -sS https://inlanefreight.com/.well-known/assetlinks.json
curl -sS https://mta-sts.inlanefreight.com/.well-known/mta-sts.txt
curl -sS https://inlanefreight.com/.well-known/openid-configuration | jq '{
  issuer, authorization_endpoint, token_endpoint, userinfo_endpoint, jwks_uri,
  scopes_supported, response_types_supported, id_token_signing_alg_values_supported
}'
```

Use the actual issuer's host and path when the application delegates login to another provider. Add the advertised endpoints and supported scopes to the application map; discovery metadata does not itself establish an authentication flaw.

## Certificate transparency logs

CT records expose certificate names, including SANs on old or expired certificates. They are useful candidate sources even when a name no longer resolves.

| Source | Use |
|---|---|
| [crt.sh](https://crt.sh/) | Domain/SAN lookup, certificate history and JSON export |
| [Censys](https://search.censys.io/) | Correlate certificate attributes with hosts and observed services |
| VirusTotal | Cross-check passive domain and infrastructure relationships |

```bash
curl -s 'https://crt.sh/?q=inlanefreight.com&output=json' \
  | jq -r '.[] | "\(.name_value)\n\(.common_name)"' | sort -u
curl -s 'https://crt.sh/?q=inlanefreight.com&output=json' \
  | jq -r '.[] | select(.name_value | contains("dev")) | .name_value' | sort -u
```

`name_value` can contain multiple newline-separated names. Split these into individual candidates and deduplicate them. Treat `*.dev.inlanefreight.com` as a naming clue, not a literal host to resolve. Resolve concrete names and verify their HTTP service before marking them live.

## Virtual hosts and subdomains

```bash
ffuf -u http://$IP -H "Host: FUZZ.target.htb" -w subs.txt -fs 1234
gobuster vhost -u http://target.htb -w subs.txt --append-domain
```

Without vhost enumeration you may only see the default site. Add hits to `/etc/hosts` and re-run content discovery per vhost.

### DNS subdomain discovery

| Approach | Source / tool | Validation |
|---|---|---|
| Passive discovery | CT logs, Censys, VirusTotal, search engines, `theHarvester` | Resolve names again; historical records may be stale |
| Active enumeration | AXFR, `dnsenum`, `gobuster dns` | Compare answers against a random-name wildcard baseline |
| Targeted wordlists | `dev`, `staging`, `blog`, `mail`, `admin`, plus observed naming patterns | Include relevant nested names and confirm the actual application |

```bash
dig +short recon-no-such-host-7f39.inlanefreight.com
dnsenum --enum inlanefreight.com -f /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -r
gobuster dns -q -r "<IP>" -d inlanefreight.com \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
  -o gobuster_inlanefreight.com.txt
```

`dnsenum -r` enables recursive subdomain discovery; `--enum` also enables additional enumeration work, including zone-transfer attempts. In `gobuster dns`, `-r` instead selects the resolver. Start with the 5,000-entry list when coverage is unknown, then expand with observed naming patterns. The source's `gobuster dns` recipe also supports `-p ./patterns.txt` for a prepared pattern file. A wildcard DNS answer is not enough to establish a distinct host.

### Host-header discovery and confirmation

DNS enumeration asks which names resolve. Vhost enumeration asks which names select a different application on a known server; a valid vhost can have no public DNS record. Name-based hosting uses `Host`, while IP-based and port-based hosting require checking the actual address and port combinations.

```bash
curl -s -I "http://<IP>" -H 'Host: recon-no-such-host-7f39.inlanefreight.com'
curl -s -I "http://<IP>" -H 'Host: dev.inlanefreight.com'
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
  -u "http://<IP>" -H 'Host: FUZZ.inlanefreight.com' -fs 612
gobuster vhost -u http://inlanefreight.com:81 \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt \
  --append-domain -o vhosts.txt
```

`612` is the source's example baseline size: replace it with the measured random-host response size, then compare status, length, title and redirects. A server may echo any supplied host into a redirect; inspect the body before accepting a hit. Map `inlanefreight.com` to the target IP before the Gobuster command; `--append-domain` needs a domain-based URL to construct useful names. For HTTPS, use the discovered hostname in the URL so TLS SNI selects the intended site as well as the HTTP `Host` header.

## Parameters

```bash
arjun -u http://$IP/page.php -m GET,POST
ffuf -u "http://$IP/page.php?FUZZ=test" -w params.txt -fs 0
```

Test parameters for reflection, type confusion, SQL errors, file paths, redirects, and template evaluation. Save the baseline response size/status.

## APIs

- `/api`, `/api/v1`, `/v2`, `/rest`, `/graphql`.
- Swagger/OpenAPI: `/swagger.json`, `/openapi.json`, `/api-docs`, `/docs`.
- Look for mass assignment, BOLA/IDOR, missing auth on internal endpoints.
- GraphQL: introspection query, then enumerate mutations and object access.

```bash
curl -s http://$IP/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{__schema{types{name}}}"}'
```

## Source and history

```bash
git-dumper http://$IP/.git ./repo
trufflehog filesystem ./repo
gitleaks detect --source ./repo
```

Also check `.DS_Store`, `.svn`, `.hg`, `web.config`, `appsettings.json`, and source maps.

## Search engine discovery

Use these in the search engine's query box. Combine operators to find specific routes and file families; a search index is neither complete nor necessarily current.

| Goal | Query |
|---|---|
| Inventory indexed pages | `site:inlanefreight.com` |
| Surface other hosts | `site:inlanefreight.com -site:www.inlanefreight.com` |
| Login and administration | `site:inlanefreight.com (inurl:login OR inurl:admin)` |
| Downloadable documents | `site:inlanefreight.com (filetype:pdf OR filetype:docx OR filetype:xls)` |
| Exact title phrase | `site:inlanefreight.com intitle:"confidential report"` |
| Workflow references | `site:inlanefreight.com intext:"password reset"` |
| Configuration filenames | `site:inlanefreight.com inurl:config.php` |
| Configuration extensions | `site:inlanefreight.com (ext:conf OR ext:cnf)` |
| Backup routes | `site:inlanefreight.com inurl:backup` |
| Database exports | `site:inlanefreight.com filetype:sql` |

Quotes match phrases, `OR` combines alternatives, and `-` removes a known noisy term or host. Record the result URL and date, then revalidate it. Operator support differs between engines; use web archives for historical content rather than depending on the source's legacy `cache:` examples.

## Web archives

| Artifact | How to use it |
|---|---|
| Wayback Machine snapshots | Compare old and recent navigation, application names and technology changes |
| Historical URLs | Recover removed paths, query-parameter names, subdomains and old file extensions |
| Archived HTML / JavaScript | Identify previous API routes, assets and linked hosts |
| Capture date | Distinguish a historical observation from a currently reachable resource |

```bash
waybackurls -dates inlanefreight.com > waybackurls.txt
```

Open `https://web.archive.org/web/*/https://inlanefreight.com/*` to select capture dates. Retain dated output as evidence, extract interesting routes and parameter names, and recheck the live application. The `-dates` output includes timestamps, so do not feed those entire lines directly into an HTTP scanner. Missing snapshots do not establish that a page never existed.

## Crawling

Crawlers follow discovered links; fuzzers guess paths. Start from the canonical URL and published sitemaps. Breadth-first traversal maps top-level coverage; depth-first traversal follows a particular branch further. Capture links, forms, HTML comments and metadata for later manual review.

| Tool | Enumeration role |
|---|---|
| Burp Suite Site map / crawler | Map browser traffic and linked content; automated crawler availability depends on edition |
| OWASP ZAP Spider | Discover linked resources and organize them in the Sites tree |
| Scrapy / ReconSpider | Extract structured reconnaissance data with a Python spider |
| Apache Nutch | Configurable crawler for larger collections of pages |
| Recon-ng | Combine module-based crawling and DNS/host discoveries in a recon workspace |

### Scrapy with ReconSpider

The reference uses the Academy ReconSpider v1.2 archive. Run setup in the Python environment chosen for the crawler:

```bash
pip3 install scrapy
wget -O ReconSpider.zip https://academy.hackthebox.com/storage/modules/144/ReconSpider.v1.2.zip
unzip ReconSpider.zip
python3 ReconSpider.py http://inlanefreight.com
jq -r '.links[]?, .js_files[]?, .external_files[]?' results.json | sort -u
jq '{form_fields, comments}' results.json
```

| `results.json` key | Review target |
|---|---|
| `links` | Internal routes and external relationships; classify by hostname |
| `js_files` | Scripts to review for routes, parameters and source-map references |
| `external_files` | Linked documents, downloads and other file resources |
| `form_fields` | Input names and the forms/endpoints that use them |
| `comments` | HTML comments, build hints and references absent from rendered navigation |
| `emails` | Published organizational contacts and naming conventions |
| `images`, `videos`, `audio` | Media URLs and otherwise overlooked content directories |

Preserve `results.json` before another run replaces it. An empty `form_fields` list is an extraction result, not proof that the application has no forms. JavaScript-rendered or authenticated routes may require browsing through a proxy; see [[pending/field-manual/01-information-gathering/web-app-enumeration#Web proxy enumeration|Web proxy enumeration]].

## Automating recon

| Framework | Best fit |
|---|---|
| FinalRecon | Combine headers, WHOIS, TLS, DNS, crawling, subdomains, directories and archive lookups |
| Recon-ng | Modular recon workflows with stored entities and repeatable module runs |
| `theHarvester` | Aggregate subdomains, hosts and public organizational information from selected sources |
| SpiderFoot | Correlate domains, IPs and other OSINT entities across data sources |
| OSINT Framework | Find relevant tools and data sources for the next information gap |

### FinalRecon

```bash
git clone https://github.com/thewhiteh4t/FinalRecon.git
cd FinalRecon
pip3 install -r requirements.txt
chmod +x ./finalrecon.py
./finalrecon.py --help
./finalrecon.py --headers --whois --url http://inlanefreight.com
./finalrecon.py --sslinfo --dns --sub --url https://inlanefreight.com
./finalrecon.py --crawl --wayback --url https://inlanefreight.com
./finalrecon.py --dir -w /usr/share/seclists/Discovery/Web-Content/common.txt \
  -e php,txt,xml -dt 10 -T 15 --url https://inlanefreight.com
```

| Option | Meaning in the reference's FinalRecon version |
|---|---|
| `--headers`, `--sslinfo`, `--whois` | Header, TLS certificate and registration data |
| `--dns`, `--sub` | DNS records and subdomain discovery |
| `--crawl`, `--wayback` | Linked resources and historical URLs |
| `--dir`, `-w`, `-e` | Directory discovery, wordlist and extensions |
| `-dt`, `-T` | Directory threads and request timeout |
| `-r`, `-d` | Follow redirects and select custom DNS servers |
| `-o`, `-cd` | Export format and export directory |
| `--ps`, `--full` | Port scan and full recon; broader than the selected-module examples above |

The reference shows v1.1.6 and exports under `~/.local/share/finalrecon/` by default. Confirm flags with the installed version's help, keep raw exports, and manually validate the new names and routes.

### Source-based collection and screenshots

Put one backend supported by the installed `theHarvester` version on each line of `sources.txt` (for example `crtsh` or `hackertarget`). Then keep separate result files per source:

```bash
export TARGET="inlanefreight.com"
while IFS= read -r source; do
  theHarvester -d "$TARGET" -b "$source" -f "${source}-${TARGET}"
done < sources.txt
cat subdomain.list | aquatone -out ./aquatone -screenshot-timeout 1000
```

Use a deduplicated hostname list for Aquatone and review its screenshots alongside response metadata. Merge CT, DNS, crawler and archive discoveries by hostname/URL while retaining which source produced each observation.

## Tooling

| Tool | Use |
|---|---|
| `ffuf` | Fast content/vhost/parameter fuzzing |
| `feroxbuster` | Recursive content discovery |
| `gobuster` | dir/dns/vhost modes |
| `arjun` | Parameter discovery |
| `nikto` | Quick server misconfiguration scan |
| `whatweb` | Technology fingerprint |
| `EyeWitness` | Bulk screenshots |
| `git-dumper` | Exposed `.git` recovery |
| `wpscan`, `joomscan`, `droopescan` | CMS-specific enumeration |
| `kiterunner` | API route discovery |

## Pitfalls

- Ignoring redirects (`-L`) and both HTTP/HTTPS.
- Wordlist mismatch: use a directory list for directories and a file list for files.
- Wildcard responses: filter by size, words, or lines.
- Forgetting custom ports (8080, 8443, 8000, 3000, 5000).
- Trusting a 403: try vhosts, path normalization, headers, and alternate methods.

## References

- [HackTricks — Web methodology](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-web/index.html)
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [SecLists](https://github.com/danielmiessler/SecLists)
- [ffuf](https://github.com/ffuf/ffuf)
- [HTB Academy — Information Gathering: Web Edition](https://academy.hackthebox.com/module/details/144)
- [crt.sh](https://crt.sh/)
- [IANA — Well-Known URIs](https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml)
- [Wayback Machine](https://web.archive.org/) and [waybackurls](https://github.com/tomnomnom/waybackurls)
- [FinalRecon](https://github.com/thewhiteh4t/FinalRecon)
- [Recon-ng](https://github.com/lanmaster53/recon-ng)
