# Database Migrations

This project uses [Payload's migration system](https://payloadcms.com/docs/database/migrations) to apply schema changes to production safely. This doc explains how it works here, why it replaced the old deploy script, and exactly what to do for common changes.

Everything below was verified against this project directly (not just copied from docs) — file paths, generated SQL, and CLI behavior were all checked by hand on 2026-08-26.

## Push vs. migrations — two different things

**`npm run dev` never generates migration files.** It runs Payload's SQLite adapter in "push" mode: every time the dev server starts, it diffs your current collection config against the live dev database and applies the difference directly — no file is written, nothing is committed. This is the default and the officially recommended way to iterate locally. Keep using it exactly as before; nothing about local day-to-day dev changes.

**Migrations are a separate, explicit system**, used only for getting a schema change onto another database (production) predictably:

- `payload migrate:create <name>` — generates a migration file under `src/migrations/` (plus a `.json` schema snapshot) representing the diff between your current config and the last migration's snapshot
- `payload migrate` — runs any migration files not yet recorded as applied
- `payload migrate:status` — shows which migrations have run
- `payload migrate:down` — rolls back the most recently applied batch

**Never run `payload migrate` against your local dev database.** It's managed by push, and Payload knows this (it looks for a `dev` tracking row in the `payload_migrations` table) — if you run `migrate` there, it'll throw an interactive "you've used push, data loss will occur, proceed?" confirmation, and since there's usually no terminal watching a background dev server, that prompt will just hang the process. Locally, only ever use `migrate:create` to *generate* a file — don't apply it locally.

## Why this replaced the old deploy step

`deploy.sh` used to run a script that just called `getPayload({ config })` on the server — that's the *push* mechanism again, run non-interactively over SSH during deploy. It worked fine for additive changes (new field, new collection), but the first time we needed to remove a field, it threw the same interactive "accept data loss?" prompt with nothing able to answer it, freezing the deploy. `deploy.sh` now runs `npx payload migrate` instead, which applies pre-written, already-reviewed SQL — no live diffing, no prompts, deterministic.

## The baseline

Since this project had zero migration history (everything, including production, was built entirely through push), the very first migration had to be a **baseline**: a snapshot of the complete current schema, used as the reference point all future `migrate:create` diffs are measured against.

- File: `src/migrations/20260826_131212_baseline.ts` (+ matching `.json` snapshot)
- It contains a full `CREATE TABLE` for every table in the schema. That's expected — a database that's genuinely empty (a fresh environment) would run this for real and it'd correctly bootstrap everything.
- For a database that **already has this schema** (our local dev db, via years of push), it's marked as applied without running its SQL — that's the standard way to adopt migrations onto an existing database: you tell Payload "trust me, this one's already done" by inserting a row into the `payload_migrations` table matching the migration's filename (`{name: '20260826_131212_baseline', batch: 1}`). Payload's `migrate` command only checks whether a row with that name exists — it doesn't re-verify the SQL — so this is the sanctioned mechanism, not a hack.

**Production went through this catch-up on 2026-08-26/27** and has applied every migration since. Verify current state any time with `npx payload migrate:status` run on the VM (see `VM_ACCESS.md`) rather than trusting this doc's word for it — migration state changes with every deploy.

## Workflow for a normal schema change (adding a field, a collection, etc.)

1. Make the change in your collection/global/block config as usual.
2. Confirm it looks right locally — `npm run dev` will push it to your local db automatically.
3. Generate the migration file:
   ```
   npx payload migrate:create <short-description> --force-accept-warning
   ```
   `--force-accept-warning` just skips confirmation prompts for the file-generation step itself (safe for additive changes — see the rename caveat below). Since your local db already has this change (from push), **do not run `payload migrate` locally** — the file is only meant to apply this diff to *other* environments.
4. **Read the generated file.** It's plain TypeScript with raw SQL in `up()`/`down()` — for anything non-trivial, confirm it's doing what you expect before committing it.
5. Commit the migration `.ts` file, its `.json` snapshot, and the updated `src/migrations/index.ts` (this barrel file is what `payload migrate` reads to know which migrations exist — do not gitignore any of this).
6. Deploy as usual. `deploy.sh` runs `npx payload migrate` before building, which will find and apply this one pending migration against production, then continue to build/restart.

## Removing or renaming a field

Same steps as above, with one extra thing to check: **open the generated migration and verify it's doing what you meant.**

- **Removing a field** generates an `ALTER TABLE ... DROP COLUMN`. Straightforward, but irreversible for whatever data was in that column on whatever database you run it against — make sure any data worth keeping has already been migrated elsewhere (this is exactly the situation the `layout` blocks change was in — see the git history around 2026-08-26 for a worked example of copying field data into a new structure via a one-off script before dropping the old field).
- **Renaming a field** is ambiguous to Payload's diffing — it can't always tell "rename A to B" apart from "delete A, add B." Left to run in an interactive terminal, `migrate:create` will ask you to clarify. If you use `--force-accept-warning`, it'll pick a default — **check the generated SQL**; if it did a drop+add instead of a rename, existing data in that column will be silently lost when applied. If that happens, either regenerate without the force flag and answer interactively, or hand-edit the migration file to use `ALTER TABLE ... RENAME COLUMN old TO new` instead.

## Adding a new block type to an existing blocks field

This is what today's `layout` field (Content + MeetingInfo blocks) went through. A new block type just needs new tables (`ALTER`-free — Payload creates a `{collection}_blocks_{blockslug}` table per block type), so it's a purely additive migration — same as "adding a field," no special handling needed. If you later remove a block type that's in use, treat it like removing a field: make sure any existing block data of that type is handled first.

## Applying a migration to production for the first time each deploy

You generally don't do anything manual here — it's built into `deploy.sh`:

```bash
git pull
npm install
npx payload migrate       # applies any pending migration files
npm run generate:types
npm run build
pm2 restart putnamcountydemwebsite
```

If `migrate` finds nothing pending, it logs `No migrations to run.` and exits cleanly — safe to run on every deploy even when nothing changed.

## Rolling back

`npx payload migrate:down` rolls back the most recently applied *batch* (everything applied together in one `migrate` run). Each migration file's `down()` function is auto-generated as the inverse of `up()` — for anything destructive (a dropped column), review that the `down()` can actually restore what you need before relying on it; Payload can regenerate the column, but not the data that was in it.

## Testing a risky migration before it touches production

For anything you're unsure about (especially column drops or renames), test it against a real copy of the production data first rather than trusting it cold:

1. `scp` a fresh copy of the production `.db` file down locally (see project history for the exact path/command).
2. Point a scratch `DATABASE_URL` at that copy.
3. Run `npx payload migrate` against it and confirm the result looks right.
4. Only then let the real deploy run it against production.

## One-time production catch-up (completed 2026-08-26/27)

This happened once, historically, to adopt the baseline migration onto production's pre-existing pre-blocks schema. Left here as a worked example if a similar one-off data-shape migration is ever needed again:

1. `scp` a **fresh** copy of the live production `.db` (not an old snapshot — the site is public and can receive real form submissions at any time, so always pull current data right before doing this).
2. Run the same content-to-`layout` migration used locally (copies each page's `content` richText into a `layout` Content block; see git history for the script, since it's not kept in the repo permanently — it's meant to be re-created ad hoc for a one-off data move like this).
3. Manually drop the now-redundant `content` / `_pages_v.version_content` columns, same as was done locally.
4. Mark `20260826_131212_baseline` as applied on that database (insert `{name: '20260826_131212_baseline', batch: 1}` into `payload_migrations`), so production's migration history matches local's from this point forward.
5. Deploy the new code.

## Known issue: the schema snapshot is stale (discovered 2026-09-18)

`migrate:create`'s diff isn't computed against the last *applied* migration — it's computed against the last committed `.json` **snapshot** file. Only the first four migrations (through `20260907_222600_minutes_submissions`) ever got a snapshot committed alongside them; every migration since (16 of them, through `20260917_183000`) only committed its `.ts` file.

The practical effect: running `migrate:create` today diffs your current schema against a snapshot that's over a week and 16 migrations stale. It doesn't know about any of those intervening changes, so it can ask confusing, unrelated questions (e.g. "is `minutes_submissions.file_id` a new column or a rename?" when neither your current change nor that migration have anything to do with each other), and if forced through with a wrong guess on an ambiguous rename, it can silently generate a migration that drops real data.

**Until this is fixed, don't trust `migrate:create`'s interactive prompts blindly.** If it asks about a field you didn't touch, stop — that's this staleness, not a real ambiguity in your change. For an additive-only change (new field, new block, new collection) it's safe to write the migration file by hand instead: copy the exact `CREATE TABLE`/`ALTER TABLE ... ADD` SQL that push mode already generated in your local dev db's schema (`sqlite3 your.db ".schema table_name"`), following the style of any existing migration file. This is exactly what `20260918_150000_form_block_and_media_grid_credit` does — read it as a template.

**The real fix** is to regenerate a fresh snapshot so future `migrate:create` runs have an accurate baseline again. That should happen the next time there's a quiet moment (not bundled into an unrelated feature deploy): run `migrate:create` once purely to produce a current snapshot, confirm the generated migration is a genuine no-op against production's actual schema (it should be, since production is fully caught up — see `migrate:status`), and commit both files. From then on, always commit the `.json` snapshot alongside every migration `.ts` file — that's step 5 of the normal workflow above; it was just being skipped.
