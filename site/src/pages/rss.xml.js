import rss from "@astrojs/rss";
import { SITE } from "../lib/site.mjs";
import { getNotes } from "../lib/notes.mjs";

export async function GET(context) {
  const notes = await getNotes();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      link: n.url,
      categories: [n.data.category, ...(n.data.tags || [])],
      ...(n.data.date ? { pubDate: new Date(n.data.date) } : {}),
    })),
    customData: `<language>en-us</language>`,
  });
}
