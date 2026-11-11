import { getCollection } from "astro:content";
import { isFieldManualId } from "./publish.mjs";

function sortNotes(notes) {
  return notes
    .map((n) => ({
      ...n,
      url: `/notes/${n.id}/`, // id is "<category-folder>/<slug>"
    }))
    .sort((a, b) => {
      const da = a.data.date ? +a.data.date : 0;
      const db = b.data.date ? +b.data.date : 0;
      if (db !== da) return db - da;
      return a.data.title.localeCompare(b.data.title);
    });
}

// Every published note (137). Note routes, categories, tags, archives, RSS
// and the sitemap are built from this.
export async function getArchiveNotes() {
  const all = await getCollection("notes", ({ data }) => data.published !== false);
  return sortNotes(all);
}

export function isFieldManual(note) {
  return isFieldManualId(note.id);
}

// Section a note is listed in: the field manual (/notes) or writeups (/writeups).
export function sectionOf(note) {
  return isFieldManual(note)
    ? { key: "notes", label: "Notes", url: "/notes/" }
    : { key: "writeups", label: "Writeups", url: "/writeups/" };
}

// Section listing that holds the most notes with this tag (tags rarely span both).
export function tagListingUrl(notes, tag) {
  const t = tag.toLowerCase();
  let fm = 0;
  let wr = 0;
  for (const n of notes) {
    if (!(n.data.tags || []).some((x) => x.toLowerCase() === t)) continue;
    if (isFieldManual(n)) fm++;
    else wr++;
  }
  return `${fm > wr ? "/notes" : "/writeups"}?tag=${encodeURIComponent(t)}`;
}

// Notes section: the CPTS field manual (hub + all pages below it).
export async function getFieldManualNotes() {
  return (await getArchiveNotes()).filter(isFieldManual);
}

// Writeups section: every published note outside the field manual.
export async function getWriteupNotes() {
  return (await getArchiveNotes()).filter((n) => !isFieldManual(n));
}

// Official notes are promoted explicitly in frontmatter with status: official.
// Only the curated homepage uses this subset.
export async function getNotes() {
  const archive = await getArchiveNotes();
  return archive.filter((n) => n.data.status === "official");
}

// Folder hubs: pending/<dir>/index.md gets the id "<dir>" from Astro's glob
// loader, so it is served at /notes/<dir>/ (the folder route).
export function isSectionIndex(note) {
  return /(^|[\\/])index\.md$/i.test(note.filePath || "");
}

// Hub notes that contain this note, outermost first (used for breadcrumbs).
export function ancestorNotes(notes, note) {
  const byId = new Map(notes.map((n) => [n.id, n]));
  const segments = note.id.split("/");
  const out = [];
  for (let i = 1; i < segments.length; i++) {
    const parent = byId.get(segments.slice(0, i).join("/"));
    if (parent) out.push(parent);
  }
  return out;
}

// Everything below a hub, grouped by the next path segment (e.g. phase folder).
// Returns [{ key, hub, items }] where `hub` is the sub-folder's index note (if
// any) and `items` are its descendants, ordered by path so numbered folders and
// nested sub-hubs keep their vault order. Loose files directly under the hub
// are grouped under key null.
export function sectionGroups(notes, hub) {
  const prefix = `${hub.id}/`;
  const groups = new Map();
  for (const n of notes) {
    if (!n.id.startsWith(prefix)) continue;
    const rest = n.id.slice(prefix.length);
    const [head, ...tail] = rest.split("/");
    const isFolder = tail.length > 0 || isSectionIndex(n);
    const key = isFolder ? head : null;
    if (!groups.has(key)) groups.set(key, { key, hub: null, items: [] });
    const g = groups.get(key);
    if (isFolder && tail.length === 0) g.hub = n;
    else g.items.push({ note: n, depth: Math.max(0, tail.length - 1) });
  }
  for (const g of groups.values()) g.items.sort((a, b) => a.note.id.localeCompare(b.note.id));
  return [...groups.values()].sort((a, b) =>
    a.key === null ? 1 : b.key === null ? -1 : a.key.localeCompare(b.key)
  );
}

export function groupByCategory(notes) {
  const map = new Map();
  for (const n of notes) {
    if (!map.has(n.data.category)) map.set(n.data.category, []);
    map.get(n.data.category).push(n);
  }
  return map;
}

// Related notes: same category first, then shared tags, capped.
export function relatedNotes(notes, current, limit = 4) {
  const others = notes.filter((n) => n.id !== current.id);
  const score = (n) => {
    let s = n.data.category === current.data.category ? 5 : 0;
    const t = new Set(current.data.tags || []);
    for (const tag of n.data.tags || []) if (t.has(tag)) s += 1;
    return s;
  };
  return others
    .map((n) => ({ n, s: score(n) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.n);
}
