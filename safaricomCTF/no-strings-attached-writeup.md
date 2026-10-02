# No Strings Attached — Beginner Writeup (Finding a Secret in Android App Source)

> **Assumptions stated up front (the prompt said to flag these):**
> - The challenge host is written exactly as it appeared during the event: `http://54.72.82.22:8130`. If you are replaying this later, swap in whatever host the scoreboard gives you.
> - The download is an **Android Studio *source project*** (a folder of code), **not** a compiled `.apk`. That matters: we can just *read* the files with `cat`/`grep` instead of decompiling anything. No Python, no reversing tools.

---

## 1. Challenge Overview

**No Strings Attached** is a **mobile / misc** challenge from the **Safaricom CTF (safctf)**, worth **300 points**. The website is themed as a K-pop app called "COMEBACK KIT" and offers a single file to download: **`/backup.zip`**. Our goal is to dig through that app's files and find the hidden flag.

The challenge text drops two hints:
- *"A little spontaneity makes the best plans."*
- *"An archived release note describes a recovery screen that may not exist in this build."*

Keep that second hint in mind — the words **"archived"** and **"a recovery screen that may not exist"** turn out to be the whole challenge.

---

## 2. What You Need Before Starting

This is the easiest challenge in the set. A beginner should finish in **10 to 20 minutes**. Everything is standard Linux CLI — **no scripting at all**.

- **curl** — download the file.
  ```
  sudo apt install curl
  ```
- **unzip** — extract the archive.
  ```
  sudo apt install unzip
  ```
- **grep**, **cat**, **find** — search and read text files. These come with every Linux system (part of the base install / `coreutils` + `findutils`).

No account, no VPN, no proxy. Just a terminal.

---

## 3. Reconnaissance

**Step 1 — Open the site and see what it offers.**
```
curl -s http://54.72.82.22:8130/ | grep -iE "href|download|<p>"
```
You'll see the page talks about a "backstage download" and links to **`/backup.zip`**. In a browser it's just a themed page with one download button.

[SCREENSHOT: the challenge home page showing the "Download the comeback kit" button]

**Why:** before touching anything clever, find out what the challenge *gives* you. Here it's one zip file, so that's our whole world.

**Step 2 — Download the file and confirm what it is.**
```
curl -s http://54.72.82.22:8130/backup.zip -o backup.zip
file backup.zip
```
Output:
```
backup.zip: Zip archive data, made by v2.0 UNIX, ...
```
**Why:** `file` tells us it really is a zip, so `unzip` is the right next move.

**Step 3 — Extract it and look at the shape of the project.**
```
unzip backup.zip
```
You get a folder named **`safctfapp/`**. If you've ever seen an Android Studio project this will look familiar: `build.gradle`, `gradlew`, a `.idea/` folder, and the important part, **`app/src/main/`**.

**Step 4 — Read the README (challenges love hiding hints here).**
```
cat safctfapp/README
```
Output:
```
### Let's get mobile!
When she said that she doesn't want any strings attached, did she mean it?
We can tell you for sure it was a big fat lie. We all have strings attached!
```
**Why this matters:** the challenge is literally called *No Strings Attached*, and the README screams **"strings."** In Android, user-facing text lives in **string resources** — XML files under `app/src/main/res/values/`. That's our target.

[SCREENSHOT: terminal showing the extracted `safctfapp/` folder tree]

---

## 4. Identifying the Vulnerability

This isn't a "hacking" bug like SQL injection — it's an **information disclosure** problem, and specifically **a secret left behind in source control**.

**Plain-English definition:** *information disclosure* is when sensitive data (a password, an API key, a flag) is shipped somewhere it shouldn't be, where anyone who looks can read it.

In Android, every bit of visible text is stored as a **string resource** — an entry like `<string name="menu_home">Home</string>` inside an XML file in `res/values/`. The app refers to these by name. A developer tidying up a feature will often *delete the screen that used a string but forget to delete the string itself.* The leftover string just sits in the resources, invisible in the running app but perfectly readable in the source.

That is exactly what the hint describes: **"an archived release note describes a recovery screen that may not exist in this build."**
- **"recovery screen that may not exist in this build"** = a feature that was removed. We can confirm removal by reading **`AndroidManifest.xml`** (the file that lists every screen the app actually has).
- **"archived"** = look for an *archive* file among the resources.

**The tip-off from recon:** the README pointing at "strings," plus the manifest listing only one screen, tells us a leftover string resource is hiding somewhere it's no longer used.

---

## 5. Exploitation Step by Step

**Step 1 — Confirm the "recovery screen" really doesn't exist.**
```
cat safctfapp/app/src/main/AndroidManifest.xml
```
Look at the `<activity ...>` entries. There is only **one**: `.MainActivity`. No login screen, no "recovery" screen.

**What to look for / what it means:** the manifest is the app's official list of screens. Only `MainActivity` is declared, so the "recovery screen" from the hint was indeed removed from the build — but its *strings* may have been left behind.

[SCREENSHOT: AndroidManifest.xml showing only MainActivity declared]

