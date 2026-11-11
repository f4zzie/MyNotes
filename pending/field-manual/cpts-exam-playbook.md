---
title: "CPTS Exam Playbook"
description: "Preparation strategy, AEN dry run, exam-day tactics, flag strategy, and time management distilled from a first-attempt CPTS pass."
category: "Field Manual"
tags: ["field-manual", "cpts", "exam", "strategy"]
date: 2026-11-11
published: true
status: archive
---

# CPTS Exam Playbook

Distilled from Bruno Rocha Moura's [CPTS Tips & Tricks](https://www.brunorochamoura.com/posts/cpts-tips/), his [experience report](https://www.brunorochamoura.com/posts/cpts-experience/), and the [Road to CPTS](https://www.brunorochamoura.com/posts/road-to-cpts/) study log.

> [!summary] The one-paragraph version
> Finish the path, take real notes, turn those notes into **checklist methodologies**, dry-run **AEN blind**, and practise the report until it is automatic. In the exam: take all the time off you can, write the report as you go, rank solutions simplest-first, and do not chase flags 13–14 until the report is ready to submit.

## Exam facts

| Item | Detail |
|---|---|
| Prerequisite | 100% of the HTB Academy **Penetration Tester** job-role path (28 modules) |
| Format | 10-day simulated internal penetration test |
| Target | Multi-host Active Directory enterprise network, common and custom apps |
| Pass criteria | **≥ 12 of 14 flags** *and* a commercial-grade report |
| Attempts | Two attempts per voucher; second must start within 14 days of feedback |
| Feedback | Up to ~20 business days; treat it as report-focused, not a hint |
| Typical result | Most candidates need both attempts; a first-attempt pass is achievable with preparation |

The exam was **updated in 2025** after the tips post was written. Some specifics (notably “flag 9 is the hardest”) may have shifted; the principles still hold.

## Preparation

### 1. Take detailed, structured notes

Do not paste module cheatsheets into a text file. Build a **field manual** (CherryTree, Obsidian, Zim, Notion) with:

- A hierarchy mirroring the pentest phases.
- One node per technique/scenario, not per module.
- A cheatsheet table at the top, explanation underneath.
- Tags and consistent names, so `Ctrl+T` search works.
- Links between related notes (e.g. SMB enumeration ↔ NTLM relay ↔ NetExec).

Why it works:

- Forces active processing and improves retention.
- Removes the “which module had that command?” tax during the exam.
- Becomes the source for your written **methodologies**.

### 2. Additional modules worth taking

The path and the exam are closely aligned. Extracurricular binary exploitation, for example, is wasted effort for CPTS. Recommended extras:

| Resource | Why |
|---|---|
| `Information Security Foundations` path | Only if new to cyber security |
| `Basic Toolset` path | Foundations the main path assumes |
| Prerequisite modules listed by a module | Take them if the topic is not already solid |
| `Introduction to Active Directory` | Refresher before AD enumeration & attacks |
| `Windows Fundamentals` | Refresher for Windows-heavy modules |
| `Using CrackMapExec` (Tier III) | NetExec is used in every phase; high ROI |

Mark techniques from the CrackMapExec module that are **outside exam scope** so you do not waste exam time on them.

### 3. Dry-run AEN blind

`Attacking Enterprise Networks` (AEN) is the closest thing to the exam. Do it **without reading the module questions** (they contain hints) and without walkthroughs.

Spoiler-free progression:

1. Get all seven web flags on `DMZ01`.
2. Foothold on `DMZ01`.
3. Root on `DMZ01`.
4. Foothold on `DEV01`.
5. Root on `DEV01`.
6. Foothold on `MS01`.
7. Root on `MS01`.
8. Root on `DC01`.
9. Foothold on `MGMT01`.
10. Root on `MGMT01`.

Not every step has a flag, and some flags are optional. If you finish blind in **≤ 5 days**, you are likely ready. If you needed heavy walkthrough help, refine methodology and get more CTF practice. Small nudges after genuinely trying are fine; being stuck for more than a day is not productive.

> [!tip] AEN ≠ exam part II
> Use AEN to test methodology, then forget it. Do not assume an approach will fail (or work) in the exam because it did in AEN.

### 4. Boxes: only if you lack CTF experience

- **Experienced:** skip random HTB boxes. They contain out-of-scope techniques and poor time ROI. 3–4 for fun is fine.
- **Inexperienced:** do roughly one retired easy/medium Linux or Windows box per module. The goal is the *feel* of an unguided box and independent research, not new techniques.

TJNull's OSCP list and IppSec's unofficial CPTS playlist are common recommendations, but the playlist is more valuable than the boxes for exam alignment.

### 5. Watch IppSec's CPTS playlist as a methodology stress test

At every step of each walkthrough, pause and ask: **“What would I do next?”**

- If the answer uses an out-of-scope technique, note it and move on.
- If it uses path material and you would *not* have thought of it, your methodology has a gap.
- Update the checklist immediately.

This is one of the highest-value preparation exercises.

### 6. Bullet-proof your methodology

Write an algorithm per scenario: if followed blindly, it should eventually get you through. Checkboxes are ideal for tracking attempted techniques.

Minimum methodology set:

