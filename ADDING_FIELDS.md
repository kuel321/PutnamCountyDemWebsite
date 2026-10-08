# Adding a Field to a Collection

How to add a new field to an existing collection (or global) in this project, end to end — editing the config, verifying locally, generating the migration, and deploying. For adding a whole new collection, see the "Adding a new block type" and migration-generation sections of `DATABASE_MIGRATIONS.md`; the steps are the same, just with a new `CollectionConfig` file and an entry in `src/payload.config.ts` instead of a field.

## 1. Edit the collection config

Collection files live in `src/collections/` (e.g. `src/collections/Candidates.ts`, `src/collections/TreasuryReports.ts`). Add the new field to that collection's `fields` array.

Common field types used in this project, with real examples from the codebase:

**Text**
```ts
{
  name: 'title',
  type: 'text',
  required: true,
},
```

**Number**
```ts
{
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: {
    description: 'Lower numbers appear first in candidate listings.',
  },
},
```

**Checkbox**
```ts
{
  name: 'enabled',
  type: 'checkbox',
  defaultValue: true,
  label: 'Access Enabled',
},
```

**Select**
```ts
{
  name: 'period',
  type: 'select',
  options: [
    { label: 'Q1', value: 'q1' },
    { label: 'Q2', value: 'q2' },
  ],
},
```

**Date**
```ts
{
  name: 'date',
  type: 'date',
  required: true,
  admin: {
    date: {
      pickerAppearance: 'dayOnly',
      displayFormat: 'MMM d, yyyy',
    },
  },
},
```

**Relationship** (links to another collection)
```ts
{
  name: 'meeting',
  type: 'relationship',
  relationTo: 'meetings',
},
```

**Upload** (file/image, via the `media` collection)
```ts
{
  name: 'file',
  type: 'upload',
  relationTo: 'media',
  required: true,
},
```

**Rich text**
```ts
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [...rootFeatures, HeadingFeature(), FixedToolbarFeature()],
  }),
},
```

A few things to know about rich text specifically:

- The project-wide default editor (`src/fields/defaultLexical.ts`, used as `rootFeatures` above) is deliberately minimal — paragraphs, bold/italic/underline, links. **No list feature, no headings** unless a block/field explicitly adds them via its own `features` override (as `Content`, `MeetingMinutes`, etc. do).
- If you write richText JSON by hand (e.g. in a one-off script), every node `type` you use must correspond to a feature actually registered on that specific field's editor, or Payload throws a `parseEditorState` error (`Minified Lexical error #17`) when the admin tries to render it. Don't assume `rootFeatures` includes lists/headings — check the field's own `editor:` config.

## 2. Verify locally

`npm run dev` runs Payload's SQLite adapter in push mode — it diffs your config against the local dev database on every server start and applies the difference automatically. Start (or restart) the dev server, open `/admin`, and confirm the field shows up and behaves as expected.

No migration file is created by this step — push mode never writes one.

## 3. Generate the migration

This is what actually gets the change onto production. Full detail (including the known stale-snapshot issue and how to work around it) is in `DATABASE_MIGRATIONS.md` — short version:

```bash
npx payload migrate:create <short-description> --force-accept-warning
```

- If it asks an unrelated question (about a field you didn't touch), stop — that's the documented stale-snapshot issue, not a real ambiguity. Write the migration by hand instead: copy the `ALTER TABLE ... ADD` SQL that push mode already applied to your local dev db's schema (`sqlite3 your.db ".schema table_name"`), following the style of an existing migration in `src/migrations/`.
- Open the generated (or hand-written) `.ts` file and read it before trusting it — especially for a column drop or rename.

## 4. Regenerate types

```bash
npm run generate:types
```

Updates `src/payload-types.ts` so the new field is typed everywhere it's used.

## 5. Commit

Commit the collection config change, the migration `.ts` (+ `.json` snapshot if one was generated), the updated `src/migrations/index.ts`, and `src/payload-types.ts`.

## 6. Test risky migrations against a real copy of prod first

For anything beyond a plain additive field (a drop, a rename, a required field with no default on a table that already has rows), test against a scratch copy of production before it goes anywhere near the real database:

```bash
scp luke@chasingachance.com:/opt/services/clients/putnamcountydemocratclubofwv/PutnamCountyDemWebsite/putnam-county-dem-club-live.db ./scratch-migration-test.db
DATABASE_URL="file:./scratch-migration-test.db" NODE_ENV=production npx payload migrate
# confirm it looks right, then:
rm scratch-migration-test.db scratch-migration-test.db-shm scratch-migration-test.db-wal
```

## 7. Deploy

Back up the VM's live `.db` (see `VM_ACCESS.md`), then push and deploy as usual. `deploy.sh` runs `npx payload migrate` for you — no manual migration step on the VM.
