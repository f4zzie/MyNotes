import { getCollection } from "astro:content";

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

// All published notes, including legacy material held in the archive.
export async function getArchiveNotes() {
  const all = await getCollection("notes", ({ data }) => data.published !== false);
  return sortNotes(all);
}

// Official notes are promoted explicitly in frontmatter with status: official.
// This keeps the homepage and /notes intentionally empty until notes are added.
export async function getNotes() {
  const archive = await getArchiveNotes();
  return archive.filter((n) => n.data.status === "official");
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
