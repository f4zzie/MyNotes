import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSearchIndex, createSearchEntry } from "../src/lib/search.mjs";
import { checkPublication } from "./check-publication.mjs";

const origin = "https://f4zzie.dev";
const encode = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

function fixture(t) {
  const root = existsSync("/tmp/opencode") ? "/tmp/opencode" : tmpdir();
  const dir = mkdtempSync(join(root, "publication-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const put = (path, contents) => {
    const file = join(dir, path);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, contents);
  };
  const sources = [
    { id: "field-manual", body: "A body-only DCOnly command.", data: { title: "Manual", category: "Field Manual", tags: ["shared"] } },
    { id: "htb-writeup/active", body: "A separate writeup body.", data: { title: "Active", category: "HTB", tags: ["shared"] } },
  ];
  const index = buildSearchIndex(sources);
  const image = Buffer.from("redacted screenshot fixture");
  const baseline = {
    publishedIds: sources.map((source) => source.id),
    activeImages: [{ src: "/images/htb-active-cover.png", sha256: createHash("sha256").update(image).digest("hex") }],
    sharedTags: [{ tag: "shared", notes: 1, writeups: 1 }],
  };
  for (const entry of index) {
    put(`notes/${entry.id}/index.html`, `<link rel="canonical" href="${origin}${entry.url}"><header><a href="/${entry.section}/?tag=shared">shared</a></header><p id="body">Body</p>${entry.section === "writeups" ? '<a href="/images/htb-active-cover.png"><img src="/images/htb-active-cover.png" loading="lazy"></a>' : ""}`);
  }
  for (const section of ["notes", "writeups"]) {
    const rows = sources.filter((source) => createSearchEntry(source).section === section).map((source) => {
      const entry = createSearchEntry({ ...source, body: "" });
      return `<a href="${entry.url}" data-id="${entry.id}" data-entry="${encode(JSON.stringify(entry))}">${entry.title}</a>`;
    });
    put(`${section}/index.html`, rows.join(""));
  }
  put("tags/index.html", '<a href="/notes/?tag=shared">shared (Notes) <b>1</b></a><a href="/writeups/?tag=shared">shared (Writeups) <b>1</b></a>');
  put("images/htb-active-cover.png", image);
  put("search-index.json", JSON.stringify(index));
  put("rss.xml", `<rss><channel>${index.map((entry) => `<item><link>${origin}${entry.url}</link></item>`).join("")}</channel></rss>`);
  put("sitemap-index.xml", `<sitemapindex><sitemap><loc>${origin}/sitemap-0.xml</loc></sitemap></sitemapindex>`);
  put("sitemap-0.xml", `<urlset>${index.map((entry) => `<url><loc>${origin}${entry.url}</loc></url>`).join("")}</urlset>`);
  return { dir, put, index, options: { baseline, sources, origin } };
}

test("built-publication guard verifies routes, full bodies, isolated listings, tags, feeds, assets, and screenshot bytes", (t) => {
  const { dir, options } = fixture(t);
  const result = checkPublication(dir, options);
  assert.deepEqual(result.errors, []);
  assert.equal(result.notes, 2);
  assert.deepEqual(result.sharedTags, options.baseline.sharedTags);
});

test("built-publication guard rejects omitted search bodies and changed original URLs", (t) => {
  const { dir, put, index, options } = fixture(t);
  index[0].text = index[0].metadata;
  index[1].url = "/writeups/active/";
  put("search-index.json", JSON.stringify(index));
  const result = checkPublication(dir, options);
  assert.ok(result.errors.some((error) => error.detail.includes("omitted or truncated")));
  assert.ok(result.errors.some((error) => error.check.includes("htb-writeup/active")));
});

test("built-publication guard rejects cross-section listings and missing shared-tag links", (t) => {
  const { dir, put, index, options } = fixture(t);
  put("notes/index.html", `<a href="${index[1].url}" data-id="${index[1].id}" data-entry="${encode(JSON.stringify(index[1]))}">Active</a>`);
  put("tags/index.html", '<a href="/notes/?tag=shared">shared (Notes) <b>2</b></a>');
  const result = checkPublication(dir, options);
  assert.ok(result.errors.some((error) => error.check.startsWith("isolated notes")));
  assert.ok(result.errors.some((error) => error.check.startsWith("every tag")));
});

test("built-publication guard rejects feed omissions and altered redacted screenshots", (t) => {
  const { dir, put, options } = fixture(t);
  put("rss.xml", "<rss><channel></channel></rss>");
  put("sitemap-0.xml", "<urlset></urlset>");
  put("images/htb-active-cover.png", "replacement image");
  const result = checkPublication(dir, options);
  assert.ok(result.errors.some((error) => error.check.startsWith("RSS")));
  assert.ok(result.errors.some((error) => error.check.startsWith("sitemap")));
  assert.ok(result.errors.some((error) => error.check.startsWith("Active's")));
});

test("built-publication guard checks non-section routes, local anchors, scripts, and encoded image assets", (t) => {
  const { dir, put, options } = fixture(t);
  put("index.html", '<a href="/category/missing/">category</a><a href="/notes/field-manual/#absent">anchor</a><script src="/missing.js"></script><img src="/images/Pasted%20image.png">');
  const result = checkPublication(dir, options);
  assert.equal(result.errors.filter((error) => error.check.startsWith("internal URL: /")).length, 4);
});
