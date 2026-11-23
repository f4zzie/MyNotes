import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FIELD_MANUAL_PREFIX, isFieldManualId } from "../src/lib/publish.mjs";
import { baseline, loadPublishedSources } from "./publication.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const vaultDir = join(here, "..", "..", "pending");

const sources = loadPublishedSources(vaultDir);

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
  const allIds = sources.map((note) => note.id);
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

test("preserves the exact published ID set from the section-split commit", () => {
  assert.equal(baseline.sourceCommit, "67092887a2a1858aec00f3e07df60afd58f25149");
  assert.deepEqual(sources.map((note) => note.id).sort(), baseline.publishedIds);
});

test("all field-manual pages remain explicitly published archive notes", () => {
  for (const note of sources.filter((entry) => isFieldManualId(entry.id))) {
    assert.match(note.frontmatter, /^published:\s*true\s*$/m, note.id);
    assert.match(note.frontmatter, /^status:\s*archive\s*$/m, note.id);
  }
});

test("Active retains all 19 original redacted screenshots and their exact bytes", () => {
  const active = sources.find((note) => note.id === "htb-writeup/active");
  const images = [...active.body.matchAll(/!\[\[([^\]|]+)/g)]
    .map((match) => `/images/${encodeURIComponent(match[1].split("/").at(-1))}`);
  assert.equal(baseline.activeImages.length, 19);
  assert.deepEqual(images, baseline.activeImages.map((image) => image.src));
  for (const image of baseline.activeImages) {
    const file = join(here, "..", "..", decodeURIComponent(image.src.slice(1)));
    assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), image.sha256, image.src);
  }
});
