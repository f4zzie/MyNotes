---
title: "Printer Shares"
description: "picoCTF Printer Shares writeup enumerating SMB shares to discover and access hidden printer share files containing the flag."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# Printer Shares

## Challenge

**Category:** General Skills  
**Name:** Printer Shares

**Prompt:**

> Oops! Someone accidentally sent an important file to a network printer—can you retrieve it from the print server?
> The printer is on `52805`.
> you can try `$ nc -vz mysterious-sea.picoctf.net 52805`

## Goal

Find the exposed file on the remote print server and recover the flag.

## Initial idea

The wording mentions a **network printer** and **printer shares**. That suggests the service may expose a printer-related network share rather than a normal shell or web service.

The provided hint command checks whether the port is open:

```bash
nc -vz mysterious-sea.picoctf.net 52805
```

What this does:

- `nc` is netcat
- `-v` enables verbose output
- `-z` does a scan without sending application data

## Step 1: Verify the port is open

```bash
nc -vz mysterious-sea.picoctf.net 52805
```

Observed result:

```text
mysterious-sea.picoctf.net [3.130.79.223] 52805 open
```

This confirms something is listening on port `52805`.

## Step 2: Think about the protocol

A raw `nc` connection did not immediately print a banner, so this was probably not a simple text service.

Because the challenge title is **Printer Shares**, the next reasonable guess is **SMB/Samba** with an exposed share. SMB shares are commonly used to expose files and printers on a network.

Good tools for that:

- `smbclient` to list and access shares
- `smbmap` to enumerate permissions

## Step 3: Enumerate available SMB shares

```bash
smbclient -N -L //mysterious-sea.picoctf.net/ -p 52805
```

What this command means:

- `smbclient` is an SMB client, similar to an FTP client for Windows/Samba shares
- `-N` means anonymous login with no password
- `-L` lists available shares
- `//mysterious-sea.picoctf.net/` is the target host
- `-p 52805` tells `smbclient` to use the custom challenge port

Result:

```text
Sharename       Type      Comment
---------       ----      -------
shares          Disk      Public Share With Guests
IPC$            IPC       IPC Service (Samba 4.19.5-Ubuntu)
```

This is the key discovery:

- there is a share called `shares`
- it allows **guest** access
- that means we can likely browse files without credentials

## Step 4: List files inside the exposed share

```bash
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'ls'
```

What this does:

- connects directly to the `shares` share
- uses anonymous access
- runs the SMB command `ls`

Result:

```text
  .                                   D        0
  ..                                  D        0
  dummy.txt                           N     1142
  flag.txt                            N       37
```

Now the challenge is effectively solved:

- `flag.txt` is visible in the share
- so the printer or print server exposed the sensitive file directly over SMB

## Step 5: Download the flag

```bash
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'get flag.txt'
```

Explanation:

- `get flag.txt` downloads the remote file into the current local directory

Then read it:

```bash
cat flag.txt
```

Output:

```text
picoCTF{<redacted>}
```

## Flag

```text
picoCTF{<redacted>}
```

## Why this works

The challenge relies on recognizing that the “printer” is actually exposing files through an SMB/Samba share.

The vulnerability is not code execution or memory corruption. It is simple **misconfiguration**:

- a guest-accessible network share existed
- the sensitive print output was stored there
- anonymous users could browse and download it

## Minimal solve path

```bash
nc -vz mysterious-sea.picoctf.net 52805
smbclient -N -L //mysterious-sea.picoctf.net/ -p 52805
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'ls'
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'get flag.txt'
cat flag.txt
```

## Takeaway

Not every CTF network service is meant to be attacked with exploitation payloads. Sometimes the whole challenge is identifying the protocol correctly and using the right client tool. Here, the important skill was recognizing an exposed SMB share on a non-standard port and pulling the leaked file from it.
