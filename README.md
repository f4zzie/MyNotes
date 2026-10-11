# f4zzie.dev — Cybersecurity Research Vault

[![Live](https://img.shields.io/badge/f4zzie.dev-Live-00e676?style=for-the-badge)](https://f4zzie.dev/)
[![Astro](https://img.shields.io/badge/Astro-static-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)

A public archive of hands-on cybersecurity research — **malware analysis, reverse engineering,
binary exploitation, Hack The Box and CTF writeups**. Every writeup is its own page, engineered
to be fast, accessible, and discoverable on search.

**Live site:** https://f4zzie.dev/

> **Status: rebuilding from scratch.** The vault is being reorganised. The previous
> 84 writeups are parked in [`pending/`](pending/) while the site is rebuilt, so the live
> feed is intentionally empty until notes are curated back into `content/` one by one.

---

## Layout

The site is a two-column reading layout inspired by the Chirpy blog theme, in f4zzie's
terminal-green palette:

- **Left sidebar** — avatar, identity, and primary nav: Home · Writeups · Categories · Tags · Archives · About, with GitHub / X / Hack The Box / RSS / email. Collapses to a drawer on mobile.
- **Main feed** — writeups as cards (category, title, excerpt, tags).
- **Right panel** — "recently added" and "trending tags" widgets (wide screens).
- **Index pages** — `/categories`, `/tags`, `/archives`, plus `/notes` with live search and category/tag filtering.

Typography is a single professional typeface (**DM Sans**) everywhere; **IBM Plex Mono** is
reserved for code blocks only.

## Architecture

This repo is **both an Obsidian vault and a statically-generated website**.

```
content/          Published Markdown notes — the single source the site builds from.
                  One folder per category; each note carries SEO frontmatter.
pending/          Notes staged out of the live build (drafts / rebuild backlog).
                  Same structure as content/; nothing here is published.
images/           Embedded images (synced into the site build).
site/             Astro project — renders content/ into static, pre-rendered HTML.
```

Not committed (kept on disk / in the private vault only): the raw lab and challenge
dirt — `/HTB/`, `/THM/`, `/perfectRootCTF/` (nmap scans, extracted forensics, hash
dumps). Only the distilled writeups in `content/` are public.

- **Framework:** [Astro](https://astro.build) (static output, ~zero client JS).
- **Styling:** Tailwind CSS v4, terminal green `#00e676` on near-black, dark-first.
- **SEO built in:** one indexable page per note, per-page `<title>`/meta/canonical,
  Open Graph + Twitter cards, JSON-LD (`Person`, `WebSite`, `TechArticle`, `BreadcrumbList`),
  auto `sitemap-index.xml`, `robots.txt`, and an RSS feed.
- **Deploy:** GitHub Actions builds `site/` and publishes to GitHub Pages on push to `main`.

### Publishing a note

Move (or create) a markdown file under `content/<category>/` with frontmatter:

```yaml
---
title: "Return-Oriented Programming Fundamentals"
description: "Chaining gadgets to bypass NX and build a ROP exploit end to end."
category: "Binary Exploitation"
tags: [rop, pwntools, pwn]
published: true      # set false to keep it out of the live build
---
```

Then write standard Markdown. Obsidian image embeds `![[name.png]]` are converted to
`/images/name.png` at build time. To unpublish, move the file back into `pending/`.

> Note: the home feed and RSS currently surface **picoCTF** notes (`category` starting
> with `picoCTF`). Adjust the filter in `site/src/lib/notes.mjs` to widen the scope.

## Local development

```bash
cd site
npm install
npm run dev        # http://localhost:4321
npm run build      # -> site/dist (static)
npm run preview
```

## Connect

- **GitHub:** [@f4zzie](https://github.com/f4zzie)
- **X:** [@f4zzi3](https://x.com/f4zzi3)
- **Website:** [f4zzie.dev](https://f4zzie.dev/)
