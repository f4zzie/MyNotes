import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Notes live at repo-root ../content so the vault stays clean & Obsidian-friendly.
const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "../content" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    published: z.boolean().default(true),
    // optional cover image (path under /images/…). When absent, templates
    // render a labeled placeholder so you can drop the file in later.
    image: z.string().optional(),
  }),
});

export const collections = { notes };