- [ ] External/internal service enumeration
- [ ] Web application enumeration and exploitation
- [ ] Active Directory enumeration
- [ ] AD credential attacks (Kerberoast, AS-REP, spraying, GPP, ACL, ADCS)
- [ ] Linux privilege escalation
- [ ] Windows privilege escalation
- [ ] Credential dumping and pillaging
- [ ] Pivoting and file transfer
- [ ] Shells and payload selection
- [ ] Reporting triggers

Test each methodology against skill assessments and AEN. A methodology that only works when you already know the answer is not a methodology.

## Exam-day tactics

### Take all the time off you can

The author spent **> 90% of waking hours** on the exam for ten days. Twelve flags came at **7 days 10 hours**; the report was submitted on **day 9**, leaving almost a day. Juggling work or school makes a first-attempt pass much harder.

### Protect your body

- Meal-prep or keep quick, nutritious food available.
- Keep a large water bottle at the desk.
- Use a Pomodoro timer; stand, walk, and stretch.
- Sleep. Ten days of sleep debt destroys pattern recognition.

### Write the report as you go

Use a **trigger-based** method (see [[pending/field-manual/cpts-report-playbook|CPTS Report Playbook]]). When a milestone happens, stop and fill the mapped report fields. By the last flag the report should be > 90% complete.

### Expect the exam to stay close to the path — but not identical

Do not study OSCP/ProLab/other-platform material expecting it to appear. Conversely, “everything is on the path” does **not** mean you will only see memorised scenarios. The course teaches independent research; the exam expects you to handle novel situations built from path fundamentals.

### Flag 1 and flag 9 are filters

- **Flag 1:** average reported time is 2–3 days, but that statistic suffers from survivorship bias. Prepared candidates often get it in hours (the author: ~4 hours). If you are slow, check fundamentals and mindset, not exotic tricks.
- **Flag 9:** historically the hardest and the point where most flag-1 passers fail. Treat it as a harder but solvable box; do not let it become mythical.
- Your personal roadblock may be an “easy” flag. That is normal. Do not compare your pace to Discord milestones.

### When stuck

Follow this ladder in order:

1. Re-read your methodology and confirm you actually completed each step.
2. Check your notes for the exact parameters, wordlists, and protocols already tried.
3. Search the Academy material (cheatsheets *and* full module text).
4. Retry key techniques with different parameters/protocols — twice, if needed.
5. Do targeted online research; avoid rabbit holes unrelated to the scenario.
6. Take a break, walk, reset assumptions, restart the methodology.
7. Ask for a nudge only after the above.

Document every attempt, including parameters. “I tried SMB” is not a note.

### Use AI as a search engine, not an oracle

ChatGPT is fast for syntax, script scaffolding, and explanations. It also invents confident answers. During his exam, the author was told an idea “would not work”; further research showed otherwise, and it worked. Verify with documentation and your own reasoning.

### Think dumber

Rank candidate solutions by complexity and try the simplest first. The exam is hard enough that stress makes people invent elaborate chains where a default credential or a misconfigured share is the answer. Low-hanging fruit first, then the multi-step chain.

### Do not chase flags 13 and 14 early

Both criteria must pass. Once you have 12 flags, additional flags add **zero** certification value. Spend that time perfecting the report, which is subjective. Only hunt 13–14 after the report is genuinely submission-ready.

### Second attempt exists — do not plan around it

You get two attempts, but the second must start within 14 days of feedback (which can take 20 business days). Treat it as insurance, not a strategy. Do not expect graders to reveal which modules to review.

## Timeline reference

| Milestone | Author's result |
|---|---|
| Field manual at exam start | 376 nodes, 114,331 words |
| First flag | ~4 hours |
| Twelfth flag | 7 days 10 hours |
| Report submitted | Day 9, early evening |
| Time left | Almost a full day |
| Result | Pass, first attempt, 13/14 flags |

## Pre-exam checklist

- [ ] Path 100% complete; all skill assessments done.
- [ ] AEN completed blind (or with minimal nudges) and methodology updated.
- [ ] Field manual searchable and organised by phase.
- [ ] Written methodologies for every major scenario.
- [ ] Report template installed (SysReptor + HTB CPTS template) and tested.
- [ ] Trigger table printed/opened beside the report.
- [ ] Payload/listener cheat sheet verified on the exam VPN.
- [ ] Time off booked for the full window; sleep and food plan ready.
- [ ] Note-taking template for hosts, credentials, flags, and changes.

## References

- [CPTS Tips & Tricks](https://www.brunorochamoura.com/posts/cpts-tips/)
- [CPTS Reporting: The Easy Way](https://www.brunorochamoura.com/posts/cpts-report/)
- [Road to CPTS](https://www.brunorochamoura.com/posts/road-to-cpts/)
- [My HTB CPTS Experience](https://www.brunorochamoura.com/posts/cpts-experience/)
- [IppSec — Unofficial CPTS Playlist](https://www.youtube.com/playlist?list=PLidcsTyj9JXItWpbRtTg6aDEj10_F17x5)
- [NetExec wiki](https://www.netexec.wiki/)
- [SysReptor docs](https://docs.sysreptor.com/)
