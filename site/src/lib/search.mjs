import { isFieldManualId } from "./publish.mjs";

export function normalizeSearch(value = "") {
  return String(value).normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim();
}

export function createSearchEntry(note) {
  const { id, data } = note;
  const title = data.title || "";
  const category = data.category || "";
  const tags = (data.tags || []).map(normalizeSearch);
  const url = note.url || `/notes/${id}/`;
  const metadata = normalizeSearch([title, category, ...tags, data.description || "", id].join(" "));
  return {
    id,
    url,
    title,
    category,
    tags,
    section: isFieldManualId(id) ? "notes" : "writeups",
    metadata,
    text: normalizeSearch(`${metadata} ${note.body || ""}`),
  };
}

export function buildSearchIndex(notes) {
  return notes.filter((note) => note.data.published !== false).map(createSearchEntry);
}

export function parseSearchQuery(query = "") {
  const groups = [[]];
  for (const match of String(query).matchAll(/"([^"]+)"|(\|)|([^\s|]+)/gu)) {
    if (match[2]) groups.push([]);
    else {
      const term = normalizeSearch(match[1] || match[3]);
      if (term) groups.at(-1).push(term);
    }
  }
  return groups.filter((group) => group.length > 0);
}

export function filterSearchIndex(index, { q = "", cat = "all", tag = "all", section = "all" } = {}) {
  const groups = parseSearchQuery(q);
  const category = normalizeSearch(cat);
  const selectedTag = normalizeSearch(tag);
  return index
    .map((entry, order) => {
      if (category !== "all" && normalizeSearch(entry.category) !== category) return null;
      if (selectedTag !== "all" && !entry.tags.includes(selectedTag)) return null;
      if (section !== "all" && entry.section !== section) return null;
      const matches = groups.filter((group) => group.every((term) => entry.text.includes(term)));
      if (groups.length > 0 && matches.length === 0) return null;
      const title = normalizeSearch(entry.title);
      const score = matches.reduce((best, group) => Math.max(best, group.reduce((sum, term) =>
        sum + (title.includes(term) ? 10 : entry.metadata.includes(term) ? 3 : 1), 0)), 0);
      return { entry, score, order };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ entry }) => entry);
}

export function readSearchState(search = "") {
  const params = new URLSearchParams(search);
  return {
    q: params.get("q") || "",
    cat: params.get("cat") || "all",
    tag: normalizeSearch(params.get("tag") || "all"),
  };
}

export function searchStateUrl(href, state) {
  const url = new URL(href);
  for (const key of ["q", "cat", "tag"]) {
    const value = String(state[key] || "").trim();
    if (!value || (key !== "q" && normalizeSearch(value) === "all")) url.searchParams.delete(key);
    else url.searchParams.set(key, key === "tag" ? normalizeSearch(value) : value);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}