**Step 2 — List the string-resource files.**
```
find safctfapp -path "*/res/values/*.xml"
```
Output (trimmed):
```
safctfapp/app/src/main/res/values/colors.xml
safctfapp/app/src/main/res/values/strings.xml
safctfapp/app/src/main/res/values/themes.xml
safctfapp/app/src/main/res/values/dimens.xml
safctfapp/app/src/main/res/values/archive.xml
```
**What to look for:** `strings.xml`, `colors.xml`, `themes.xml`, `dimens.xml` are the *normal* files every project has. **`archive.xml` is the odd one out** — and the hint literally said **"archived."** That is our lead.

**Step 3 — The lazy, reliable shortcut: grep the whole project for the flag shape.**
Instead of opening files one by one, search everything for the standard flag pattern. **`grep -r`** searches recursively; the `-E` lets us use a pattern:
```
grep -rE "safctf\{[^}]*\}" safctfapp/
```
Output:
```
safctfapp/app/src/main/res/values/archive.xml:  <string name="archive_auth_token">safctf{94f40cc66658c67503a859cf383c7622}</string>
```
**What this means:** the flag was sitting in that out-of-place `archive.xml` the whole time, as a leftover string named `archive_auth_token`.

[SCREENSHOT: the grep command output showing the flag line]

**Step 4 — Read the file directly to confirm (nice to do by hand too).**
```
cat safctfapp/app/src/main/res/values/archive.xml
```
Output:
```
<resources><string name="archive_auth_token">safctf{94f40cc66658c67503a859cf383c7622}</string></resources>
```

---

## 6. Capturing the Flag

The flag is the value of the `archive_auth_token` string in **`safctfapp/app/src/main/res/values/archive.xml`**:

```
safctf{94f40cc66658c67503a859cf383c7622}
```

For this challenge, that string **is** the flag — paste it straight into the scoreboard. (Unlike some other challenges in this event, there is no second "submit this to an API" step here.)

---

## 7. Why This Works (Beginner Explanation)

Think of an Android app like a theatre program printed for a show. Every line of text the audience can read — menu labels, button names — is listed in a central "glossary" at the back (the string resources). When the director cuts a scene, they pull the scene from the running show, but the glossary entry for that scene's lines often stays printed in the back. Nobody in the audience sees it, yet anyone holding the program can flip to the back and read it.

That is precisely what happened here. A "recovery screen" was removed (it's not in `AndroidManifest.xml`), but its secret string — an "auth token" — was left in the resource files. The compiled, running app never shows it, so a casual user would never find it. But the **source code and resources are the program's back pages**, and we were handed the whole booklet as `backup.zip`.

In the real world this is extremely common and genuinely dangerous: developers accidentally ship API keys, passwords, and internal URLs inside mobile apps and public code repositories. Anyone can download an APK from the store, unzip it, and grep for secrets — exactly the skill you just practiced.

---

## 8. Common Mistakes and Dead Ends

- **Chasing the decoy string.** `strings.xml` contains `your_are_here_for_the_safCTF` = *"This can be a hotel you know, check the main menu and make sure to order."* It sounds mysterious on purpose. It leads nowhere — don't burn time decoding it. The real secret is the *orphaned* `archive_auth_token`, not the flavour text.
- **Expecting a compiled `.apk` and reaching for heavy tools.** Some people immediately try to decompile with `jadx` or `apktool`. This download is already **source**, so you can just `cat` and `grep`. Match the tool to what you were actually given.
- **Reading files one at a time and missing it.** The project has dozens of files. A beginner can waste 20 minutes opening each. `grep -rE "safctf\{[^}]*\}" .` finds any flag-shaped string instantly — make it your first move on any "here's a pile of files" challenge.
- **Ignoring the manifest.** If you don't check `AndroidManifest.xml`, you miss the confirmation that the "recovery screen" was removed, and the hint stays confusing.

---

## 9. How to Defend Against This

- **Never store secrets (tokens, API keys, passwords) in client apps or their resources.** Anything shipped to a device can be extracted. Secrets belong on the server, behind authentication.
- **When you remove a feature, remove its data too** — delete the orphaned string resources, config entries, and dead code, not just the screen.
- **Scan your repos and build artifacts for secrets before release** using tools like `git-secrets`, `trufflehog`, or `gitleaks` in CI.
- **Keep debug/"archive"/backup files out of production builds.** A file literally named `archive.xml` holding an `auth_token` should never reach a release.
- **Rotate any secret the moment it touches a client build or a public repo** — assume it is already compromised.

---

## 10. Key Takeaways

- **Read the hint literally.** "Strings" meant Android string resources; "archived" meant a file called `archive.xml`; "a screen that may not exist" meant check the manifest.
- **Match your tools to what you were given.** Source project → `cat`/`grep`, not a decompiler.
- **Cheat-sheet command for any file-dump challenge:**
  ```
  grep -rE "safctf\{[^}]*\}" .
  ```
  (Swap `safctf` for whatever flag prefix the event uses.)
- **Confirm your theory.** Reading `AndroidManifest.xml` turned a guess ("maybe a removed feature left a secret") into certainty.
- **Secrets in client code are a real, everyday vulnerability** — this tiny CTF mirrors how pros find hard-coded keys in production apps.

You just solved a mobile challenge with four commands and zero code. That instinct — *download, extract, grep for the flag, read the odd file out* — will carry you through a surprising number of CTFs. Nice work, and keep going!


