import assert from "node:assert/strict";
import { test } from "node:test";
import { remarkWikilinkImages } from "../src/plugins/remark-wikilink-images.mjs";

function transform(value, type = "paragraph") {
  const parent = { type, children: [{ type: "text", value }] };
  const tree = { type: "root", children: [parent] };
  remarkWikilinkImages()(tree);
  return parent.children;
}

test("encodes spaces and links to the same full-resolution image", () => {
  const [link] = transform("![[Pasted image 20261025164259.png]]");
  assert.equal(link.type, "link");
  assert.equal(link.url, "/images/Pasted%20image%2020261025164259.png");
  assert.equal(link.children[0].url, link.url);
  assert.equal(link.children[0].alt, "Pasted image 20261025164259");
  assert.equal(link.data.hProperties.target, "_blank");
  assert.deepEqual(link.data.hProperties.rel, ["noopener", "noreferrer"]);
});

test("preserves descriptive alt text and lazy-loads without re-encoding the image", () => {
  const [link] = transform("![[htb-active-01-nmap.png|Nmap domain-controller scan]]");
  assert.equal(link.children[0].alt, "Nmap domain-controller scan");
  assert.equal(link.url, "/images/htb-active-01-nmap.png");
  assert.deepEqual(link.children[0].data.hProperties, {
    loading: "lazy",
    decoding: "async",
  });
});

test("keeps surrounding text and multiple embeds in order", () => {
  const nodes = transform("Before ![[first.png]] between ![[second.jpg|Second]] after");
  assert.deepEqual(nodes.map((n) => n.type), ["text", "link", "text", "link", "text"]);
  assert.equal(nodes[0].value, "Before ");
  assert.equal(nodes[1].url, "/images/first.png");
  assert.equal(nodes[2].value, " between ");
  assert.equal(nodes[3].children[0].alt, "Second");
  assert.equal(nodes[4].value, " after");
});

test("resolves vault paths by basename, including uppercase image extensions", () => {
  const [link] = transform("![[images/example.PNG|Example]]");
  assert.equal(link.url, "/images/example.PNG");
  assert.equal(link.children[0].alt, "Example");
});

test("encodes reserved filename characters as data, not URL fragments", () => {
  const [link] = transform("![[scan #1 & result.png]]");
  assert.equal(link.url, "/images/scan%20%231%20%26%20result.png");
});

test("does not discard non-image embeds mixed with screenshots", () => {
  const value = "![[Other note]] before ![[scan.png]] after ![[document.pdf]]";
  const nodes = transform(value);
  assert.equal(nodes[0].value, "![[Other note]] before ");
  assert.equal(nodes[1].url, "/images/scan.png");
  assert.equal(nodes[2].value, " after ![[document.pdf]]");
  assert.deepEqual(transform("![[Other note]]"), [{ type: "text", value: "![[Other note]]" }]);
});

test("avoids nested anchors for embeds that are already linked", () => {
  for (const type of ["link", "linkReference"]) {
    const [image] = transform("![[scan.png|Scan]]", type);
    assert.equal(image.type, "image");
    assert.equal(image.url, "/images/scan.png");
  }
});

test("leaves code, inline code, ordinary text, and regular Markdown images alone", () => {
  const tree = {
    type: "root",
    children: [
      { type: "code", lang: "text", value: "![[scan.png]]" },
      {
        type: "paragraph",
        children: [
          { type: "inlineCode", value: "![[scan.png]]" },
          { type: "text", value: "ordinary text" },
          { type: "image", url: "/images/existing.png", alt: "Existing" },
        ],
      },
    ],
  };
  const original = structuredClone(tree);
  remarkWikilinkImages()(tree);
  assert.deepEqual(tree, original);
});
