import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "../src/lib/site.mjs";
import { isFieldManualId, tagListings } from "../src/lib/publish.mjs";
import { normalizeSearch } from "../src/lib/search.mjs";
import { checkLinks, htmlFiles, resolvePage } from "./check-links.mjs";
import { baseline, loadPublishedSources } from "./publication.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const sorted = (values) => [...values].sort();
const decode = (value) => value.replace(/&(?:amp|quot|apos|lt|gt|#(?:x[\da-f]+|\d+));/gi, (entity) => {
  const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
  return String.fromCodePoint(entity[2].toLowerCase() === "x" ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10));
});

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
}

export function checkPublication(distDir, options = {}) {
  const reference = options.baseline || baseline;
  const sources = options.sources || loadPublishedSources(join(here, "..", "..", "pending"));
  const origin = options.origin || SITE.url;
  const errors = [];
  let checks = 0;
  let assets = 0;
  const verify = (label, fn) => {
    checks++;
    try { fn(); } catch (error) { errors.push({ check: label, detail: error.message }); }
  };
  const html = (pathname) => {
    const file = resolvePage(distDir, pathname);
    assert.ok(file, `Missing generated route: ${pathname}`);
    return readFileSync(file, "utf8");
  };
  const files = htmlFiles(distDir);
  const noteUrl = (id) => `/notes/${id}/`;
  const entries = JSON.parse(readFileSync(join(distDir, "search-index.json"), "utf8"));
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const notes = entries.map((entry) => ({ id: entry.id, data: { tags: entry.tags } }));
  const sharedTags = [];

  verify("exact source and search-index membership", () => {
    assert.deepEqual(sorted(sources.map((note) => note.id)), reference.publishedIds);
    assert.deepEqual(sorted(entries.map((entry) => entry.id)), reference.publishedIds);
    assert.equal(byId.size, entries.length, "Duplicate search IDs");
  });
  verify("exact generated detail routes", () => {
    const detailIds = files.map((file) => relative(distDir, file).replace(/\\/g, "/"))
      .filter((path) => path.startsWith("notes/") && path !== "notes/index.html")
      .map((path) => path.replace(/^notes\//, "").replace(/\/index\.html$/, ""));
    assert.deepEqual(sorted(detailIds), reference.publishedIds);
  });

  for (const source of sources) {
    verify(`full text, URL, and section: ${source.id}`, () => {
      const entry = byId.get(source.id);
      assert.ok(entry, "Missing search entry");
      assert.equal(entry.url, noteUrl(source.id));
      assert.equal(entry.section, isFieldManualId(source.id) ? "notes" : "writeups");
      assert.ok(entry.text.includes(normalizeSearch(source.body)), "Search body was omitted or truncated");
      assert.equal(normalizeSearch(entry.text), entry.text);
      assert.ok(entry.text.startsWith(entry.metadata));
      const page = html(entry.url);
      const canonical = [...page.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]))
        .find((attrs) => attrs.rel === "canonical");
      assert.equal(canonical?.href, `${origin}${entry.url}`);
      const article = page.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] || page;
      const header = article.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1] || "";
      const tagLinks = [...header.matchAll(/<a\b[^>]*>/gi)].map((match) => attributes(match[0]).href);
      for (const tag of entry.tags) assert.ok(tagLinks.includes(`/${entry.section}/?tag=${encodeURIComponent(tag)}`), `Wrong detail tag link: ${tag}`);
    });
  }

  for (const section of ["notes", "writeups"]) {
    verify(`isolated ${section} listing and metadata fallback`, () => {
      const items = [...html(`/${section}/`).matchAll(/<a\b[^>]*\bdata-id="[^"]+"[^>]*>/gi)].map((match) => attributes(match[0]));
      const expected = reference.publishedIds.filter((id) => isFieldManualId(id) === (section === "notes"));
      assert.deepEqual(sorted(items.map((item) => item["data-id"])), expected);
      for (const item of items) {
        const fallback = JSON.parse(item["data-entry"]);
        const full = byId.get(item["data-id"]);
        assert.equal(item.href, noteUrl(item["data-id"]));
        assert.equal(fallback.id, full.id);
        assert.equal(fallback.url, full.url);
        assert.equal(fallback.section, section);
        assert.equal(fallback.metadata, full.metadata);
        assert.equal(fallback.text, fallback.metadata);
      }
    });
  }

  verify("every tag exposes the exact section counts and filter links", () => {
    const page = html("/tags/");
    const links = [...page.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
      ...attributes(match[1]), text: decode(match[2].replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim(),
    }));
    for (const tag of new Set(entries.flatMap((entry) => entry.tags))) {
      const listings = tagListings(notes, tag);
      if (listings.length > 1) sharedTags.push({ tag, notes: listings[0].count, writeups: listings[1].count });
      for (const listing of listings) {
        const label = `${tag}${listings.length > 1 ? ` (${listing.label})` : ""} ${listing.count}`;
        assert.ok(links.some((link) => link.href === listing.url && link.text === label), `Missing tag link/count: ${listing.url}`);
      }
    }
    if (reference.sharedTags) assert.deepEqual(sharedTags.sort((a, b) => a.tag.localeCompare(b.tag)), reference.sharedTags);
  });

  verify("RSS contains every preserved detail URL once", () => {
    const rss = readFileSync(join(distDir, "rss.xml"), "utf8");
    const links = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => decode(match[1].match(/<link>([^<]+)<\/link>/)?.[1] || ""));
    assert.deepEqual(sorted(links), reference.publishedIds.map((id) => `${origin}${noteUrl(id)}`).sort());
  });
  verify("sitemap contains every preserved detail URL once", () => {
    const sitemapIndex = readFileSync(join(distDir, "sitemap-index.xml"), "utf8");
    const sitemaps = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(decode(match[1])));
    assert.ok(sitemaps.length > 0);
    const urls = sitemaps.flatMap((url) => {
      assert.equal(url.origin, origin);
      return [...readFileSync(join(distDir, url.pathname.slice(1)), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
    });
    const details = urls.filter((url) => new URL(url).pathname.startsWith("/notes/") && new URL(url).pathname !== "/notes/");
    assert.deepEqual(sorted(details), reference.publishedIds.map((id) => `${origin}${noteUrl(id)}`).sort());
    for (const url of urls) {
      assert.equal(new URL(url).origin, origin);
      assert.ok(resolvePage(distDir, new URL(url).pathname), `Missing sitemap page: ${url}`);
    }
  });

  verify("Active's original redacted screenshots survive the build", () => {
    if (!reference.activeImages.length) return;
    const page = html("/notes/htb-writeup/active/");
    const images = [...page.matchAll(/<img\b[^>]*>/gi)].map((match) => attributes(match[0]))
      .filter((image) => image.src?.startsWith("/images/htb-active-"));
    assert.deepEqual(images.map((image) => image.src), reference.activeImages.map((image) => image.src));
    for (const expected of reference.activeImages) {
      const image = images.find((entry) => entry.src === expected.src);
      assert.equal(image.loading, "lazy");
      const file = resolvePage(distDir, expected.src);
      assert.ok(file, `Missing screenshot: ${expected.src}`);
      assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), expected.sha256, expected.src);
      assert.ok(page.includes(`href="${expected.src}"`), `Missing full-resolution image link: ${expected.src}`);
    }
  });

  const ids = new Map();
  for (const file of files) {
    const page = readFileSync(file, "utf8");
    const from = `/${relative(distDir, file).replace(/\\/g, "/").replace(/(^|\/)index\.html$/, "$1")}`;
    for (const match of page.matchAll(/<(?:a|link|script|img|source|video|audio)\b[^>]*>/gi)) {
      const attrs = attributes(match[0]);
      const urls = [attrs.href, attrs.src, attrs.poster,
        ...(attrs.srcset && !attrs.srcset.startsWith("data:") ? attrs.srcset.split(",").map((candidate) => candidate.trim().split(/\s+/)[0]) : [])].filter(Boolean);
      for (const raw of urls) {
        const url = new URL(raw, `${origin}${from}`);
        if (url.origin !== origin) continue;
        assets++;
        verify(`internal URL: ${from} -> ${raw}`, () => {
          const target = resolvePage(distDir, url.pathname);
          assert.ok(target, "Missing local page/asset");
          if (url.hash && target.endsWith(".html")) {
            if (!ids.has(target)) ids.set(target, new Set([...readFileSync(target, "utf8").matchAll(/\sid="([^"]+)"/g)].map((id) => decode(id[1]))));
            assert.ok(ids.get(target).has(decodeURIComponent(url.hash.slice(1))), "Missing local anchor");
          }
        });
      }
    }
  }

  verify("no leaked vault wikilinks", () => {
    const links = checkLinks(distDir);
    assert.deepEqual(links.literalWikilinks, []);
  });
  return { pages: files.length, notes: entries.length, checks, assets, sharedTags, errors };
}

function main() {
  const distDir = resolve(process.argv[2] || join(here, "..", "dist"));
  if (!existsSync(distDir)) throw new Error(`Missing ${distDir}; run the build first.`);
  const result = checkPublication(distDir);
  for (const error of result.errors) console.error(`${error.check}: ${error.detail}`);
  console.log(`check-publication: ${result.pages} pages, ${result.notes} notes, ${result.assets} internal URLs, ${result.errors.length} problem(s).`);
  if (result.errors.length) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
