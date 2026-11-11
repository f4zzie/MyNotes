import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { slug as githubSlug } from "github-slugger";
import { FIELD_MANUAL_PREFIX, isFieldManualId } from "../src/lib/publish.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const vaultDir = join(here, "..", "..", "pending");

function loadPublishedIds(dir) {
  const ids = [];
  function walk(current) {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith(".md")) {
        const raw = readFileSync(full, "utf8");
        const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        const published = !(fm && /^published:\s*false\s*$/m.test(fm[1]));
        if (!published) continue;
        const rel = relative(dir, full).replace(/\\/g, "/").replace(/\.md$/, "");
        const id = rel
          .split("/")
          .map((seg) => githubSlug(seg))
          .join("/")
          .replace(/(^|\/)index$/, "");
        ids.push(id);
      }
    }
  }
  walk(dir);
  return ids;
}

test("matches the field-manual hub itself", () => {
  assert.equal(FIELD_MANUAL_PREFIX, "field-manual");
  assert.equal(isFieldManualId("field-manual"), true);
});

test("matches field-manual descendants", () => {
  assert.equal(isFieldManualId("field-manual/01-information-gathering"), true);
  assert.equal(isFieldManualId("field-manual/01-information-gathering/index"), true);
  assert.equal(isFieldManualId("field-manual/03-exploitation/web-exploitation"), true);
});

test("does not match lookalike prefixes or other notes", () => {
  assert.equal(isFieldManualId("field-manuals/thing"), false);
  assert.equal(isFieldManualId("field-manual-notes"), false);
  assert.equal(isFieldManualId("binary-exploitation/pwndbg"), false);
  assert.equal(isFieldManualId("htb-writeup/active"), false);
});

test("every published note appears in exactly one section listing (52 + 85 = 137)", () => {
  const allIds = loadPublishedIds(vaultDir);
  const uniqueIds = new Set(allIds);
  assert.equal(uniqueIds.size, allIds.length, "no duplicate note ids");
  assert.equal(allIds.length, 137, "expected 137 published notes total");

  const fieldManual = allIds.filter((id) => isFieldManualId(id));
  const writeups = allIds.filter((id) => !isFieldManualId(id));

  assert.equal(fieldManual.length, 52, "expected 52 field-manual notes in /notes");
  assert.equal(writeups.length, 85, "expected 85 writeups in /writeups");

  const overlap = fieldManual.filter((id) => writeups.includes(id));
  assert.deepEqual(overlap, [], "no note may appear in both sections");

  const combined = new Set([...fieldManual, ...writeups]);
  assert.equal(combined.size, allIds.length, "no orphaned notes outside the two sections");
});
