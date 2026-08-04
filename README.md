# f4zzie.dev — Cybersecurity Research Vault

[![Live](https://img.shields.io/badge/f4zzie.dev-Live-0f9f8f?style=for-the-badge)](https://f4zzie.dev/)
[![CTF Writeups](https://img.shields.io/badge/CTF-Writeups-ef4444?style=for-the-badge)](https://f4zzie.dev/category/ctf-writeup/)
[![Malware Analysis](https://img.shields.io/badge/Malware-Analysis-14b8a6?style=for-the-badge)](https://f4zzie.dev/category/malware-analysis/)

A public archive of hands-on cybersecurity research — **malware analysis, reverse engineering,
binary exploitation, Hack The Box and CTF writeups**. Every writeup is its own page, engineered
to be fast, accessible, and discoverable on search.

**Live site:** https://f4zzie.dev/

---

## Architecture

This repo is **both an Obsidian vault and a statically-generated website**.

```
content/          Markdown notes (single source of truth, edited in Obsidian).
                  One folder per category; each note carries SEO frontmatter.
images/           Embedded images (synced into the site build).
site/             Astro project — renders content/ into static, pre-rendered HTML.
```

- **Framework:** [Astro](https://astro.build) (static output, ~zero client JS).
- **Styling:** Tailwind CSS v4, brand teal `#0f9f8f` / `#2dd4bf`, dark-first.
- **SEO built in:** one indexable page per note, per-page `<title>`/meta/canonical,
  Open Graph + Twitter cards, JSON-LD (`Person`, `WebSite`, `TechArticle`, `BreadcrumbList`),
  auto `sitemap-index.xml`, `robots.txt`, and an RSS feed.
- **Deploy:** GitHub Actions builds `site/` and publishes to GitHub Pages on push to `main`.

### Adding a note

Create a markdown file under `content/<category>/` with frontmatter:

```yaml
---
title: "Return-Oriented Programming Fundamentals"
description: "Chaining gadgets to bypass NX and build a ROP exploit end to end."
category: "Binary Exploitation"
tags: [rop, pwntools, pwn]
date: 2026-07-24
published: true      # set false to keep it out of the live build
---
```

Then write standard Markdown. Obsidian image embeds `![[name.png]]` are converted to
`/images/name.png` at build time.

## Local development

```bash
cd site
npm install
npm run dev        # http://localhost:4321
npm run build      # -> site/dist (static)
npm run preview
```

## Categories

Malware Analysis · Binary Exploitation · Reverse Engineering · HTB Writeups ·
CTF Writeups · picoCTF (Binary Exploitation, Reverse Engineering, Web, General Skills, Blockchain) ·
Resources

## Connect

- **GitHub:** [@f4zzie](https://github.com/f4zzie)
- **X:** [@f4zzi3](https://x.com/f4zzi3)
- **Website:** [f4zzie.dev](https://f4zzie.dev/)
