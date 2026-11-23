import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { slug } from "github-slugger";

export const baseline = JSON.parse(readFileSync(new URL("./fixtures/published-baseline.json", import.meta.url), "utf8"));

export function loadPublishedSources(dir) {
  const notes = [];
  function walk(current) {
    for (const name of readdirSync(current)) {
      const file = join(current, name);
      if (statSync(file).isDirectory()) walk(file);
      else if (name.endsWith(".md")) {
        const raw = readFileSync(file, "utf8");
        const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
        const frontmatter = match?.[1] || "";
        if (/^published:\s*false\s*$/m.test(frontmatter)) continue;
        const id = relative(dir, file).replace(/\\/g, "/").replace(/\.md$/, "")
          .split("/").map((segment) => slug(segment)).join("/").replace(/(^|\/)index$/, "");
        notes.push({ id, file, frontmatter, body: raw.slice(match?.[0].length || 0) });
      }
    }
  }
  walk(dir);
  return notes;
}
