---
title: "Enumeration Tools — Nmap, tcpdump, Credentials, Windows LOTL"
description: "Core scanners and data-capture tools, including living-off-the-land port scanning from Windows."
category: "Field Manual"
tags: ["field-manual", "cpts", "nmap", "tcpdump", "enumeration"]
date: 2026-11-11
published: true
status: archive
---

# Enumeration Tools

## Nmap

### Staged enumeration workflow

Keep discovery, port coverage, service identification, and vulnerability validation as separate steps. A port-number label is a database guess; the service might run on an unexpected port or return a misleading banner. The commands below run on the assessment host against one approved target, not through a SOCKS proxy.

```bash
TARGET_IP='192.0.2.20'
SCAN_DIR='./evidence/nmap'
mkdir -p "$SCAN_DIR"
nmap -sT -Pn -n --top-ports 100 --reason -oA "$SCAN_DIR/initial" "$TARGET_IP"
nmap -sT -Pn -n -p- -T3 --max-rate 100 --reason -oA "$SCAN_DIR/full-tcp" "$TARGET_IP"
```

The address is a documentation placeholder. Use `-Pn` when the approved host is known to exist but discovery is inconclusive; it does not bypass port filtering. The rate cap is an example agreed budget, not a universal safe rate. Preserve default adaptive timeouts/retries initially, especially over a VPN or an unreliable path. Run raw SYN or UDP scans with the required privileges only when that transport is appropriate.

Extract **confirmed open TCP ports** from the saved XML, then probe only those ports:

```bash
PORTS=$(python3 - "$SCAN_DIR/full-tcp.xml" <<'PY'
import sys
import xml.etree.ElementTree as ET
root = ET.parse(sys.argv[1]).getroot()
ports = sorted({int(port.attrib['portid']) for port in root.findall('.//port')
                if port.attrib.get('protocol') == 'tcp'
                and port.find('state').attrib.get('state') == 'open'})
print(','.join(map(str, ports)))
PY
)
if [ -n "$PORTS" ]; then
    nmap -sT -Pn -n -sV -p "$PORTS" --reason -oA "$SCAN_DIR/services" "$TARGET_IP"
fi
```

Follow an ambiguous result with that protocol's native client and retain its greeting, TLS identity, application response, or authentication behaviour. For selected UDP services, distinguish `open|filtered` from an application reply; a timeout is not service identification. Inspect `nmap --script-help SCRIPT_NAME` before adding named NSE checks. Neither `-sC`, `--script vuln`, nor a service-name wildcard guarantees a read-only test.

| Handoff | Evidence required |
|---|---|
| Discovery → port scan | Approved target set, path/interface, discovery limitations, and exclusions |
| Port scan → service enumeration | Transport, actual port, state/reason, scan time, and saved XML |
| Service → vulnerability assessment | Product/build evidence, configuration/authentication prerequisites, and relevant advisory |
| Finding → exploitation | Independent confirmation, exact input/service, permitted impact, and cleanup plan |

