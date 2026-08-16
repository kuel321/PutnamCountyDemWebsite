# Getting Started (New Client Setup)

This repo is a blank, working Payload CMS starter (backend + admin panel only,
no public frontend yet). Follow this to stand up a fresh instance for a new
client project.

## 1. Clone

```bash
git clone git@github.com:kuel321/BlankPayload.git my-client-project
cd my-client-project
```

## 2. Install dependencies

```bash
npm install
```

(There's an `package-lock.json` in the repo — stick with `npm`, not `pnpm`,
even though some scripts/docs elsewhere reference pnpm.)

## 3. Configure environment

Copy the example file:

```bash
cp .env.example .env
```

Then fill in `.env`:

```
# SQLite file — pick a name for this client's local dev DB
DATABASE_URL=file:./<client-name>.db

# Generate each of these separately — don't reuse the same value twice,
# and don't reuse values from other client projects
PAYLOAD_SECRET=
CRON_SECRET=
PREVIEW_SECRET=

NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate a secret for each line:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env` is gitignored — it never gets committed. `*.db` is also gitignored, so
your local SQLite file stays local.

> This starter ships wired to SQLite (`@payloadcms/db-sqlite`) for zero-setup
> local dev. If the client project needs Postgres/Mongo/Vercel Postgres for
> production, swap the adapter in `src/payload.config.ts` — see the README's
> "Working with Postgres" and "Deploying to Vercel" sections for the specific
> adapter package and config shape.

## 4. Run it

```bash
npm run dev
```

Open `http://localhost:3000/admin` and follow the on-screen prompt to create
your first admin user. That's the whole setup — Payload pushes the schema to
the SQLite file automatically on first run in dev.

## 5. Rebrand for the client

This starter still has some placeholder branding from where it was
templated. Before handing off to a client, update:

- `package.json` — `name` and `description`
- `src/components/AdminLogo/index.tsx` and `src/components/AdminIcon/index.tsx` — admin panel logo/icon
- `src/components/AdminFooter/index.tsx` and `src/components/BeforeDashboard/index.tsx` — admin panel branding text
- `src/plugins/index.ts` — `generateTitle` has a hardcoded site name used for SEO title tags
- `src/app/(payload)/custom.scss` — admin panel theme colors
- `public/media/` — swap in the client's logo asset, drop the old one
- `src/payload.config.ts` — `admin.meta.icons` favicon path

## 6. What's included

- **Collections**: `Pages`, `Posts` (both with a plain richText `content`
  field + SEO tab, no layout-builder blocks — add your own fields/blocks as
  the client's content model requires), `Media`, `Categories`, `Users`.
- **Plugins**: SEO, search, redirects, nested-docs (for category hierarchies),
  form-builder.
- **No frontend** — this is admin + REST/GraphQL API only. `/` intentionally
  404s. If the client needs a public website, that's a separate build on top
  of this backend (Next.js App Router is already in place to build one into).

## 7. Production

```bash
npm run build
npm run start
```

See the main `README.md` in this repo for Docker, Postgres migrations, and
Vercel deployment details — those instructions still apply as-is.

## Troubleshooting

- **Admin panel 500s with a "Module not found" error**: something in
  `src/collections/*` or `src/plugins/index.ts` is importing a file that
  doesn't exist in this trimmed-down starter (e.g. old block/hero configs).
  Check the import path in the error against what's actually present in `src/`.
- **Admin panel loads but shows stale/wrong custom components**: regenerate
  the import map after changing any admin `components` config:
  ```bash
  npm run generate:importmap
  ```
- **Port 3000 already in use**: another `next dev` from a previous session is
  probably still running in the background — find and kill it rather than
  letting Next.js silently switch ports.
