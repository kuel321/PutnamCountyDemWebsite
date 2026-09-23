# VM Access

Where this client's production instance actually lives, and how to pull a fresh copy of its database down to the laptop sandbox. Verified directly against the VM on 2026-09-17.

## SSH

```
ssh luke@chasingachance.com
```

Key-based auth already works from this laptop (no entry needed in `~/.ssh/config` — the default key is accepted).

## Layout on the VM

The VM (`chasingachance.com`) hosts multiple client projects under one `luke` user, each as its own pm2 process. This project:

- **pm2 process name:** `putnamcountydemwebsite`
- **App directory:** `/opt/services/clients/putnamcountydemocratclubofwv/PutnamCountyDemWebsite`
- **Live database file:** `putnam-county-dem-club-live.db` (in that app directory — confirmed via that directory's own `.env` → `DATABASE_URL`)

Useful commands on the VM:

```
pm2 list                                   # see all client processes running on this box
pm2 describe putnamcountydemwebsite        # confirm cwd / script path if anything moves
```

The app directory also accumulates timestamped `.bak` / `.pre-*-backup` copies of the db file (written before migrations and before deploys) — safe to ignore for a routine mirror pull, but useful if you ever need to roll back to a specific pre-migration state.

## Pulling a fresh copy down to the laptop

Per [[project memory]]: the laptop DB is a disposable sandbox, not meant to be built up and pushed to prod — but mirroring the VM's data down periodically (so local dev/testing reflects real content) is fine and was asked for on 2026-09-17.

```bash
# from the repo root
cp putnam-county-dem-club-prod.db "putnam-county-dem-club-prod.db.pre-vm-sync-backup-$(date +%Y%m%d%H%M%S)"
scp luke@chasingachance.com:/opt/services/clients/putnamcountydemocratclubofwv/PutnamCountyDemWebsite/putnam-county-dem-club-live.db ./putnam-county-dem-club-prod.db
```

Then restart the local dev server so it reopens the file instead of holding a stale connection.

**Expect one specific error on first restart after a sync**, every time: local push-mode tries to recreate an index that the freshly-synced db already has (`payload_locked_documents_rels_order_idx`) and 500s on it — seen on `/admin`, `/members/login`, or whatever route gets hit first. It's harmless (indexes carry no data) and always the same fix:

```bash
sqlite3 putnam-county-dem-club-prod.db "DROP INDEX IF EXISTS payload_locked_documents_rels_order_idx;"
```

Then just reload — no restart needed. This has recurred on every single sync so far; if a *different* index starts showing the same "already exists" error, drop that one the same way.

### Media files

The db references uploads by filename, so after refreshing the db, missing media will 500. Pull the VM's `public/media` down with `rsync` (not a flat `scp`) so it only fetches new/changed files and never deletes anything local-only:

```bash
rsync -avz -e ssh luke@chasingachance.com:/opt/services/clients/putnamcountydemocratclubofwv/PutnamCountyDemWebsite/public/media/ public/media/
```

This only pulls data one direction (VM → laptop). Never scp/rsync in the other direction — real content should still be authored directly in the VM's admin panel.

## Domains (as of 2026-09-22)

Both nginx server blocks point at the same app (port 3007) and share one Payload/db backend — there's no separate "prod" vs "dev" deployment yet, just two hostnames in front of the same running instance.

- **`putnamdemswv.com`** — the real production domain, behind Cloudflare (proxied DNS). Canonical is the root domain; `www` and plain HTTP both 301 to `https://putnamdemswv.com`. Cert via `certbot --nginx -d putnamdemswv.com -d www.putnamdemswv.com`, covers both names.
- **`putnamcountydemocratclubofwv.chasingachance.com`** — the original subdomain. Password-protected as of 2026-09-22 (decided this should become a separate dev/staging environment later, not stay public once the real domain was live) via HTTP Basic Auth:
  - Credentials: `putnamdev` / `41B9HZAHx4J2Jk+pZ+HyeJ4K`
  - Password file: `/etc/nginx/.htpasswd-putnamdemswv-dev` (dedicated to this — not the same file `access.lukeshort.dev` uses)
  - Still fully functional, just gated — useful for previewing before the real dev/staging split happens.

**Origin locked to Cloudflare (done 2026-09-22)**: `putnamdemswv.com`'s three server blocks (content, `www` redirect, HTTP redirect) each `include /etc/nginx/cloudflare-ips.conf` — an allowlist of Cloudflare's published ranges (https://www.cloudflare.com/ips/) ending in `deny all;`. Direct requests to the origin IP now get a 403; only Cloudflare-proxied traffic reaches the app. Verified this doesn't affect any other domain on the box (each has its own server block, no shared restriction). If Cloudflare adds/retires IP ranges, update `/etc/nginx/cloudflare-ips.conf` — every server block referencing it picks up the change on the next `nginx -t && systemctl reload nginx`, no need to touch the per-domain files.

Also added `proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;` to the content block so the real visitor IP is available to the app if anything ever needs it (activity log, future rate limiting) — nothing reads it yet, this is just forward-looking.

**`NEXT_PUBLIC_SERVER_URL` note**: this env var is baked into the build (not just read at runtime) — it feeds `next.config.ts`'s image `remotePatterns` and Payload's `serverURL` (which is what gets prepended to every `/api/media/file/*` URL). Changing it always requires a rebuild + `pm2 restart`, not just an env edit. Got bitten by this once already on 2026-09-22 — images briefly pointed at the old subdomain after the domain cutover until the rebuild caught up.
