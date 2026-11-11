/**
 * Turns Obsidian note wikilinks that point into the vault (pending/...) into
 * standard markdown links to the generated note pages:
 *
 *   [[pending/field-manual/03-exploitation/web-exploitation|Web exploitation]]
 *     -> [Web exploitation](/notes/field-manual/03-exploitation/web-exploitation/)
 *   [[pending/a/b#Some Heading|alias]] -> /notes/a/b/#some-heading
 *   [[pending/a/index]]                -> /notes/a/
 *
 * URLs are built with the same rules Astro's glob loader uses for entry ids
 * (github-slugger per path segment, trailing /index dropped), so links always
 * match the routes produced by src/pages/notes/[...slug].astro. Heading
 * fragments use github-slugger as well, matching Astro's heading ids.
 *
 * Image embeds (![[...]]) are left to remark-wikilink-images, targets outside
 * pending/ are left untouched, and code (fenced or inline) is never rewritten
 * because it is stored in `code`/`inlineCode` nodes, not `text` nodes.
 */
import { visit } from "unist-util-visit";
import { slug as githubSlug } from "github-slugger";

const VAULT_PREFIX = "pending/";
// [[target]], [[target|alias]], [[target#heading]], [[target#heading|alias]]
// not preceded by "!" (embeds are handled elsewhere).
const WIKILINK = /(?<!!)\[\[([^\]|#]+?)(?:#([^\]|]+?))?(?:\|([^\]]+?))?\]\]/g;

/** Vault path ("pending/a/b.md") -> site URL ("/notes/a/b/"), or null if not a vault note. */
export function vaultPathToUrl(target, heading) {
  let path = target.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!path.startsWith(VAULT_PREFIX)) return null;
  path = path.slice(VAULT_PREFIX.length).replace(/\.md$/i, "").replace(/\/+$/, "");
  if (!path) return null;
  const id = path
    .split("/")
    .map((segment) => githubSlug(segment))
    .join("/")
    .replace(/(^|\/)index$/, "");
  const base = id ? `/notes/${id}/` : "/notes/";
  const hash = heading && heading.trim() ? `#${githubSlug(heading.trim())}` : "";
  return base + hash;
}

function defaultLabel(target, heading) {
  const name = target.trim().replace(/\.md$/i, "").split("/").filter(Boolean).pop() || target;
  return heading ? `${name} › ${heading.trim()}` : name;
}

export function remarkWikilinks() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      // Never nest anchors: a wikilink inside an existing link stays as text.
      if (parent.type === "link" || parent.type === "linkReference") return;
      const value = node.value;
      if (!value.includes("[[")) return;

      const parts = [];
      let last = 0;
      let m;
      WIKILINK.lastIndex = 0;
      while ((m = WIKILINK.exec(value)) !== null) {
        const [full, target, heading, alias] = m;
        const url = vaultPathToUrl(target, heading);
        if (!url) continue; // non-vault target: leave literal
        if (m.index > last) parts.push({ type: "text", value: value.slice(last, m.index) });
        parts.push({
          type: "link",
          url,
          children: [{ type: "text", value: (alias || defaultLabel(target, heading)).trim() }],
        });
        last = m.index + full.length;
      }
      if (!parts.length) return;
      if (last < value.length) parts.push({ type: "text", value: value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}
