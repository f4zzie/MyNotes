// Central site metadata + category presentation. Reused across pages for SEO.
export const SITE = {
  name: "f4zzie.dev",
  author: "f4zzie",
  title: "f4zzie.dev | Cybersecurity Research, CTF Writeups & Malware Analysis",
  description:
    "Cybersecurity research vault by f4zzie: hands-on malware analysis, reverse engineering, binary exploitation, Hack The Box and CTF writeups with full attack chains.",
  url: "https://f4zzie.dev",
  ogImage: "/og-default.png",
  twitter: "@f4zzi3",
  github: "https://github.com/f4zzie",
  x: "https://x.com/f4zzi3",
  htb: "https://app.hackthebox.com/profile/1381395",
  email: "contact@f4zzie.dev",
  keywords: [
    "cybersecurity",
    "malware analysis",
    "reverse engineering",
    "binary exploitation",
    "CTF writeups",
    "Hack The Box",
    "pwn",
    "red team",
    "penetration testing",
    "picoCTF",
  ],
};

// category display name -> { color, slug, blurb } — colors carried over from
// the previous React build's categoryMeta.ts so the brand is unchanged.
export const CATEGORY_META = {
  "Malware Analysis": {
    color: "#14b8a6",
    blurb: "Static analysis, PE headers, Windows APIs, strings, and process-injection tradecraft.",
  },
  "Binary Exploitation": {
    color: "#f59e0b",
    blurb: "Stack and heap exploitation, ROP, format strings, protections, pwndbg and pwntools.",
  },
  "Reverse Engineering": {
    color: "#8b5cf6",
    blurb: "Crackmes, cipher challenges, x86 assembly, Ghidra, Cutter and x64dbg workflows.",
  },
  "HTB Writeup": {
    color: "#84cc16",
    blurb: "Hack The Box machine and Sherlock attack chains: recon, exploitation, and root.",
  },
  "CTF Writeup": {
    color: "#ef4444",
    blurb: "Capture-the-flag solutions across pwn, web, forensics, and crypto categories.",
  },
  Resources: {
    color: "#0ea5e9",
    blurb: "Curated tools, platforms, and learning references for offensive security.",
  },
  "picoCTF - Binary Exploitation": {
    color: "#f97316",
    blurb: "picoCTF pwn challenges with full exploitation walkthroughs.",
  },
  "picoCTF - Reverse Engineering": {
    color: "#a855f7",
    blurb: "picoCTF reverse-engineering challenge writeups.",
  },
  "picoCTF - Web Exploitation": {
    color: "#06b6d4",
    blurb: "picoCTF web-exploitation challenge writeups.",
  },
  "picoCTF - General Skills": {
    color: "#22c55e",
    blurb: "picoCTF general-skills challenge writeups.",
  },
  "picoCTF - Blockchain": {
    color: "#eab308",
    blurb: "picoCTF blockchain and smart-contract challenge writeups.",
  },
};

export function categoryColor(name) {
  return CATEGORY_META[name]?.color || "#2dd4bf";
}
export function categoryBlurb(name) {
  return CATEGORY_META[name]?.blurb || "";
}
export function slugifyCategory(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
