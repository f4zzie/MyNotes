/**
 * Copies the vault's images into public/images so /images/<name> resolves.
 * Sources: ../images (main), and any stray "Pasted image *.png" at repo root.
 * Runs on predev/prebuild.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", ".."); // site-astro/scripts -> repo root
const dest = join(here, "..", "public", "images");

mkdirSync(dest, { recursive: true });

// 1) main images/ folder
const mainImages = join(repoRoot, "images");
if (existsSync(mainImages)) {
  cpSync(mainImages, dest, { recursive: true });
}

// 2) stray root-level "Pasted image *.png" -> normalise spaces to underscores
for (const f of readdirSync(repoRoot)) {
  if (/^Pasted image .*\.(png|jpe?g|gif|webp)$/i.test(f)) {
    copyFileSync(join(repoRoot, f), join(dest, f.replace(/ /g, "_")));
  }
}

console.log("[sync-images] images synced to public/images");

// 3) rasterise the branded OG card (og-default.svg -> og-default.png).
// Social scrapers (Slack, X, Discord, iMessage) need a raster image; SITE.ogImage
// points at /og-default.png. Best-effort: if sharp is unavailable, we fall back
// silently and the SVG still ships.
const pubDir = join(here, "..", "public");
const ogSvg = join(pubDir, "og-default.svg");
const ogPng = join(pubDir, "og-default.png");
if (existsSync(ogSvg)) {
  try {
    const { default: sharp } = await import("sharp");
    await sharp(ogSvg, { density: 144 }).resize(1200, 630).png().toFile(ogPng);
    console.log("[sync-images] og-default.png generated");
  } catch (e) {
    console.warn("[sync-images] og-default.png skipped (sharp unavailable):", e.message);
  }
}
