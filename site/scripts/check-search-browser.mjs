import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { filterSearchIndex, normalizeSearch } from "../src/lib/search.mjs";
import { resolvePage } from "./check-links.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(join(here, "..", "dist"));
const indexBytes = readFileSync(join(dist, "search-index.json"));
const index = JSON.parse(indexBytes);
const full = new Map(index.map((entry) => [entry.id, entry]));
const urlArg = process.argv.indexOf("--url");
const external = urlArg >= 0 ? new URL(process.argv[urlArg + 1]) : null;
const control = { mode: "full", requests: 0, pending: new Set() };
const delay = (ms) => new Promise((done) => setTimeout(done, ms));
let server;
let child;
let socket;
let profile;
let call;
let session;
const exceptions = [];

async function waitFor(condition, label, timeout = 15000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await condition()) return;
    await delay(75);
  }
  throw new Error(`Timed out: ${label}`);
}

async function startServer() {
  const types = { ".html": "text/html", ".json": "application/json", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".xml": "application/xml" };
  server = createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    response.setHeader("Cache-Control", "no-store");
    if (url.pathname === "/search-index.json") {
      control.requests++;
      response.setHeader("Content-Type", "application/json");
      if (control.mode === "failure") { response.writeHead(503).end("{}"); return; }
      if (control.mode === "incomplete") { response.end(JSON.stringify(index.filter((entry) => entry.id !== "field-manual"))); return; }
      if (control.mode === "duplicate") { response.end(JSON.stringify([...index, index[0]])); return; }
      if (control.mode === "wrong-section") { response.end(JSON.stringify(index.map((entry) => entry.id === "field-manual" ? { ...entry, section: "writeups" } : entry))); return; }
      if (control.mode === "wrong-url") { response.end(JSON.stringify(index.map((entry) => entry.id === "field-manual" ? { ...entry, url: "/writeups/field-manual/" } : entry))); return; }
      if (control.mode === "hang") {
        control.pending.add(response);
        response.on("close", () => control.pending.delete(response));
        return;
      }
      response.end(indexBytes);
      return;
    }
    const file = resolvePage(dist, url.pathname);
    if (!file || relative(dist, file).startsWith("..")) { response.writeHead(404).end("Not found"); return; }
    response.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
    response.end(readFileSync(file));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return `http://127.0.0.1:${server.address().port}`;
}

