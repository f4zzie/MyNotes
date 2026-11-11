# f4zzie.dev — Cybersecurity Research Vault

[![Live](https://img.shields.io/badge/f4zzie.dev-Live-00e676?style=for-the-badge)](https://f4zzie.dev/)
[![Astro](https://img.shields.io/badge/Astro-static-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)

A public archive of hands-on cybersecurity research — **malware analysis, reverse engineering,
binary exploitation, Hack The Box and CTF writeups**. Every writeup is its own page, engineered
to be fast, accessible, and discoverable on search.

**Live site:** https://f4zzie.dev/

## Published writeups

1. [Active — Hack The Box](https://f4zzie.dev/notes/htb-writeup/active/) — October 25, 2026.
   Anonymous SMB, Group Policy Preferences password recovery, and Kerberoasting.
   [Read in the vault](pending/htb-writeup/active.md).

## Publishing from the vault

The Astro site in `site/` reads Markdown directly from `pending/`.
Notes with `published: true` and `status: official` appear on the homepage,
writeup listing, category pages, tags, and RSS. Other published notes remain in the archive.

Store screenshots in `images/` and embed them as `![[filename.png|Descriptive alt text]]`.
The build copies those images to the website; screenshot links open the original resolution.

To check the site locally:

```bash
cd site
npm ci
npm test
npm run build
npm run preview
```

Pushing to `main` publishes through the existing GitHub Pages workflow at `f4zzie.dev`.

## Connect

- **GitHub:** [@f4zzie](https://github.com/f4zzie)
- **X:** [@f4zzi3](https://x.com/f4zzi3)
- **Website:** [f4zzie.dev](https://f4zzie.dev/)
