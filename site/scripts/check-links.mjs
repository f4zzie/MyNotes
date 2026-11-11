/**
 * Link-integrity check for the built site (runs on postbuild).
 *
 * Fails (exit 1) when:
 *  - an internal /notes/... or /writeups/... link has no generated page in dist/
 *  - a /notes/...#fragment or /writeups/...#fragment link points at a heading id the page does not have
 *  - a vault wikilink ([[pending/...]]) survived as literal text outside code
 *
 * Usage: node scripts/check-links.mjs [distDir]   (default: ./dist)
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (entry.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Map a site path ("/notes/a/b/" or "/writeups/") to its built file, or null. */
export function resolvePage(distDir, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const clean = decoded.replace(/^\/+/, "").replace(/\/+$/, "");
  const candidates = [join(distDir, clean, "index.html"), join(distDir, `${clean}.html`), join(distDir, clean)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) || null;
}

const stripCode = (html) =>
  html.replace(/<pre[\s\S]*?<\/pre>/gi, "").replace(/<code[\s\S]*?<\/code>/gi, "");

export function checkLinks(distDir) {
  const files = htmlFiles(distDir);
  const idCache = new Map();
  const idsOf = (file) => {
    if (!idCache.has(file)) {
      const ids = new Set();
      for (const m of readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
      idCache.set(file, ids);
    }
    return idCache.get(file);
  };

  const broken = [];
  const badAnchors = [];
  const literalWikilinks = [];
  let checked = 0;

  for (const file of files) {
    const from = "/" + relative(distDir, file).replace(/\\/g, "/").replace(/(^|\/)index\.html$/, "$1");
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
      const href = m[1].replace(/&amp;/g, "&");
      if (!/^\/(notes|writeups)(\/|$|\?|#)/.test(href)) continue;
      checked++;
      const [beforeHash, hash = ""] = href.split("#");
      const pathname = beforeHash.split("?")[0];
      const target = resolvePage(distDir, pathname);
      if (!target) {
        broken.push({ from, href });
        continue;
      }
      if (hash) {
        let id = hash;
        try { id = decodeURIComponent(hash); } catch { /* keep raw */ }
        if (!idsOf(target).has(id)) badAnchors.push({ from, href });
      }
    }
    for (const m of stripCode(html).matchAll(/\[\[pending\/[^\]]*\]\]/g)) {
      literalWikilinks.push({ from, text: m[0] });
    }
  }
  return { pages: files.length, checked, broken, badAnchors, literalWikilinks };
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const distDir = resolve(process.argv[2] || join(here, "..", "dist"));
  if (!existsSync(distDir)) {
    console.error(`check-links: ${distDir} does not exist; run the build first.`);
    process.exit(1);
  }
  const r = checkLinks(distDir);
  const report = (label, list, fmt) => {
    if (!list.length) return;
    console.error(`\n${label} (${list.length}):`);
    for (const item of list) console.error(`  ${fmt(item)}`);
  };
  report("Broken /notes or /writeups links", r.broken, (b) => `${b.from} -> ${b.href}`);
  report("Missing heading anchors", r.badAnchors, (b) => `${b.from} -> ${b.href}`);
  report("Literal vault wikilinks in HTML", r.literalWikilinks, (b) => `${b.from}: ${b.text}`);
  const failed = r.broken.length + r.badAnchors.length + r.literalWikilinks.length;
  console.log(`check-links: ${r.pages} pages, ${r.checked} section links checked, ${failed} problem(s).`);
  if (failed) process.exit(1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
