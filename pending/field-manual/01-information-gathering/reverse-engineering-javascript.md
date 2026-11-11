---
title: "JavaScript Deobfuscation"
description: "Recovering endpoints, secrets, and DOM sinks from minified or obfuscated JavaScript during web enumeration."
category: "Field Manual"
tags: ["field-manual", "cpts", "web", "javascript", "reverse-engineering"]
date: 2026-11-11
published: true
status: archive
---

# JavaScript Deobfuscation

Modern web apps ship their logic to the client. JavaScript analysis often reveals hidden endpoints, feature flags, API keys, admin paths, and DOM XSS sinks.

## Cheatsheet

| Task | Tool |
|---|---|
| Pretty-print | Browser DevTools `{}`, `js-beautify`, `prettier` |
| Deobfuscate | [deobfuscator.io](https://deobfuscator.io/), `restringer` |
| Unpack webpack | `sourcemapper`, `unwebpack-sourcemap` |
| Find source maps | `curl -s file.js \| tail -c 200`, DevTools Sources |
| Extract endpoints | `grep -Eo '(/api/[^"'"'"' ]+)|(https?://[^"'"'"' ]+)'` |
| Find secrets | `trufflehog filesystem`, `gitleaks`, regex for keys/tokens |
| Find sinks | `eval`, `Function`, `innerHTML`, `document.write`, `setTimeout(string)` |
| Find sources | `location.hash`, `location.search`, `postMessage`, `document.referrer` |
| Run in Node | `node -e '...'` with stubs for `window`/`document` |

## Workflow

```text
Collect JS → identify framework/bundler → beautify → search strings/endpoints/secrets
          → deobfuscate control flow → trace sources to sinks → reproduce in browser
```

### 1. Collect

- DevTools → Sources: all loaded scripts, including lazy chunks.
- `view-source:` and the HTML for inline scripts.
- `robots.txt`, `sitemap.xml`, `manifest.json`, service workers.
- Wayback/`gau` for old bundles.
- Source map references: `//# sourceMappingURL=...`.

```bash
gau target.htb | grep -E '\.js($|\?)' | sort -u > js-urls.txt
while read -r u; do curl -s "$u" -o "js/$(basename "${u%%\?*}")"; done < js-urls.txt
```

### 2. Beautify

```bash
npx js-beautify input.js > pretty.js
npx prettier --parser babel input.js > pretty.js
```

DevTools `{}` does the same for a single file.

### 3. Map the bundle

Look for:

- API base URLs and version prefixes (`/api/v2/`).
- Route tables and hidden admin routes.
- Feature flags and role checks (`isAdmin`, `beta`, `internal`).
- WebSocket endpoints.
- Third-party keys (Google Maps, Stripe publishable keys — usually not secrets).
- GraphQL endpoint and operation names.

### 4. Deobfuscate

Common patterns:

| Pattern | Approach |
|---|---|
| String array + rotate/decode function | Run the decoder in Node, print strings |
| Hex/unicode escapes | `unescape`, `String.fromCharCode`, CyberChef |
| Control-flow flattening | deobfuscator.io, restringer, manual switch tracing |
| Dead code / opaque predicates | Dynamic instrumentation; log executed branches |
| `eval`/`Function` packing | Replace with `console.log` and run in a sandbox |

```bash
npm install -g restringer
restringer input.js -o deobf.js
```

Never execute untrusted JS on your host without isolation. Use a browser, a container, or a Node VM with network access disabled.

### 5. Find sources and sinks

```javascript
// Sources
location.hash
location.search
location.href
document.referrer
window.name
postMessage event.data
localStorage / sessionStorage

// Sinks
element.innerHTML
element.outerHTML
document.write
eval / Function
setTimeout("string")
location = userInput
jQuery.html() / .append()
```

Trace tainted data from source to sink. Confirm with a harmless payload in the browser console, then test in the app.

### 6. Source maps

If `file.js.map` exists:

```bash
curl -s https://target.htb/static/app.js.map -o app.js.map
npx sourcemapper -url https://target.htb/static/app.js.map -output out/
```

Source maps can recover original TypeScript/Vue/React source, comments, and internal API names.

## Secrets regex

```bash
grep -Eo 'AKIA[0-9A-Z]{16}' js/*.js
grep -Eo 'AIza[0-9A-Za-z_-]{35}' js/*.js
grep -Eo 'gh[pousr]_[A-Za-z0-9]{36,}' js/*.js
grep -Eio '(api[_-]?key|secret|token|password)["'"'"']?\s*[:=]\s*["'"'"'][^"'"'"']+' js/*.js
```

Treat every hit as a hypothesis: check whether it is a publishable key, a placeholder, or a live secret. Never use out-of-scope credentials.

## Pitfalls

- Minified names are not meaningful; rely on strings, API calls, and behavior.
- Source maps may be present but blocked by auth or a different host.
- Modern frameworks split logic across many chunks; enumerate all chunks.
- Anti-debugging (`debugger` loops) can be bypassed by disabling breakpoints or patching the check.
- Client-side checks are not security boundaries; test the server too.

## References

- [HackTricks — JS analysis](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/basic-web-applications-pentesting/web-tooling/README.html)
- [deobfuscator.io](https://deobfuscator.io/)
- [restringer](https://github.com/PerimeterX/restringer)
- [sourcemapper](https://github.com/denandz/sourcemapper)
- [PortSwigger — DOM XSS sources and sinks](https://portswigger.net/web-security/cross-site-scripting/dom-based)
