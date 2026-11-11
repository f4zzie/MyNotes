---
title: "Procedures"
description: "End-to-end checklists for AD compromise, Linux/Windows escalation, and web pentesting."
category: "Field Manual"
tags: ["field-manual", "cpts", "procedures", "methodology"]
date: 2026-11-11
published: true
status: archive
---

# Procedures

Procedures are the “follow blindly” layer of the field manual. Each one is an ordered algorithm with decision points; the technical detail lives in the linked notes.

## Available procedures

- [[pending/field-manual/06-procedures/active-directory-compromise|Active Directory compromise]]
- [[pending/field-manual/06-procedures/linux-enum-privesc-procedure|Linux enumeration → privilege escalation]]
- [[pending/field-manual/06-procedures/windows-enum-privesc-procedure|Windows enumeration → privilege escalation]]
- [[pending/field-manual/06-procedures/web-pentest-procedure|Web pentest]]

## How to use

1. Start at the top; do not skip enumeration steps.
2. Check off each item with a timestamp and the command used.
3. When a branch fails, record why before moving on.
4. Re-run the procedure after every new credential or host.
5. At the end, reconcile with the report's walkthrough.

## Universal loop

```text
Enumerate → identify candidate → verify → exploit → gain access
→ enumerate again → escalate → collect → pivot → document
```

If you are stuck, the loop is usually broken at **verify** (the vulnerability is not real) or **enumerate again** (you missed a credential/ACL).

## Penetration testing process

Use these eight CPTS stages as engagement checkpoints. A new host, credential, or privilege level can send the assessment back to information gathering; keep the evidence from each iteration.

1. [ ] **Pre-Engagement** — Agree the NDA, objectives, scope, time estimate, and Rules of Engagement. Record target ranges, applications, exclusions, test accounts, and the agreed deliverables.
2. [ ] **Information Gathering** — Identify the organisation's exposed assets, hardware, software, services, and application behaviour. Produce a host/service map with observed versions and access requirements.
3. [ ] **Vulnerability Assessment** — Evaluate the collected information manually and with scanners. Separate version-based candidates from verified weaknesses, establish prerequisites, and prioritise useful attack vectors.
4. [ ] **Exploitation** — Prepare the selected tools and payloads, test the candidate, and establish initial access. Record the exact input and the resulting user, service, or application context.
5. [ ] **Post-Exploitation** — Stabilise access, enumerate from inside the host, assess privilege escalation, and identify relevant credentials or protected data. Record how this access demonstrates the client's stated impact.
6. [ ] **Lateral Movement** — Use information from the foothold to reach additional in-scope hosts at the same or a higher privilege level. Repeat enumeration and post-exploitation after each successful move.
7. [ ] **Proof-of-Concept** — Reconstruct the complete chain with prerequisites, commands/requests, and evidence for each transition. Where practical, provide a reproducible script and identify which fixes break the chain.
8. [ ] **Post-Engagement** — Restore assessment changes, complete technical and management-facing reporting, conduct the report walkthrough, archive evidence according to the agreed retention policy, and record any remediation retest.

The procedure pages below this index apply these stages to a particular host or application. Keep a running chain such as `web foothold → local elevation → discovered credential → database access`, with an evidence reference at every arrow.

## Vulnerability scanning

Run both unauthenticated and credentialed scans when the engagement calls for them: the former shows externally observable exposure, while the latter adds local patch/configuration visibility. Record whether authentication actually succeeded. A static version/CVE match needs patch and configuration checks; a dynamic probe needs its response reviewed before becoming a confirmed finding.

```text
Install and initialise → configure targets/policy → select credentials and checks
→ scan → inspect individual results → export raw evidence → validate → retest
```

### Nessus — install and initialise

