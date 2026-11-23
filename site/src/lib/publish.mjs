// The site has two sections built from the same `notes` collection:
//   Notes    = the CPTS field manual (pending/field-manual/**), listed at /notes
//   Writeups = every other published note, listed at /writeups
// Detail pages for both keep their /notes/<id>/ URLs; only the listings differ.
export const FIELD_MANUAL_PREFIX = "field-manual";

export function isFieldManualId(id) {
  return id === FIELD_MANUAL_PREFIX || id.startsWith(`${FIELD_MANUAL_PREFIX}/`);
}

export function tagListings(notes, tag) {
  const normalized = String(tag).normalize("NFKC").toLowerCase().trim();
  const counts = { notes: 0, writeups: 0 };
  for (const note of notes) {
    if (!(note.data.tags || []).some((value) => String(value).normalize("NFKC").toLowerCase().trim() === normalized)) continue;
    counts[isFieldManualId(note.id) ? "notes" : "writeups"]++;
  }
  return [
    { key: "notes", label: "Notes", count: counts.notes },
    { key: "writeups", label: "Writeups", count: counts.writeups },
  ]
    .filter((section) => section.count > 0)
    .map((section) => ({ ...section, url: `/${section.key}/?tag=${encodeURIComponent(normalized)}` }));
}
