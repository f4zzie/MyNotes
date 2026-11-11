import assert from "node:assert/strict";
import { test } from "node:test";
// unified/remark/rehype ship with Astro (via @astrojs/markdown-remark); used here
// to exercise the plugin against real parsed markdown, including code blocks.
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkWikilinks, vaultPathToUrl } from "../src/plugins/remark-wikilinks.mjs";
import { remarkWikilinkImages } from "../src/plugins/remark-wikilink-images.mjs";

function transform(value, type = "paragraph") {
  const parent = { type, children: [{ type: "text", value }] };
  const tree = { type: "root", children: [parent] };
  remarkWikilinks()(tree);
  return parent.children;
}

async function html(md) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilinkImages)
    .use(remarkWikilinks)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md);
  return String(file).trim();
}

test("rewrites an aliased vault link to the note route", async () => {
  assert.equal(
    await html("[[pending/field-manual/03-exploitation/web-exploitation|Web exploitation]]"),
    '<p><a href="/notes/field-manual/03-exploitation/web-exploitation/">Web exploitation</a></p>',
  );
});

test("keeps heading fragments, slugged like Astro heading ids", () => {
  const [link] = transform("[[pending/field-manual/07-toolkit/index#AD tool inventory|Toolkit]]");
  assert.equal(link.url, "/notes/field-manual/07-toolkit/#ad-tool-inventory");
  assert.equal(link.children[0].value, "Toolkit");
  assert.equal(
    vaultPathToUrl("pending/a/remote-access", "IPMI (623 UDP)"),
    "/notes/a/remote-access/#ipmi-623-udp",
  );
  assert.equal(vaultPathToUrl("pending/a/web", "robots.txt and sitemaps"), "/notes/a/web/#robotstxt-and-sitemaps");
});

test("maps index notes to trailing-slash directory URLs", () => {
  assert.equal(vaultPathToUrl("pending/field-manual/index"), "/notes/field-manual/");
  assert.equal(vaultPathToUrl("pending/field-manual/01-information-gathering/index"), "/notes/field-manual/01-information-gathering/");
  assert.equal(vaultPathToUrl("pending/field-manual/01-information-gathering/service-enumeration/index.md"), "/notes/field-manual/01-information-gathering/service-enumeration/");
});

test("strips the pending/ prefix and .md suffix and slugs like the content loader", () => {
  assert.equal(vaultPathToUrl("pending/htb-writeup/active.md"), "/notes/htb-writeup/active/");
  assert.equal(vaultPathToUrl("pending/Some Folder/My Note.md"), "/notes/some-folder/my-note/");
});

test("uses the note name (and heading) as label when no alias is given", () => {
  const [link] = transform("[[pending/field-manual/07-toolkit/netexec]]");
  assert.equal(link.url, "/notes/field-manual/07-toolkit/netexec/");
  assert.equal(link.children[0].value, "netexec");
  const [withHeading] = transform("[[pending/a/web#WHOIS]]");
  assert.equal(withHeading.url, "/notes/a/web/#whois");
  assert.equal(withHeading.children[0].value, "web › WHOIS");
});

test("keeps surrounding text and multiple links in order", () => {
  const nodes = transform("See [[pending/a/one|One]] and [[pending/a/two|Two]].");
  assert.deepEqual(nodes.map((n) => n.type), ["text", "link", "text", "link", "text"]);
  assert.equal(nodes[0].value, "See ");
  assert.equal(nodes[2].value, " and ");
  assert.equal(nodes[4].value, ".");
});

test("leaves non-vault targets untouched", () => {
  for (const value of ["[[PWNDBG]]", "[[Other note|alias]]", "[[#local heading]]", "grep '[[:space:]]+'"]) {
    assert.deepEqual(transform(value), [{ type: "text", value }]);
  }
});

test("leaves image and note embeds untouched", () => {
  assert.deepEqual(transform("![[pending/a/note]]"), [{ type: "text", value: "![[pending/a/note]]" }]);
  const nodes = transform("![[scan.png]] then [[pending/a/b|B]]");
  assert.equal(nodes[0].value, "![[scan.png]] then ");
  assert.equal(nodes[1].url, "/notes/a/b/");
});

test("image embeds keep their existing rendering alongside note links", async () => {
  const out = await html("![[htb-active-01-nmap.png|Nmap scan]] [[pending/htb-writeup/active|Active]]");
  assert.match(out, /<a href="\/images\/htb-active-01-nmap\.png"[^>]*class="screenshot-link"[^>]*><img src="\/images\/htb-active-01-nmap\.png" alt="Nmap scan"/);
  assert.match(out, /<a href="\/notes\/htb-writeup\/active\/">Active<\/a>/);
});

test("never rewrites fenced code blocks or inline code", async () => {
  const md = [
    "Inline `[[pending/a/b|B]]` here.",
    "",
    "```text",
    "[[pending/a/b|B]]",
    "```",
  ].join("\n");
  const out = await html(md);
  assert.ok(!out.includes('href="/notes/a/b/"'), out);
  assert.match(out, /<code>\[\[pending\/a\/b\|B\]\]<\/code>/);
  assert.match(out, /<pre><code class="language-text">\[\[pending\/a\/b\|B\]\]\n<\/code><\/pre>/);
});

test("does not nest a link inside an existing link", () => {
  const parent = { type: "link", url: "/x", children: [{ type: "text", value: "[[pending/a/b]]" }] };
  remarkWikilinks()({ type: "root", children: [{ type: "paragraph", children: [parent] }] });
  assert.deepEqual(parent.children, [{ type: "text", value: "[[pending/a/b]]" }]);
});
