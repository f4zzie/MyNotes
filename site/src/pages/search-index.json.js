import { getArchiveNotes } from "../lib/notes.mjs";
import { buildSearchIndex } from "../lib/search.mjs";

export async function GET() {
  const notes = await getArchiveNotes();
  return new Response(JSON.stringify(buildSearchIndex(notes)), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
