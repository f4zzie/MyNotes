import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Notes live in the repo-root pending vault so the public site can build directly
// from the Obsidian-friendly markdown collection.
const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "../pending" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    published: z.boolean().default(true),
    // New notes are official only when explicitly promoted. Existing notes
    // without this field remain available in the archive.
    status: z.enum(["official", "archive"]).default("archive"),
    // optional cover image (path under /images/…). When absent, templates
    // render a labeled placeholder so you can drop the file in later.
    image: z.string().optional(),
  }),
});

export const collections = { notes };
