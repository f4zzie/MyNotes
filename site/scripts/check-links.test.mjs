import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkLinks } from "./check-links.mjs";

function fixture(pages) {
  const dir = mkdtempSync(join(tmpdir(), "check-links-"));
  for (const [path, html] of Object.entries(pages)) {
    const file = join(dir, path);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, html);
  }
  return dir;
}

test("passes when every /notes and /writeups link resolves, including anchors and query strings", () => {
  const dir = fixture({
    "index.html": '<a href="/notes">notes</a><a href="/writeups?tag=htb">tag</a><a href="/about/">ext</a>',
    "notes/index.html": '<a href="/notes/field-manual/">hub</a><a href="/writeups#top">wr</a>',
    "writeups/index.html": '<h1 id="top">Writeups</h1><a href="/notes/field-manual/07-toolkit/#ad-tool-inventory">x</a>',
    "notes/field-manual/index.html": '<a href="/notes/field-manual/07-toolkit/#ad-tool-inventory">x</a>',
    "notes/field-manual/07-toolkit/index.html": '<h2 id="ad-tool-inventory">AD</h2>',
  });
  try {
    const r = checkLinks(dir);
    assert.equal(r.checked, 6);
    assert.deepEqual([r.broken, r.badAnchors, r.literalWikilinks], [[], [], []]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("reports missing pages, missing anchors and literal vault wikilinks across /notes and /writeups", () => {
  const dir = fixture({
    "notes/a/index.html": [
      '<a href="/notes/missing/">gone</a>',
      '<a href="/writeups/missing/">gone2</a>',
      '<a href="/notes/a/#nope">anchor</a>',
      '<a href="/writeups/#missing-anchor">anchor2</a>',
      "<p>[[pending/field-manual/x|X]]</p>",
      "<pre><code>[[pending/in-code|ok]]</code></pre><code>[[pending/inline]]</code>",
    ].join(""),
    "writeups/index.html": '<h1 id="present">Writeups</h1>',
  });
  try {
    const r = checkLinks(dir);
    assert.deepEqual(r.broken, [
      { from: "/notes/a/", href: "/notes/missing/" },
      { from: "/notes/a/", href: "/writeups/missing/" },
    ]);
    assert.deepEqual(r.badAnchors, [
      { from: "/notes/a/", href: "/notes/a/#nope" },
      { from: "/notes/a/", href: "/writeups/#missing-anchor" },
    ]);
    assert.deepEqual(r.literalWikilinks, [{ from: "/notes/a/", text: "[[pending/field-manual/x|X]]" }]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
