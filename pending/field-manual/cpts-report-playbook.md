---
title: "CPTS Report Playbook"
description: "Trigger-based reporting methodology for the CPTS exam using SysReptor's HTB template, plus finding and appendix conventions."
category: "Field Manual"
tags: ["field-manual", "cpts", "reporting", "sysreptor"]
date: 2026-11-11
published: true
status: archive
---

# CPTS Report Playbook

Source: [HTB CPTS Reporting: The Easy Way](https://www.brunorochamoura.com/posts/cpts-report/) by Bruno Rocha Moura.

> [!summary] Core idea
> Reporting and hacking both suffer when they interrupt each other. Map every report field to a **milestone trigger**. When the milestone happens, stop, fill the mapped fields, resume hacking. The report stays current, and no decision about “when to write” is needed.

## Criteria

You must satisfy **both**:

1. Capture and submit **≥ 12 of 14** flags.
2. Submit a **commercial-grade report** that meets the grader's standard.

Extra flags do not compensate for a weak report. Once 12 flags are in hand, report quality is the only remaining risk.

## Tools

| Tool | Use |
|---|---|
| [SysReptor](https://docs.sysreptor.com/) | Self-hosted pentest reporting; free and open source |
| [HTB CPTS template](https://docs.sysreptor.com/assets/reports/HTB-CPTS-Report.pdf) | Official template endorsed by HTB; fills structure and styling |
| LLM (ChatGPT etc.) | Rephrase **your own** draft for clarity and tone; never generate findings from scratch |
| Screenshot tool | Cropped, labelled, redacted evidence |
| [DPAT](https://github.com/clr2of8/DPAT) | Domain password statistics after NTDS dump |

SysReptor's template already contains acceptable default text for many fields. Only the fields marked **bold** below normally need original content; still read every default.

## Report structure

| Section | Fields |
|---|---|
| Meta | **Candidate name, title, email**; **Engagement information** |
| Document Control | **Customer contacts** |
| Executive Summary | Executive summary; Approach; **Scope**; **Assessment overview and recommendations** |
| Network Penetration Testing Assessment Summary | Network summary; Summary of findings |
| Internal Network Compromise Walkthrough | Walkthrough summary; **Detailed walkthrough** |
| Remediation Summary | **Short term**; **Medium term**; **Long term** |
| Appendix | Finding severities; **Host & service discovery**; **Subdomain discovery**; **Exploited hosts**; **Compromised users**; **Changes/host cleanup**; **Flags discovered**; **Domain password review** |
| Findings (one per vulnerability) | **Title**; **CWE**; **CVSS**; **Overview**; **Impact**; **Affected components**; **Recommendations**; **References**; **Details** |

## Trigger table

Keep this table open during the exam. When a trigger fires, fill the listed fields before continuing.

| Trigger | Fill immediately |
|---|---|
| Exam starts | Meta, Document Control, Network Summary, Summary of Findings, Executive Summary, Approach, Scope |
| Host or service discovered | Appendix → Host & Service Discovery |
| Vhost or subdomain discovered | Appendix → Subdomain Discovery |
| Security finding discovered | New Finding (all fields) + Remediation Summary buckets |
| Foothold on host | Detailed Walkthrough + Appendix → Exploited Hosts |
| Root/SYSTEM on host | Detailed Walkthrough + Appendix → Changes/Host Cleanup |
| User compromised | Appendix → Compromised Users |
| Flag captured | Appendix → Flags Discovered |
| Engagement done | Executive Summary assessment, Remediation Summary, Domain Password Review, final polish |

### Exam starts

Fill **Meta**, **Document Control**, and **Network Penetration Testing Assessment Summary** completely. Fill most of the **Executive Summary** but leave **Assessment Overview and Recommendations** for the end.

### Host or service discovered

Create one table per host under a host heading:

| Port | Service | Notes |
|---|---|---|
| 80 | nginx 1.18.0 | Custom support application |
| 445 | SMB | Signing disabled; domain-joined |

### Virtual host or subdomain discovered

One table for all discovered names, including in-scope names supplied by the client:

| URL | Description | Discovery method |
|---|---|---|
| `admin.target.htb` | Administrator dashboard | Revealed in HTML comment |
| `dev.target.htb` | Staging application | Virtual-host fuzzing |

### Security finding discovered

Add **one finding per vulnerability** — never group SQLi and XSS into a single entry.

| Field | Guidance |
|---|---|
| Title | Clear and consistent; no mandated format |
| CWE | Ask an LLM if unsure, then verify against the MITRE page |
| CVSS | Use SysReptor's calculator; verify the vector |
| Overview | What the vulnerability is, generally and in this instance. No impact or remediation here |
| Impact | Specific security/business consequences in this environment |
| Affected components | Smallest label covering all affected assets |
| Recommendations | Actionable fixes; never patch the client's system yourself |
| References | NVD/CVE, MITRE CWE, OWASP cheatsheet, PoC source |
| Details | Step-by-step reproduction with labelled images/code, redaction, tool names |

Example finding titles (from HTB material):

```text
Insecure File Shares
Sensitive Data on File Shares
Unnecessary Exposed Services
Insecure Direct Object Reference (IDOR)
HTTP Verb Tampering
Unrestricted File Upload
Local File Inclusion (LFI)
Weak <APPLICATION> Admin Credentials
SQL Injection
Cross-Site Scripting (XSS)
SSRF to Local File Read
XML External Entity (XXE) Injection
Command Injection
Excessive Active Directory Group Privileges
Passwords in AD User Description Field
Misconfigured <APPLICATION> Instance
```

**Affected components** examples:

- Single host/service: `HOST01 (SMB / 139,445 TCP)`
- Single web app: `app.target.htb`
- Whole domain/subnet: `target.htb Active Directory domain` or `10.0.0.0/8`

**Details** must be reproducible from a clean state: exact commands, parameters, payloads, screenshots, and an explanation of each step. Crop to the relevant region; redact secrets that are not needed to reproduce.

After each finding, distribute its remediation actions into **Short Term**, **Medium Term**, and **Long Term**.

### Foothold on a host

Fill **Exploited Hosts**:

| Host | Scope | Method | Notes |
|---|---|---|---|
| `HOST01` (`192.158.1.38`) | Internal | Command injection on web app | Member server |

Then update **Detailed Walkthrough**. Start from the template's summary and use this structure:

```text
{{ report.candidate.a_name }} ("the tester" herein) performed the following to fully compromise the <DOMAIN> domain.

<Numbered list: one concise point per attack-chain step. No images or code.>

**Detailed reproduction steps for this attack chain are as follows:**

<Writeup-style detail: describe each technique at least once, with images and code blocks.>
```

Rules:

- Third person (“the tester”), never first person.
- Include only the **shortest path to domain compromise**, not every sidetrack.
- Explain effective security controls you encountered.
- Add detail as each host falls; the section grows into the full chain.

### Root on a host

Update the walkthrough and fill **Changes/Host Cleanup**. List everything you added, modified, or deleted, even if reverted:

| Host | Scope | Change/cleanup needed |
|---|---|---|
| `HOST01` (`192.158.1.38`) | Internal | Uploaded `/var/www/html/shell.php`. MD5: `6ea3393fd7a4544d2fda0e42d7634013` |

Include MD5 sums for transferred files. This protects the client and explains possible EDR alerts.

### User compromised

One table for local users, one per AD domain:

| Username | Method | Notes |
|---|---|---|
| `svc_web` | Kerberoasted | `WEB01` service account |
| `www-data` | Web RCE | Local account on `WEB01` |

### Flag captured

| Flag # | Host | Flag value | Flag location | Method used |
|---|---|---|---|---|
| 9 | `DC01` | `...` | `/root/flag.txt` | Sudo `wget` privesc |

Sort ascending. Record the exact value and full path.

### Engagement done

Finish:

- **Executive Summary → Assessment Overview and Recommendations** — plain English, no jargon, bullet lists, or code. One paragraph on overall posture, then one per finding in the attack chain, each with a simple remediation.
- **Remediation Summary** — ensure all three horizons include both finding-specific and organisation-wide improvements (e.g. patch management, audits).
- **Domain Password Review** — after NTDS dump, run DPAT and report:
  - hashes obtained
  - unique hashes
  - percentage cracked
  - most common passwords
  - password-length breakdown
- Proofread repeatedly; sleep on it and re-read with fresh eyes.

## Writing quality rules

- Findings are independent and self-contained.
- Consistent tense, voice, and formatting across findings.
- Screenshots are cropped, labelled, and referenced in the text.
- Commands are copy-paste accurate; secrets are redacted where they do not affect reproduction.
- Recommendations are defensive guidance, not client-side changes.
- No claim without evidence; no evidence without a path to reproduce it.
- Distinguish confirmed exploitation from suspected exposure.

## Pre-exam report checklist

- [ ] SysReptor running; HTB CPTS template imported; test export works.
- [ ] Candidate/meta fields pre-filled where possible.
- [ ] Trigger table open beside the report.
- [ ] Screenshot naming and redaction workflow decided.
- [ ] Finding title/CWE/CVSS/reference sources bookmarked.
- [ ] DPAT installed and tested.
- [ ] Walkthrough skeleton and third-person phrasing ready.

## References

- [HTB CPTS Reporting: The Easy Way](https://www.brunorochamoura.com/posts/cpts-report/)
- [SysReptor documentation](https://docs.sysreptor.com/)
- [HTB certification templates](https://www.hackthebox.com/blog/certification-templates)
- [DPAT](https://github.com/clr2of8/DPAT)
