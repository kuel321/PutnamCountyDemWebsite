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

### Media files

The db references uploads by filename, so after refreshing the db, missing media will 500. Pull the VM's `public/media` down with `rsync` (not a flat `scp`) so it only fetches new/changed files and never deletes anything local-only:

```bash
rsync -avz -e ssh luke@chasingachance.com:/opt/services/clients/putnamcountydemocratclubofwv/PutnamCountyDemWebsite/public/media/ public/media/
```

This only pulls data one direction (VM → laptop). Never scp/rsync in the other direction — real content should still be authored directly in the VM's admin panel.
