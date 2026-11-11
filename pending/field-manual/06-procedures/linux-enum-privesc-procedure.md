---
title: "Linux Enumeration → Privilege Escalation Procedure"
description: "Ordered Linux checklist from shell stabilisation to root, credential collection, and cleanup."
category: "Field Manual"
tags: ["field-manual", "cpts", "linux", "procedure", "privesc"]
date: 2026-11-11
published: true
status: archive
---

# Linux Enumeration → Privilege Escalation Procedure

## Step 0 — Stabilise

- [ ] Upgrade to a TTY.
- [ ] Set `TERM`, rows, and columns.
- [ ] Create a working directory (`/tmp/.work`).
- [ ] Record the host, IP, user, and time.

## Step 1 — Context

```bash
id
whoami
hostname
uname -a
cat /etc/os-release
sudo -l
```

- [ ] Are you in a container? (`/.dockerenv`, cgroups)
- [ ] Are you in a restricted shell? (`echo $SHELL`, `$PATH`)
- [ ] Do you have sudo rights?

## Step 2 — Quick wins

- [ ] `sudo -l` → GTFOBins.
- [ ] Home directory, history, SSH keys, configs.
- [ ] Environment variables (`env`) for credentials.
- [ ] World-writable service files.
- [ ] `crontab -l`, `/etc/crontab`, timers.

## Step 3 — System enumeration

- [ ] Users, groups, UID 0 accounts.
- [ ] SUID/SGID (`find / -perm -4000`).
- [ ] Capabilities (`getcap -r /`).
- [ ] Kernel and package versions.
- [ ] Mounts, NFS exports, Docker/LXD.
- [ ] Network interfaces, routes, listening ports.
- [ ] Running processes and services.

## Step 4 — Credential hunting

- [ ] `.bash_history`, `.zsh_history`.
- [ ] `.ssh`, `.netrc`, `.pgpass`, `.my.cnf`, `.git-credentials`.
- [ ] Web roots, `.env`, `wp-config.php`.
- [ ] `/var/backups`, `/var/log`, `/etc/shadow`.
- [ ] Database files and dumps.
- [ ] Ansible inventories/vaults.

## Step 5 — Choose a path

| Finding | Next action |
|---|---|
| Sudo binary | GTFOBins |
| SUID binary | GTFOBins / custom binary analysis |
| Capability | Capability-specific exploit |
| Writable cron | Inject command |
| Wildcard cron | Checkpoint injection |
| NFS `no_root_squash` | SUID binary on share |
| Docker group | Mount host |
| LXD group | Privileged container |
| Disk group | `debugfs` |
| Writable passwd/shadow | Add root user |
| Kernel exploit | Verify version/patch |
| Credentials | `su`/`sudo`/SSH |

## Step 6 — Escalate

- [ ] Run the exploit.
- [ ] Confirm `id` is root.
- [ ] Capture the flag: `/root/flag.txt`, `/root/root.txt`, `/home/*/flag.txt`.
- [ ] Re-enumerate as root: SSH keys, configs, other users, cron, databases.

## Step 7 — Collect and persist (within scope)

- [ ] Hashes/passwords.
- [ ] SSH keys and known hosts.
- [ ] Internal network map.
- [ ] Application secrets.
- [ ] Evidence for the report.

Do not install persistent backdoors unless the engagement explicitly asks for persistence testing.

## Step 8 — Cleanup

- [ ] Remove uploaded tools and scripts.
- [ ] Restore passwd/shadow/cron changes.
- [ ] Remove SUID binaries and capabilities you added.
- [ ] Kill background processes and tunnels.
- [ ] Document every change.

## Stop conditions

- Root achieved and flag captured.
- The path is destructive or outside scope.
- A kernel exploit risks crashing the host without a snapshot.

## References

- [GTFOBins](https://gtfobins.github.io/)
- [HackTricks — Linux privesc](https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html)
- [LinPEAS](https://github.com/carlospolop/PEASS-ng)

## Engagement-stage framing

This host checklist usually begins during **Post-Exploitation** of the wider engagement. Within that stage, each local escalation attempt has its own information-gathering, assessment, exploitation, and verification cycle.

| Process stage | Linux application | Completion evidence |
|---|---|---|
| Pre-Engagement | Carry forward the agreed host scope, objectives, test window, and permitted host changes. | Link the host to the engagement scope and desired access/data objective. |
| Information Gathering | Steps 0–4: establish a usable shell and enumerate the OS, services, permissions, network position, and relevant files. | Record the starting user, host, reachable services, and observed configuration. |
| Vulnerability Assessment | Step 5: compare the candidate with exact package/patch state, architecture, permissions, and required configuration. | Explain why the present user can reach and trigger the condition. |
| Exploitation | Step 6: execute the selected local path and check the new identity and access. | Capture the before/after privilege boundary and the command responsible. |
| Post-Exploitation | Re-enumerate with the new rights and demonstrate the objective; turn useful host information into the next testable lead. | Record relevant access and credential-source references. |
| Lateral Movement | Use discovered SSH/application credentials or internal service information to reach an additional in-scope host. | Record destination, protocol, resulting account, and restart the checklist there. |
| Proof-of-Concept | Reproduce the path from the original shell to the final privilege or data-access objective. | Include prerequisites, tool versions, commands, observed output, and remediation. |
| Post-Engagement | Complete Step 8, report the result, archive evidence under the engagement policy, and retest the fix. | Reconciled change record and a repeatable verification procedure. |

### Before choosing the local exploit

- [ ] Confirm the service or package directly; a banner-derived OS/version guess is supporting evidence and may miss a backported fix.
- [ ] Confirm the relevant permission from the current account, including the executable, parent path, service account, or scheduled action involved.
- [ ] Check the transferred tool's format/architecture and compare its checksum on both ends before relying on it.
- [ ] Keep the network context with the host notes so a credential or route discovered after elevation can feed the lateral-movement stage.

```bash
ip a
netstat -rn
file ./tool
md5sum ./tool
```

The checksum comparison checks transfer consistency. The `file` result helps identify an incompatible binary before execution. After a new account or host is reached, repeat enumeration using that account's actual rights.

### PoC handoff to the engagement report

- [ ] Identify the initial foothold and starting UID/group context.
- [ ] Record the vulnerable configuration and the prerequisite that made it exploitable.
- [ ] Retain the exact invocation and observed elevated identity/objective access.
- [ ] Explain whether the result ended the path or supplied an input to another in-scope host.
- [ ] Link each host change to its restoration and the remediation retest.
