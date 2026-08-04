// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { remarkWikilinkImages } from "./src/plugins/remark-wikilink-images.mjs";

// note folder -> slug -> ISO date, scanned once at config load for sitemap lastmod
const CONTENT_ROOT = join(import.meta.dirname, "..", "content");
const NOTE_DATES = new Map();
function scan(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) scan(p);
    else if (entry.endsWith(".md")) {
      const raw = readFileSync(p, "utf8");
      const m = raw.match(/^date:\s*(.+)$/m);
      if (!m) continue;
      const date = new Date(m[1].trim());
      if (Number.isNaN(date.getTime())) continue;
      const key = relative(CONTENT_ROOT, p).replace(/\\/g, "/").replace(/\.md$/, "");
      NOTE_DATES.set(key, date.toISOString());
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
    remarkPlugins: [remarkWikilinkImages],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
