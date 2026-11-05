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

For a consistent copy while the site is live, snapshot with SQLite's own backup command on the VM and `scp` the snapshot instead of the live file:

```bash
ssh luke@chasingachance.com 'cd /opt/services/clients/putnamcountydemocratclubofwv/PutnamCountyDemWebsite && sqlite3 putnam-county-dem-club-live.db ".backup /tmp/putnam-live-snapshot.db"'
scp luke@chasingachance.com:/tmp/putnam-live-snapshot.db ./putnam-county-dem-club-prod.db
ssh luke@chasingachance.com 'rm -f /tmp/putnam-live-snapshot.db'
```

**There's no longer an "index already exists" error after a sync** (fixed 2026-11-04). It used to happen every time because push mode saw the synced db as different from Payload's schema, tried to rebuild tables, and crashed on drizzle-kit's duplicate `CREATE INDEX` statements. See "Required-but-nullable columns" in `DATABASE_MIGRATIONS.md` for what fixed it. If it ever comes back, don't drop indexes by hand — that section explains how to find the real mismatch.

Exception: until `20261104_120000_locked_docs_rels_cascade` is deployed to the VM, a fresh sync won't have it applied yet. In that case, apply it to the synced copy before starting dev: `npx payload migrate` (works because a freshly synced db has no push-mode `dev` row).

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