async function launch() {
  assert.equal(typeof WebSocket, "function", "Browser checks require Node.js 22+ with native WebSocket");
  const candidates = [process.env.CHROMIUM_BIN, "chromium", "chromium-browser", "google-chrome", "google-chrome-stable"].filter(Boolean);
  let binary;
  for (const candidate of candidates) {
    try { binary = execFileSync("which", [candidate], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); break; } catch {}
  }
  assert.ok(binary, "Chromium/Chrome unavailable; set CHROMIUM_BIN to the installed binary");
  profile = mkdtempSync(join(existsSync("/tmp/opencode") ? "/tmp/opencode" : tmpdir(), "search-browser-"));
  const args = ["--headless=new", "--disable-dev-shm-usage", "--disable-background-networking", "--disable-extensions", "--no-first-run", "--no-default-browser-check", "--remote-debugging-address=127.0.0.1", "--remote-debugging-port=0", `--user-data-dir=${profile}`];
  if (process.getuid?.() === 0 || process.env.CI) args.push("--no-sandbox");
  const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (external && proxy) args.push(`--proxy-server=${proxy}`, "--proxy-bypass-list=localhost;127.0.0.1;[::1]");
  args.push("about:blank");
  child = spawn(binary, args, { stdio: ["ignore", "ignore", "pipe"] });
  const endpoint = await new Promise((done, reject) => {
    let stderr = "";
    const timeout = setTimeout(() => reject(new Error("Chromium startup timed out")), 20000);
    child.on("error", reject);
    child.on("exit", (code) => { clearTimeout(timeout); reject(new Error(`Chromium exited during startup (${code}): ${stderr.slice(-1200)}`)); });
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk).slice(-8000);
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timeout); done(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((done, reject) => { socket.addEventListener("open", done, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const { done, reject, timeout } = pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(timeout);
      if (message.error) reject(new Error(message.error.message));
      else done(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  });
  call = (method, params = {}, sessionId) => new Promise((done, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timed out: ${method}`)); }, 15000);
    pending.set(id, { done, reject, timeout });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const target = await call("Target.createTarget", { url: "about:blank" });
  ({ sessionId: session } = await call("Target.attachToTarget", { targetId: target.targetId, flatten: true }));
  await call("Runtime.enable", {}, session);
  await call("Page.enable", {}, session);
}

async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, session);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

const snapshot = () => evaluate(`(() => {
  const root = document.querySelector('[data-note-listing]');
  if (!root) return null;
  const items = [...root.querySelectorAll('.note-item')];
  return {
    path: location.pathname, search: location.search, q: root.querySelector('#note-search').value,
    ready: document.readyState, epoch: performance.timeOrigin,
    ids: items.filter(item => !item.hidden && getComputedStyle(item).display !== 'none').map(item => item.dataset.id),
    busy: root.querySelector('#note-grid').getAttribute('aria-busy') === 'true',
    warning: getComputedStyle(root.querySelector('#search-warning')).display !== 'none',
    empty: getComputedStyle(root.querySelector('#empty')).display !== 'none',
    status: root.querySelector('#search-status').textContent,
    cat: root.querySelector('#filter-bar [aria-pressed="true"]')?.dataset.cat || '',
    tag: root.querySelector('#tag-bar [aria-pressed="true"]')?.dataset.tag || ''
  };
})()`);

const ordered = {};
for (const section of ["notes", "writeups"]) {
  const page = readFileSync(join(dist, section, "index.html"), "utf8");
  ordered[section] = [...page.matchAll(/\bdata-id="([^"]+)"/g)].map((match) => full.get(match[1]));
}

async function assertState(section, state = {}, metadata = false) {
  const expectedState = { q: "", cat: "all", tag: "all", ...state };
  await waitFor(async () => { const current = await snapshot(); return current && !current.busy && current.status.includes("notes match"); }, "search completion");
  const current = await snapshot();
  const entries = metadata ? ordered[section].map((entry) => ({ ...entry, text: entry.metadata })) : ordered[section];
  const expected = filterSearchIndex(entries, expectedState).map((entry) => entry.id);
  assert.equal(current.path, `/${section}/`);
  assert.equal(current.q, expectedState.q);
  assert.deepEqual(current.ids, expected);
  assert.equal(current.empty, expected.length === 0);
  assert.equal(current.status, `${expected.length} of ${ordered[section].length} notes match`);
  if (expectedState.cat === "all" || current.cat) assert.equal(normalizeSearch(current.cat), normalizeSearch(expectedState.cat));
  if (expectedState.tag === "all" || current.tag) assert.equal(normalizeSearch(current.tag), normalizeSearch(expectedState.tag));
  const params = new URLSearchParams(current.search);
  assert.equal(params.get("q") || "", expectedState.q.trim());
  assert.equal(params.get("cat") || "all", expectedState.cat);
  assert.equal(params.get("tag") || "all", normalizeSearch(expectedState.tag));
  if (metadata) assert.equal(current.warning, true);
  else assert.equal(current.warning, false);
  return current;
}

async function type(query) {
  await evaluate(`(() => { const input = document.querySelector('#note-search'); input.value = ${JSON.stringify(query)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
}

async function click(selector) {
  assert.equal(await evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) return false; element.click(); return true; })()`), true, `Missing control: ${selector}`);
}

async function main() {
  const origin = external ? external.origin : await startServer();
  await launch();
  const navigate = async (path) => {
    const before = await evaluate("performance.timeOrigin");
    const target = new URL(path, origin);
    await call("Page.navigate", { url: `${origin}${path}` }, session);
    await waitFor(async () => {
      const state = await snapshot();
      return state?.path === target.pathname && state.epoch !== before && state.ready === "complete" &&
        state.q === (target.searchParams.get("q") || "") && (state.status.includes("notes match") || state.busy);
    }, `listing ready: ${path}`);
  };
  const run = async (name, fn) => { await fn(); console.log(`PASS ${name}`); };

  await run("52/85 initial listings and lazy full-text loading", async () => {
    await navigate("/notes/");
    await assertState("notes");
    assert.equal(ordered.notes.length, 52);
    assert.equal(ordered.writeups.length, 85);
    if (!external) assert.equal(control.requests, 0);
  });
  await run("real manual body-only identifiers, AND, phrases, OR, case, and ranking", async () => {
    assert.ok(ordered.notes.some((entry) => entry.text.includes("dconly") && !entry.metadata.includes("dconly")));
    for (const q of ["DCOnly", "msDS-AllowedToActOnBehalfOfOtherIdentity", "Kerberos DCOnly", '"Kerberos double-hop"', 'RBCD | "Kerberos double-hop"', "ＤＣＯｎｌｙ", "Pivoting"]) {
      await type(q);
      const state = await assertState("notes", { q });
      if (q === "Pivoting") assert.ok(normalizeSearch(full.get(state.ids[0]).title).includes("pivoting"));
    }
    if (!external) assert.equal(control.requests, 1);
  });
  await run("combined exact filters, reset, and Back/Forward restoration", async () => {
    await type("DCOnly");
    await click('#filter-bar [data-cat="Field Manual"]');
    await assertState("notes", { q: "DCOnly", cat: "Field Manual" });
    await click('#tag-bar [data-tag="active-directory"]');
    const combined = { q: "DCOnly", cat: "Field Manual", tag: "active-directory" };
    await assertState("notes", combined);
    await click("#reset-search");
    await assertState("notes");
    await evaluate("history.back()");
    await waitFor(async () => (await snapshot())?.tag === "active-directory", "Back restores tag");
    await assertState("notes", combined);
    await evaluate("history.back()");
    await waitFor(async () => (await snapshot())?.tag === "all", "Back restores category-only state");
    await assertState("notes", { q: "DCOnly", cat: "Field Manual" });
    await evaluate("history.forward()");
    await waitFor(async () => (await snapshot())?.tag === "active-directory", "Forward restores combined filters");
    await assertState("notes", combined);
  });
  await run("shareable URLs, exact rather than partial tags, and section isolation", async () => {
    await navigate("/notes/?q=DCOnly&cat=Field%20Manual&tag=active-directory");
    await assertState("notes", { q: "DCOnly", cat: "Field Manual", tag: "active-directory" });
    await navigate("/notes/?q=DCOnly&tag=active");
    await assertState("notes", { q: "DCOnly", tag: "active" });
    await navigate("/notes/?q=loginok.html");
    assert.deepEqual((await assertState("notes", { q: "loginok.html" })).ids, []);
    await navigate("/writeups/?q=loginok.html");
    const state = await assertState("writeups", { q: "loginok.html" });
    assert.ok(state.ids.includes("htb-writeup/htb-wingdata-writeup"));
    assert.ok(state.ids.every((id) => full.get(id).section === "writeups"));
    await click("#reset-search");
    await assertState("writeups");
  });
  await run("real shared-tag links keep Notes and Writeups independent", async () => {
    const tag = "reverse-engineering";
    for (const section of ["notes", "writeups"]) {
      await call("Page.navigate", { url: `${origin}/tags/` }, session);
      await waitFor(() => evaluate("location.pathname === '/tags/' && document.readyState === 'complete' && Boolean(document.querySelector('.tag-cloud'))"), "Tags page ready");
      const selector = `.tag-cloud a[href="/${section}/?tag=${tag}"]`;
      const label = section === "notes" ? "Notes" : "Writeups";
      const count = ordered[section].filter((entry) => entry.tags.includes(tag)).length;
      assert.ok(count > 0, `Expected a real ${section} shared-tag example`);
      assert.equal(await evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.replace(/\\s+/g, ' ').trim()`), `${tag} (${label}) ${count}`);
      await click(selector);
      const state = await assertState(section, { tag });
      assert.equal(state.ids.length, count);
      assert.ok(state.ids.every((id) => full.get(id).section === section));
    }
  });
  await run("search result links retain their original note URLs", async () => {
    await navigate("/notes/?q=msDS-KeyCredentialLink");
    const state = await assertState("notes", { q: "msDS-KeyCredentialLink" });
    const id = "field-manual/03-exploitation/active-directory-delegation-and-acl";
    assert.ok(state.ids.includes(id));
    await click(`.note-item[data-id="${id}"]`);
    await waitFor(() => evaluate(`location.pathname === ${JSON.stringify(full.get(id).url)} && Boolean(document.querySelector('article .prose'))`), "detail link navigation");
  });

  if (!external) {
    await run("metadata fallback and retry on failed, incomplete, duplicate, or mismatched indexes", async () => {
      for (const mode of ["failure", "incomplete", "duplicate", "wrong-section", "wrong-url"]) {
        control.mode = mode;
        await navigate("/notes/?q=DCOnly");
        await assertState("notes", { q: "DCOnly" }, true);
        await type("Active Directory");
        await assertState("notes", { q: "Active Directory" }, true);
        control.mode = "full";
        await click("#retry-search");
        await assertState("notes", { q: "Active Directory" });
        await type("DCOnly");
        await assertState("notes", { q: "DCOnly" });
      }
    });
    await run("10-second index timeout clears busy state and permits retry", async () => {
      control.mode = "hang";
      await navigate("/notes/?q=DCOnly");
      const started = Date.now();
      await waitFor(async () => (await snapshot())?.warning, "index timeout fallback", 14000);
      assert.ok(Date.now() - started >= 8500, "Timeout fired before the configured window");
      await assertState("notes", { q: "DCOnly" }, true);
      control.mode = "full";
      await click("#retry-search");
      await assertState("notes", { q: "DCOnly" });
    });
    await run("a late full-text response cannot undo reset", async () => {
      control.mode = "hang";
      await navigate("/notes/");
      await type("DCOnly");
      await waitFor(() => control.pending.size > 0, "pending index request");
      await click("#reset-search");
      await assertState("notes");
      control.mode = "full";
      for (const response of control.pending) response.end(indexBytes);
      await waitFor(() => control.pending.size === 0, "late response delivered");
      await type("msDS-KeyCredentialLink");
      await assertState("notes", { q: "msDS-KeyCredentialLink" });
      await click("#reset-search");
      await assertState("notes");
    });
  }
  assert.deepEqual(exceptions, [], "Uncaught browser errors");
  console.log(`check-search-browser: ${external ? "deployed read-only" : "local built-site"} checks passed in Chromium.`);
}

try {
  await main();
} finally {
  if (child) {
    const exited = child.exitCode !== null || child.signalCode !== null ? Promise.resolve() : once(child, "exit");
    if (call && socket?.readyState === WebSocket.OPEN) await call("Browser.close").catch(() => {});
    child.kill("SIGTERM");
    await Promise.race([exited, delay(5000)]);
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
  }
  socket?.close();
  if (server) { server.closeAllConnections(); await new Promise((done) => server.close(done)); }
  if (profile) rmSync(profile, { recursive: true, force: true });
}
