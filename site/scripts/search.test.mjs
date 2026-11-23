import test from "node:test";
import assert from "node:assert/strict";
import { tagListings } from "../src/lib/publish.mjs";
import {
  buildSearchIndex,
  filterSearchIndex,
  normalizeSearch,
  parseSearchQuery,
  readSearchState,
  searchStateUrl,
} from "../src/lib/search.mjs";

const notes = [
  { id: "field-manual/ad", data: { title: "Active Directory", category: "Field Manual", tags: ["active-directory", "CPTS"], description: "Directory enumeration" }, body: "BloodHound DCOnly collector. Kerberos double-hop. msDS-AllowedToActOnBehalfOfOtherIdentity." },
  { id: "htb-writeup/active", data: { title: "Active", category: "HTB", tags: ["ctf", "active-directory"] }, body: "BloodHound and Kerberoasting" },
  { id: "picoctf/blockchain", data: { title: "Access Control", category: "picoCTF", tags: ["picoctf"] }, body: "A blockchain token" },
  { id: "field-manual/ticket", data: { title: "Kerberos double-hop", category: "Field Manual", tags: ["kerberos"] }, body: "An explicit credential" },
  { id: "private/hidden", data: { title: "Private note", published: false }, body: "unpublished sentinel" },
];
const index = buildSearchIndex(notes);
const ids = (results) => results.map((entry) => entry.id);

test("search index includes published bodies and retains every original detail URL", () => {
  assert.equal(index.length, 4);
  assert.equal(index[0].url, "/notes/field-manual/ad/");
  assert.equal(index[1].url, "/notes/htb-writeup/active/");
  assert.match(index[0].text, /msds-allowedtoactonbehalfofotheridentity/);
  assert.deepEqual(filterSearchIndex(index, { q: "unpublished sentinel" }), []);
});

test("body-only headings, command options and identifiers are searchable", () => {
  assert.deepEqual(ids(filterSearchIndex(index, { q: "DCOnly" })), ["field-manual/ad"]);
  assert.deepEqual(ids(filterSearchIndex(index, { q: "msDS-AllowedToActOnBehalfOfOtherIdentity" })), ["field-manual/ad"]);
});

test("normalizes case, Unicode width, and repeated whitespace", () => {
  assert.equal(normalizeSearch("  ＤＣＯｎｌｙ\nCOLLECTOR\t"), "dconly collector");
  assert.deepEqual(ids(filterSearchIndex(index, { q: "ＤＣＯｎｌｙ COLLECTOR" })), ["field-manual/ad"]);
});

test("multiple terms use AND semantics without requiring adjacency", () => {
  assert.deepEqual(ids(filterSearchIndex(index, { q: "collector Kerberos" })), ["field-manual/ad"]);
  assert.deepEqual(filterSearchIndex(index, { q: "collector blockchain" }), []);
});

test("quoted phrases and pipe-separated alternatives are explicit", () => {
  assert.deepEqual(parseSearchQuery('"Kerberos double-hop" | DCOnly collector'), [["kerberos double-hop"], ["dconly", "collector"]]);
  assert.deepEqual(parseSearchQuery('"a|b" | | token'), [["a|b"], ["token"]]);
  assert.equal(filterSearchIndex(index, { q: '"Kerberos double-hop"' }).length, 2);
  assert.equal(filterSearchIndex(index, { q: "DCOnly | blockchain" }).length, 2);
  assert.deepEqual(filterSearchIndex(index, { q: '"collector Kerberos"' }), []);
});

test("tag filters are exact, case-insensitive, and never match partial tags", () => {
  assert.deepEqual(ids(filterSearchIndex(index, { tag: "CTF" })), ["htb-writeup/active"]);
  assert.deepEqual(ids(filterSearchIndex(index, { tag: "picoctf" })), ["picoctf/blockchain"]);
  assert.deepEqual(filterSearchIndex(index, { tag: "active" }), []);
});

test("query, category, tag and section filters combine rather than overwrite each other", () => {
  assert.deepEqual(ids(filterSearchIndex(index, { q: "BloodHound", cat: "Field Manual", tag: "active-directory", section: "notes" })), ["field-manual/ad"]);
  assert.deepEqual(filterSearchIndex(index, { q: "BloodHound", cat: "HTB", section: "notes" }), []);
});

test("each listing remains scoped to its own entries", () => {
  const manual = index.filter((entry) => entry.section === "notes");
  const writeups = index.filter((entry) => entry.section === "writeups");
  assert.equal(filterSearchIndex(manual, { q: "BloodHound" }).length, 1);
  assert.equal(filterSearchIndex(writeups, { q: "BloodHound" }).length, 1);
  assert.deepEqual(filterSearchIndex(manual, { q: "blockchain" }), []);
});

test("title matches rank above body matches and ties preserve listing order", () => {
  assert.deepEqual(ids(filterSearchIndex(index, { q: '"Kerberos double-hop"' })), ["field-manual/ticket", "field-manual/ad"]);
  assert.deepEqual(ids(filterSearchIndex(index)), ids(index));
  assert.deepEqual(ids(filterSearchIndex(index, { q: "BloodHound" })), ["field-manual/ad", "htb-writeup/active"]);
});

test("empty searches restore results and unknown filters give an empty result", () => {
  assert.equal(filterSearchIndex(index, { q: " \t\n " }).length, 4);
  assert.deepEqual(filterSearchIndex(index, { cat: "missing" }), []);
  assert.deepEqual(filterSearchIndex(index, { tag: "missing" }), []);
});

test("search state round-trips in shareable URLs with encoded punctuation", () => {
  const path = searchStateUrl("https://f4zzie.dev/notes/?utm_source=test#note-grid", { q: '"Kerberos double-hop" | RBCD + ACL', cat: "Field Manual", tag: "Active-Directory" });
  const url = new URL(path, "https://f4zzie.dev");
  assert.equal(url.pathname, "/notes/");
  assert.equal(url.hash, "#note-grid");
  assert.equal(url.searchParams.get("utm_source"), "test");
  assert.deepEqual(readSearchState(url.search), { q: '"Kerberos double-hop" | RBCD + ACL', cat: "Field Manual", tag: "active-directory" });
});

test("reset removes only search parameters and preserves the section route", () => {
  assert.equal(searchStateUrl("https://f4zzie.dev/writeups/?q=old&cat=HTB&tag=ctf&ref=link", { q: "", cat: "all", tag: "all" }), "/writeups/?ref=link");
  assert.deepEqual(readSearchState(""), { q: "", cat: "all", tag: "all" });
});

test("shared tags expose a separate exact-filter link for each section", () => {
  assert.deepEqual(tagListings(notes, "ACTIVE-DIRECTORY"), [
    { key: "notes", label: "Notes", count: 1, url: "/notes/?tag=active-directory" },
    { key: "writeups", label: "Writeups", count: 1, url: "/writeups/?tag=active-directory" },
  ]);
  assert.deepEqual(tagListings(notes, "CPTS"), [
    { key: "notes", label: "Notes", count: 1, url: "/notes/?tag=cpts" },
  ]);
  assert.deepEqual(tagListings(notes, "active"), []);
});
