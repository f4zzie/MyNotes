/**
 * Turns Obsidian image embeds ![[name.png]] into standard markdown images
 * pointing at /images/name.png (served from public/images, synced from ../images).
 * Also handles ![[name.png|alt]] syntax. Non-image embeds are left untouched.
 */
import { visit } from "unist-util-visit";

const IMG_EXT = /\.(png|jpe?g|gif|webp|svg|avif)$/i;

export function remarkWikilinkImages() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const value = node.value;
      if (!value.includes("![[")) return;

      const parts = [];
      let last = 0;
      const re = /!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g;
      let m;
      while ((m = re.exec(value)) !== null) {
        const [full, rawTarget, rawAlt] = m;
        const target = rawTarget.trim();
        if (!IMG_EXT.test(target)) continue; // only image embeds
        if (m.index > last) parts.push({ type: "text", value: value.slice(last, m.index) });
        const file = target.split("/").pop();
        parts.push({
          type: "image",
          url: `/images/${encodeURIComponent(file)}`,
          alt: (rawAlt || file.replace(IMG_EXT, "").replace(/[_-]+/g, " ")).trim(),
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
