// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { slug as githubSlug } from "github-slugger";
import { remarkWikilinkImages } from "./src/plugins/remark-wikilink-images.mjs";
import { remarkWikilinks } from "./src/plugins/remark-wikilinks.mjs";

// note folder -> slug -> mtime, scanned once at config load for sitemap lastmod
// (notes carry no `date:` field, so the file's modified time is the best signal)
const CONTENT_ROOT = join(import.meta.dirname, "..", "pending");
const NOTE_DATES = new Map();
function scan(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) scan(p);
    else if (entry.endsWith(".md")) {
      // same id rules as Astro's glob loader: slug each segment, drop trailing /index
      const key = relative(CONTENT_ROOT, p).replace(/\\/g, "/").replace(/\.md$/, "")
        .split("/").map((seg) => githubSlug(seg)).join("/").replace(/\/index$/, "");
      NOTE_DATES.set(key, statSync(p).mtime.toISOString());
    }
  }
}
try { scan(CONTENT_ROOT); } catch { /* content missing: build will fail anyway */ }

// https://astro.build/config
export default defineConfig({
  site: "https://f4zzie.dev",
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      serialize(item) {
        const m = item.url.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "").match(/^\/notes\/(.+)$/);
        if (m && NOTE_DATES.has(m[1])) item.lastmod = NOTE_DATES.get(m[1]);
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
    },
    remarkPlugins: [remarkWikilinkImages, remarkWikilinks],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