1. Download the matching platform package from [Tenable Downloads](https://www.tenable.com/downloads/nessus?loginAttempted=true) and obtain the edition's [activation code](https://www.tenable.com/products/nessus/activation-code).
2. For a Debian/Ubuntu scanner, place the single downloaded `.deb` in the working directory and install/start it:

```bash
sudo dpkg -i ./Nessus-*.deb
sudo systemctl start nessusd.service
systemctl status nessusd.service --no-pager
```

3. Open `https://localhost:8834`, select the edition, activate it, and create the scanner account. Wait for plugin download/compilation to finish before creating a scan. Configure a required proxy through **Settings**.

### Nessus — configure the scan

Start with **New Scan → Basic Network Scan**. For a reusable configuration, use **Policies → New Policy → Advanced Scan**, save it, and select it later under **Scan Templates → User Defined**. The [template reference](https://docs.tenable.com/nessus/Content/ScanAndPolicyTemplates.htm) distinguishes Discovery, Vulnerabilities, and Compliance templates.

| Area | Settings to record | Practical use |
|---|---|---|
| General | Name, target IPs/host list, schedule | Keep target selection traceable to the asset list. |
| Discovery → Host Discovery | Reachability tests; fragile-device/printer options | Identify live hosts while respecting device-specific exclusions. |
| Discovery → Port Scanning | Common ports, all ports, or a custom range | A restricted port list also restricts vulnerability coverage. |
| Discovery → Service Discovery | Probe all ports; SSL/TLS discovery; certificate checks | Find services on non-standard ports and inspect certificate expiry/revocation. |
| Assessment | Web application checks, user agent, RFI test URL, authentication tests | Match enabled checks to the application and engagement goals. |
| Credentials | SSH, Windows, database, or service authentication | Use the intended account type and verify success in the results. |
| Advanced | Safe checks, congestion throttling, unresponsive-host handling, concurrency | Tune workload to the target and network rather than using one policy everywhere. |

### Nessus — plugins, credentials, and execution

- [ ] Select relevant [plugin families or individual plugins](https://docs.tenable.com/nessus/Content/Plugins.htm). NASL plugins contain the detection logic, impact, and remediation; record the plugin ID and consult the [plugin database](https://www.tenable.com/plugins) when interpreting a hit.
- [ ] Keep **Safe Checks** enabled and exclude Denial of Service checks from the baseline policy. Safe checks reduce impact but do not eliminate the need to observe target health.
- [ ] Configure the credential mechanism explicitly: SSH password/key/certificate/Kerberos; Windows password/Kerberos/LM or NTLM hash; or a supported database/service login. Credentialed scanning and password brute forcing are separate settings.
- [ ] If RID enumeration is selected, record the domain/local account ranges. Keep authentication attempts within the engagement's account-lockout constraints.
- [ ] Save the policy, launch the scan, and record start/end time, targets, scan identity, and policy. Triage arriving results during longer scans, then preserve the completed output.
- [ ] Check authentication success messages before treating the scan as credentialed. A completed task alone does not establish that local checks ran.
- [ ] For a manually confirmed false positive, use **Resources → Plugin Rules → host + plugin ID → Hide this result**. Record the reason and keep the raw result; a host-specific rule preserves coverage on other hosts.

### Nessus — export and read the output

| Export | Contents | Use |
|---|---|---|
| `.nessus` | XML containing scan settings and plugin output | Raw evidence, re-import, parsing, or downstream tools such as EyeWitness. |
| `.db` | Nessus scan plus knowledge base, plugin Audit Trail, and attachments | Richer scan archive and troubleshooting context. |
| `.html` | Executive Summary or custom report | Navigate hosts, severity, CVSS, plugin IDs, and individual findings. |
| `.pdf` | Shareable Executive Summary or custom report | Supporting appendix for the written assessment. |
| `.csv` | Selected result columns | Sort/group affected assets, feed analytics, or assign remediation work. |

Open individual findings and read **Plugin Output**, the affected port/service, the detection method, and the proposed fix. Group the same issue across affected hosts. Preserve informational records that establish service discovery and authentication coverage, even when the final report focuses on higher-severity findings.

For older compatible Nessus deployments, the reference's interactive [Nessus report downloader](https://raw.githubusercontent.com/eelsivart/nessus-report-downloader/master/nessus6-report-downloader.rb) can export through the REST API. After saving it as `nessus_downloader.rb`, run:

```bash
ruby ./nessus_downloader.rb
```

It prompts for the server, login, scan IDs, formats, and output directory. Scanner exports support the custom assessment report; include the validated impact, reproduction, and remediation in the main deliverable.

### OpenVAS/GVM — install and initialise

OpenVAS is the scanner within Greenbone Vulnerability Management; Greenbone Security Assistant is the web interface. On a Debian-based security distribution that supplies the GVM helper commands:

```bash
sudo apt-get update
sudo apt-get install gvm
sudo gvm-setup
sudo gvm-check-setup
sudo gvm-start
```

Allow setup and feed import to finish. Use the web URL printed by the launcher, commonly `https://127.0.0.1:9392`, and the account created during setup. Distribution packaging and helper availability vary.

### OpenVAS/GVM — targets, NVTs, and tasks

1. [ ] Open **Configuration → Targets** and create an individual target or host list. Set the port list, authentication, and **Alive Test**. The reference's **Scan Config Default** uses the **NVT Ping Host** test; see [Greenbone target configuration](https://docs.greenbone.net/GSM-Manual/gos-22.04/en/scanning.html#creating-a-target).
2. [ ] Select the intended credential object for an authenticated scan. Root/Administrator-level access enables more local checks than a restricted account; record the actual privileges and authentication result.
3. [ ] Select a scan configuration and its Network Vulnerability Test (NVT) families. Review the Windows, Linux, and web checks that apply to the target.
4. [ ] Under **Scans → Tasks**, create a task or use the wizard, associate the target and configuration, and start it. Record which configuration and feed state produced the result.
5. [ ] Review results while the task runs, then open its completed report to examine findings, operating systems, ports, and services.

The reference describes these configurations; available names depend on the installed GVM/feed version:

| Configuration | Purpose |
|---|---|
| Base | Basic host status and OS information; no vulnerability checks. |
| Discovery | Services, hardware, ports, and software inventory; no vulnerability checks. |
| Host Discovery | Identify active hosts using reachability tests; no vulnerability checks. |
| System Discovery | More detailed OS and hardware identification. |
| Full and fast | Vulnerability assessment that selects applicable NVTs using discovered services/ports. |

### OpenVAS/GVM — export and review

Open the report from **Scans**, review the result and host/service tabs, and retain an XML export for later analysis. The reference also lists CSV, PDF, ITG, and TXT report formats; availability depends on installed report formats.

With [openvasreporting](https://github.com/TheGroundZero/openvasreporting) installed, convert the XML export to a workbook:

```bash
python3 -m openvasreporting -i report.xml -f xlsx
```

Keep the original XML beside the derived report so a filtered or reformatted view can be traced back to the scanner's evidence.

### Manual validation and reporting checklist

| Record for each candidate | Validation question |
|---|---|
| Host, port, protocol, and application | Did the scanner identify the intended service and asset? |
| Plugin ID or NVT identifier, CVE, severity/CVSS | Which exact check fired, and what condition does it test? |
| Detection output and observed version | Is this a banner-only inference, a local patch check, or a behavioural result? |
| Credentialed-check status | Did the intended authenticated checks actually execute? |
| Independent reproduction and impact | Can a manual check confirm the prerequisite and relevant effect? |
| Remediation, affected assets, retest result | Does the proposed fix address the verified condition on every affected host? |

Cross-check a service or TLS finding with a focused probe using the recorded target values:

```bash
nmap -sV --script=banner -p "$PORT" "$IP"
sslscan "$HOST"
```

### Common scanning issues

| Symptom | Check or adjustment |
|---|---|
| No ports, every port open, or implausible live-host results | Compare with a manual service probe. Review firewall/ICMP behaviour; test an Advanced Scan with **Ping the remote host** disabled when discovery is misleading. |
| Scan completes but local findings are absent | Inspect authentication output, credential type, account rights, and required service reachability. |
| Congestion or an overloaded application | Reduce **Max Concurrent Checks Per Host** and overall concurrency, enable congestion throttling, and compare network utilisation before/during the scan. |
| Printers or fragile/legacy hosts behave unexpectedly | Exclude those devices or give them a separate targeted policy; record exclusions in the coverage summary. Nessus also supports exclusions through `nessusd.rules`. |
| A known-CVE finding contradicts the host | Check vendor patches/backports and the actual configuration. Create a host/plugin-specific exception only after validation. |
| GVM targets/configurations have no useful checks | Confirm setup/feed import completed and the task uses a vulnerability configuration rather than a discovery-only profile. |
| An export seems incomplete | Check result filters, selected CSV columns, and task completion; compare with the raw `.nessus` or GVM XML. |

Measure the same scanning interface before and during a run; replace `eth0` with the interface carrying the scan traffic:

```bash
sudo apt install vnstat
sudo vnstat -l -i eth0
```

Retain scan times, policy changes, exclusions, and utilisation observations with the results so unexpected network behaviour can be correlated with the assessment.