- [ ] Compare actual host/port sets after changing timing, not only the number of results.
- [ ] Recheck a surprising filtered/closed result at baseline timing before calling it a control.
- [ ] Validate high-port and nonstandard-service findings with the matching client.
- [ ] Keep source IP/interface, tool version, commands, exclusions, and scan artifacts together.
- [ ] Use [[pending/field-manual/05-lateral-movement/pivoting-and-tunneling#Transport limitations|the pivot's transport limits]] before applying these commands from another network segment.

### Scan option reference

| Option | Description |
|---|---|
| `-sn` | Perform host discovery without a port scan. |
| `-Pn` | Skip normal host discovery and treat targets as online; local-link ARP may still occur. |
| `-n` | Disable DNS resolution. |
| `-PE` | Use ICMP echo requests for discovery. |
| `--disable-arp-ping` | Disable implicit ARP/IPv6 neighbor-discovery host probes. |
| `-iL hosts.lst` | Read targets from a file. |
| `--top-ports=10` | Scan the ten most frequently used ports from Nmap's service database. |
| `-F` | Scan the top 100 ports for the selected protocol. |
| `-p22,25` | Scan an explicit port list. |
| `-p22-110` | Scan an inclusive port range. |
| `-p-` | Scan ports 1–65535 for the selected protocol. |
| `-sS` | Send TCP SYN probes using raw sockets. |
| `-sT` | Use full TCP connect calls, including without raw-socket privileges. |
| `-sA` | Map TCP filtering with ACK probes; does not identify open ports. |
| `-sU` | Scan UDP ports. |
| `-sV` | Probe services to identify products and versions. |
| `-sC` | Run the default NSE script set. |
| `--script banner,smtp-commands` | Select named NSE scripts. |
| `-O` | Perform operating-system fingerprinting. |
| `-A` | Enable version detection, OS detection, default scripts, and traceroute. |
| `--packet-trace` | Display sent and received packets and connection diagnostics. |
| `--reason` | Show the response that caused each host or port classification. |

### Host discovery

```bash
nmap -sn 10.10.10.0/24
nmap -sn -PS22,80,443 -PA80,443 -PU161 10.10.10.0/24
nmap -sn -PE 10.10.10.0/24
nmap -sn -iL targets.txt -oA nmap/hosts
```

`-Pn` skips discovery; use it when ICMP is filtered.

| Command | Description |
|---|---|
| `sudo nmap -sn -n 10.10.10.0/24 -oA tnet \| grep 'Nmap scan report for' \| cut -d' ' -f5` | Save discovery results and extract responding IP addresses. |
| `sudo nmap -sn -n -iL hosts.lst -oA host-list \| grep 'Nmap scan report for' \| cut -d' ' -f5` | Discover hosts from a supplied list and print their addresses. |
| `sudo nmap -sn 10.10.10.18 10.10.10.19 10.10.10.20 -oA selected-hosts` | Scan several individual hosts in one invocation. |
| `sudo nmap -sn 10.10.10.18-20 -oA host-range` | Express adjacent addresses as an octet range. |
| `sudo nmap -sn -PE 10.10.10.20 --packet-trace --reason -oA discovery-arp` | See whether local ARP discovery takes precedence over ICMP. |
| `sudo nmap -sn -PE 10.10.10.20 --disable-arp-ping --packet-trace --reason -oA discovery-icmp` | Compare explicit ICMP discovery with ARP host probes disabled. |

On local Ethernet, an ARP response can establish that a host is online without any ICMP reply. A non-responsive discovery scan does not establish that the host is powered off.

### Port scanning

```bash
nmap -Pn -n -sT -p- -T3 --max-rate 100 -oA nmap/allports "$IP"
sudo nmap -Pn -n -sS -p 1-1000 -oA nmap/tcp "$IP"
nmap -Pn -n -sT -p 80,443 $IP          # no raw sockets
sudo nmap -Pn -n -sU --top-ports 100 -oA nmap/udp "$IP"
nmap -Pn -n -sV -sC -p 21,22,80,445 -oA nmap/services $IP
```

| Command | Description |
|---|---|
| `sudo nmap 10.10.10.20 --top-ports=10` | Get a small initial TCP-port inventory. |
| `sudo nmap 10.10.10.20 -F -sU` | Scan the top 100 UDP ports. |
| `sudo nmap 10.10.10.20 -sS -p21 -Pn -n --disable-arp-ping --packet-trace` | Trace a SYN probe and inspect SYN/ACK or RST responses. |
| `nmap 10.10.10.20 -sT -p443 -Pn -n --disable-arp-ping --packet-trace --reason` | Trace a full TCP connection and its final classification. |
| `sudo nmap 10.10.10.20 -sS -p139,445 -Pn -n --disable-arp-ping --packet-trace --reason` | Compare silent packet drops with explicit rejections. |
| `sudo nmap 10.10.10.20 -sU -p100,137,138 -Pn -n --disable-arp-ping --packet-trace --reason` | Contrast UDP replies, ICMP port-unreachable errors, and no response. |

### Port-state interpretation

| State | Meaning |
|---|---|
| `open` | A service responds; a SYN scan typically receives SYN/ACK, and UDP may return application data. |
| `closed` | The host responds but no service is listening; TCP commonly returns RST, UDP ICMP type 3/code 3. |
| `filtered` | Filtering prevents a definite open/closed decision; packets may be dropped or explicitly rejected. |
| `unfiltered` | An ACK probe reached the host and received RST; the port may still be open or closed. |
| `open\|filtered` | No response distinguishes an open service from a filtered path, especially with UDP. |
| `closed\|filtered` | An IP-ID idle scan cannot distinguish a closed port from filtering. |

For UDP, ICMP destination-unreachable codes such as 1, 2, 9, 10, and 13 indicate filtering; silence produces `open|filtered`. Interpret flags and ICMP codes in the context of the scan type.

### Service/version detection

| Command | Description |
|---|---|
| `sudo nmap 10.10.10.20 -p- -sV --stats-every=5s -v` | Discover all TCP services, print newly found ports, and report progress every five seconds. |
| `sudo nmap 10.10.10.20 -p445 -sV -Pn -n --disable-arp-ping --packet-trace --reason` | Inspect the probes used to identify an ambiguous service. |
| `sudo nmap 10.10.10.20 -p80 -A` | Combine web-service detection, default scripts, OS fingerprinting, and traceroute. |

Press Space during an interactive scan for a status update. OS fingerprints are more useful when at least one open and one closed TCP port are available. Raw banners may contain hostnames or distribution details omitted from the summarized version field.

### NSE scripts

```bash
nmap -Pn -n -p 445 --script smb-os-discovery,smb-enum-shares,smb-security-mode,smb2-security-mode $IP
nmap -Pn -n -p 21 --script ftp-anon,ftp-syst,ftp-bounce $IP
nmap -Pn -n -p 25 --script smtp-commands,smtp-open-relay,smtp-enum-users $IP
nmap -Pn -n -p 1433 --script ms-sql-info,ms-sql-ntlm-info,ms-sql-empty-password $IP
nmap -Pn -n -p 161 -sU --script snmp-info,snmp-sysdescr,snmp-processes $IP
nmap -Pn -n --script "vuln and safe" -p 80,443,445 $IP
```

| Command | Description |
|---|---|
| `sudo nmap --script-updatedb` | Rebuild the local NSE script database after adding scripts. |
| `find /usr/share/nmap/scripts -type f -name 'ftp*.nse'` | Locate installed FTP scripts without scanning the whole filesystem. |
| `nmap --script-help banner,smtp-commands` | Read script descriptions and categories before selection. |
| `sudo nmap 10.10.10.20 -p25 --script banner,smtp-commands` | Capture the SMTP greeting and advertised commands. |
| `sudo nmap 10.10.10.20 -sV -p21 -sC --script-trace` | Trace the FTP requests and responses generated by NSE. |
| `sudo nmap 10.10.10.20 -p80 -sV --script vuln` | Run the matching vulnerability-category scripts against a selected service. |

| NSE category | Purpose |
|---|---|
| `auth` | Examine authentication mechanisms and access conditions. |
| `broadcast` | Discover services through broadcast requests. |
| `brute` | Attempt credential guessing. |
| `default` | Scripts selected by `-sC`. |
| `discovery` | Collect service and network information. |
| `dos` | Test denial-of-service conditions. |
| `exploit` | Exercise known exploitation paths. |
| `external` | Use third-party services during processing. |
| `fuzzer` | Send varied fields and malformed inputs. |
| `intrusive` | Checks that may affect service behavior or state. |
| `malware` | Look for malware-related behavior or indicators. |
| `safe` | Scripts designed to avoid intrusive or destructive actions. |
| `version` | Extend service-version detection. |
| `vuln` | Check specific vulnerabilities. |

Categories overlap: `vuln` does not imply `safe`, and a wildcard such as `ftp*` can include brute-force or exploit scripts. Quote wildcard and Boolean script expressions to prevent shell expansion.

### Output and performance

```bash
nmap ... -oA nmap/name        # .nmap, .xml, .gnmap
nmap ... --reason             # why a port is open/filtered
nmap ... -T4                  # reasonable speed
nmap ... --max-rate 1000      # cap packets/sec
nmap ... --exclude 10.10.10.5
nmap ... --open               # open or possibly open ports
```

Rescan selected ports with `-sV --version-all` when a version is ambiguous and additional probes are approved. `--open` also retains states such as `open|filtered`; do not count every displayed row as a confirmed listening service.

| Output option | Description |
|---|---|
| `-oA target` | Save normal, XML, and grepable output as `target.nmap`, `target.xml`, and `target.gnmap`. |
| `-oN target.nmap` | Save human-readable scan results. |
| `-oG target.gnmap` | Save grepable output for simple text processing. |
| `-oX target.xml` | Save structured XML, including script output, for reports and parsers. |

| Command | Description |
|---|---|
| `sudo nmap 10.10.10.20 -p- -oA target` | Preserve a full TCP-port scan in all three formats. |
| `cat target.nmap` | Read the normal scan report. |
| `cat target.gnmap` | Inspect the grepable host and port records. |
| `cat target.xml` | Inspect the structured report and embedded stylesheet reference. |
| `xsltproc -o target.html target.xml` | Convert the saved XML report to HTML using its stylesheet. |

Create output directories before using paths such as `nmap/full`; Nmap does not create their parent directories. XML preserves richer detail than grepable output.

### Timing and coverage comparison

| Option | Description |
|---|---|
| `--initial-rtt-timeout 50ms` | Start with a 50 ms probe response timeout. |
| `--max-rtt-timeout 100ms` | Cap the adaptive response timeout at 100 ms. |
| `--max-retries 0` | Send no retransmissions for an unanswered probe. |
| `--min-rate 300` | Request a minimum packet send rate of 300 packets per second. |
| `--min-parallelism 10` | Keep at least ten probes outstanding where applicable. |
| `--stats-every=5s` | Print periodic progress. |
| `-v`, `-vv` | Increase verbosity, including immediate reporting of discoveries. |

| Timing template | Name / use |
|---|---|
| `-T0` | Paranoid; very long delays. |
| `-T1` | Sneaky; long delays. |
| `-T2` | Polite; reduced scan intensity. |
| `-T3` | Normal; default template. |
| `-T4` | Aggressive; suited to responsive, reliable networks. |
| `-T5` | Insane; short timeouts can lose results. |

| Command | Description |
|---|---|
| `sudo nmap 10.10.10.0/24 -F -oN tnet.default` | Establish baseline coverage with default timing. |
| `sudo nmap 10.10.10.0/24 -F --initial-rtt-timeout 50ms --max-rtt-timeout 100ms -oN tnet.rtt` | Measure the effect of shorter RTT timeouts. |
| `sudo nmap 10.10.10.0/24 -F --max-retries 0 -oN tnet.retries0` | Measure coverage without retransmissions. |
| `sudo nmap 10.10.10.0/24 -F --min-rate 300 -oN tnet.minrate300` | Compare a minimum send-rate setting with the baseline. |
| `sudo nmap 10.10.10.0/24 -F -T5 -oN tnet.T5` | Compare the fastest timing template with the baseline. |
| `grep -Ec '^[0-9]+/tcp[[:space:]]+open[[:space:]]' tnet.default tnet.rtt tnet.retries0 tnet.minrate300 tnet.T5` | Count explicitly open TCP results in each saved scan. |

Compare the actual host/port sets as well as counts: equal totals can hide different misses. Short RTT timeouts and reduced retries trade coverage for speed; `--min-rate` controls packets per second, not simultaneous connections.

### UDP notes

UDP scans are slow and lossy. Target likely services: 53, 69, 111, 123, 137, 161, 500, 623, 1900. Use `-sU -p` explicitly, increase retries, and confirm with the service's own client.

### Firewall and IDS/IPS behavior

| Command | Description |
|---|---|
| `sudo nmap 10.10.10.20 -p21,22,25 -sS -Pn -n --disable-arp-ping --packet-trace` | Establish SYN-probe behavior on a small port set. |
| `sudo nmap 10.10.10.20 -p21,22,25 -sA -Pn -n --disable-arp-ping --packet-trace` | Compare ACK filtering with the SYN results. |
| `sudo nmap 10.10.10.20 -p80 -sS -Pn -n --disable-arp-ping --packet-trace -D RND:5` | Add five random decoy sources to raw SYN probes. |
| `sudo nmap 10.10.10.20 -n -Pn -p445 -O` | Record baseline filtering and OS-fingerprint behavior. |
| `sudo nmap 10.10.10.20 -n -Pn -p445 -O -S 10.10.14.5 -e tun0` | Select the attack host's source address and interface explicitly. |
| `sudo nmap 10.10.10.20 -p50000 -sS -Pn -n --disable-arp-ping --packet-trace` | Test a high port with the default source-port selection. |
| `sudo nmap 10.10.10.20 -p50000 -sS -Pn -n --disable-arp-ping --packet-trace --source-port 53` | Test whether a source-port-53 rule changes the result. |
| `sudo ncat -nv --source-port 53 10.10.10.20 50000` | Validate the same source-port behavior with a real TCP connection. |
| `nmap 10.10.10.20 -Pn -p80 --dns-servers 10.10.10.53,10.10.10.54` | Use specified DNS resolvers for Nmap's hostname lookups. |

`-g 53` is the short form of `--source-port 53`. Custom DNS resolvers do not proxy scan traffic, and `-n` disables those DNS lookups. Source-port selection applies to raw probes, not ordinary service-detection or NSE connections; the Ncat check validates whether application traffic can pass too.

An ACK result of `unfiltered` is not proof of an open service. Stateful firewalls can reject unsolicited ACKs. Decoys affect raw discovery/scan traffic, not version-detection connections; spoofing an address does not provide a return path or a usable TCP session. A later loss of connectivity is consistent with filtering or rate limiting but does not identify an IDS/IPS product by itself.

## tcpdump

```bash
tcpdump -i tun0 -n -vv
tcpdump -i any -n host 10.10.14.5 and port 445
tcpdump -i tun0 -n -w capture.pcap
tcpdump -r capture.pcap -nn -A
tcpdump -i tun0 -n 'tcp[tcpflags] & tcp-syn != 0'
tcpdump -i tun0 -n port 53 or port 88
```

Use it to confirm:

- Whether a callback reached your listener.
- Which protocol/port a payload actually used.
- Credentials sent in cleartext (FTP, POP3, IMAP, HTTP basic, SNMP).
- NTLM hashes from coercion (`Responder` captures are easier, but tcpdump is evidence).

### Compare a banner with scan output

Run the capture while opening a separate client connection:

| Command | Description |
|---|---|
| `sudo tcpdump -i tun0 -nn -A 'host 10.10.14.5 and host 10.10.10.20 and tcp port 25'` | Capture SMTP traffic between the attack host and target, including payload text. |
| `nc -nv 10.10.10.20 25` | Read the server's raw SMTP greeting. |

Look for SYN, SYN/ACK, ACK, then payload-bearing packets. A greeting may disclose an OS distribution or internal hostname that Nmap's version summary omitted.

## Credential management

Keep one authoritative table during an engagement:

| Username | Secret | Type | Source host | Valid on | Notes |
|---|---|---|---|---|---|
| `svc_web` | `...` | password | SMB share | `WEB01`, `DC01` | local admin |
| `Administrator` | `...` | NTLM | LSASS | all | domain admin |

Rules:

- Record the secret **exactly** (case, symbols, trailing spaces).
- Record the source and the validation command.
- Mark invalid/expired credentials instead of deleting them.
- Never paste real client secrets into public notes; redact in the report.

Tools such as `creds`, password managers, or a simple encrypted note all work. The important part is one source of truth.

## Windows living-off-the-land port scanning

When you have command execution but cannot upload Nmap:

```powershell
Test-NetConnection -ComputerName 10.10.10.20 -Port 445
Test-NetConnection -ComputerName 10.10.10.20 -Port 80 -InformationLevel Detailed

$TARGET_HOST = Read-Host 'Approved target hostname'
$PORTS = 22,80,443,445,5985
$PORTS | ForEach-Object {
  $port = $_
  $c = New-Object Net.Sockets.TcpClient
  try {
    if ($c.ConnectAsync($TARGET_HOST, $port).Wait(1000) -and $c.Connected) {
      "$port open"
    } else {
      "$port no connection within timeout"
    }
  } catch {
    "$port connection failed"
  } finally {
    $c.Dispose()
  }
}
```

```cmd
netstat -ano
route print
arp -a
```

```powershell
Get-NetTCPConnection -State Listen
Get-NetUDPEndpoint
```

The selected TCP probes have a per-port timeout; increase it for an approved high-latency path rather than equating a timeout with a closed port. Local connection/listener commands describe this host, not every reachable remote service.

```powershell
# Slow but native HTTP check
Invoke-WebRequest -Uri http://10.10.10.20/ -UseBasicParsing -TimeoutSec 3

# DNS
Resolve-DnsName dc01.target.htb
nslookup dc01.target.htb
```

```cmd
:: SMB share check without extra tools
net view \\10.10.10.20
dir \\10.10.10.20\share
```

PowerShell may be logged or restricted by CLM and endpoint policy; .NET calls can also be restricted. Record that limitation and choose an approved compatible tool rather than disabling the controls.

## References

- [Nmap book](https://nmap.org/book/)
- [Nmap NSE](https://nmap.org/nsedoc/)
- [tcpdump man page](https://www.tcpdump.org/manpages/tcpdump.1.html)
- [Microsoft — Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection)
- [buduboti — Network Enumeration with NMAP](https://github.com/buduboti/CPTS-Walkthrough/blob/main/HTB-Academy/10.%20Network%20Enumeration%20with%20NMAP.md) — discovery, port-state interpretation, output formats, and timing trade-offs.
- [Cavementech — Scanning](https://notes.cavementech.com/pentesting-quick-reference/scanning) — unexpected service ports, targeted identification, and NSE selection.

The staged workflow is independently written. Aggressive timing and category-wide scripts from public lab examples are not treated as safe defaults or proof of a vulnerability.
