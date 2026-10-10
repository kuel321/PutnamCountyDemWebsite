import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Hand-written for the same reason as prior migrations — see
// DATABASE_MIGRATIONS.md's "Known issue: the schema snapshot is stale".
// Two changes bundled together since they touch the same block configs:
// 1. A new "Numbered List" block (pages, candidates, candidate_pages) —
//    numbered items with a heading + rich text body, and an optional
//    per-item "Read more" link that jumps to another anchor on the page.
// 2. An optional `anchor_id` column added to every existing block type, so
//    any block on the site can be deep-linked to (e.g. #history).
//
// Note: `heading` is a required field in the Payload config, but is NOT
// NOT NULL at the DB level — Payload's admin autosaves draft state
// (including a freshly-added, not-yet-filled-in array row) well before
// publish-time validation runs, so a DB constraint here breaks autosave.
// Same reason required upload/relationship fields never get NOT NULL.

const PAGES_BLOCK_TABLES = [
  'pages_blocks_content',
  'pages_blocks_meeting_info',
  'pages_blocks_candidates',
  'pages_blocks_president_message',
  'pages_blocks_media_content',
  'pages_blocks_find_district',
  'pages_blocks_media_grid',
  'pages_blocks_form',
]

const PAGES_V_BLOCK_TABLES = [
  '_pages_v_blocks_content',
  '_pages_v_blocks_meeting_info',
  '_pages_v_blocks_candidates',
  '_pages_v_blocks_president_message',
  '_pages_v_blocks_media_content',
  '_pages_v_blocks_find_district',
  '_pages_v_blocks_media_grid',
  '_pages_v_blocks_form',
]

const CANDIDATES_BLOCK_TABLES = [
  'candidates_blocks_content',
  'candidates_blocks_media_content',
  'candidates_blocks_media_grid',
]

const CANDIDATE_PAGES_BLOCK_TABLES = [
  'candidate_pages_blocks_content',
  'candidate_pages_blocks_find_district',
  'candidate_pages_blocks_media_content',
  'candidate_pages_blocks_media_grid',
]

const ALL_EXISTING_BLOCK_TABLES = [
  ...PAGES_BLOCK_TABLES,
  ...PAGES_V_BLOCK_TABLES,
  ...CANDIDATES_BLOCK_TABLES,
  ...CANDIDATE_PAGES_BLOCK_TABLES,
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const table of ALL_EXISTING_BLOCK_TABLES) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`anchor_id\` text;`))
  }

  // --- Pages: new "numbered_list" block (published) ---
  await db.run(sql`
    CREATE TABLE \`pages_blocks_numbered_list\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`anchor_id\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_numbered_list_order_idx\` ON \`pages_blocks_numbered_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_numbered_list_parent_id_idx\` ON \`pages_blocks_numbered_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_numbered_list_path_idx\` ON \`pages_blocks_numbered_list\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`pages_blocks_numbered_list_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text,
      \`content\` text,
      \`anchor_id\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_numbered_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_numbered_list_items_order_idx\` ON \`pages_blocks_numbered_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_numbered_list_items_parent_id_idx\` ON \`pages_blocks_numbered_list_items\` (\`_parent_id\`);`)

  // --- Pages: new "numbered_list" block (versions) ---
  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_numbered_list\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`anchor_id\` text,
      \`_uuid\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_numbered_list_order_idx\` ON \`_pages_v_blocks_numbered_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_numbered_list_parent_id_idx\` ON \`_pages_v_blocks_numbered_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_numbered_list_path_idx\` ON \`_pages_v_blocks_numbered_list\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_numbered_list_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`heading\` text,
      \`content\` text,
      \`anchor_id\` text,
      \`_uuid\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_numbered_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_numbered_list_items_order_idx\` ON \`_pages_v_blocks_numbered_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_numbered_list_items_parent_id_idx\` ON \`_pages_v_blocks_numbered_list_items\` (\`_parent_id\`);`)

  // --- Candidates collection: new "numbered_list" block ---
  await db.run(sql`
    CREATE TABLE \`candidates_blocks_numbered_list\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`anchor_id\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidates\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidates_blocks_numbered_list_order_idx\` ON \`candidates_blocks_numbered_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidates_blocks_numbered_list_parent_id_idx\` ON \`candidates_blocks_numbered_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`candidates_blocks_numbered_list_path_idx\` ON \`candidates_blocks_numbered_list\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`candidates_blocks_numbered_list_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text,
      \`content\` text,
      \`anchor_id\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidates_blocks_numbered_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidates_blocks_numbered_list_items_order_idx\` ON \`candidates_blocks_numbered_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidates_blocks_numbered_list_items_parent_id_idx\` ON \`candidates_blocks_numbered_list_items\` (\`_parent_id\`);`)

  // --- CandidatePages global: new "numbered_list" block ---
  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_numbered_list\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`anchor_id\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_numbered_list_order_idx\` ON \`candidate_pages_blocks_numbered_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_numbered_list_parent_id_idx\` ON \`candidate_pages_blocks_numbered_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_numbered_list_path_idx\` ON \`candidate_pages_blocks_numbered_list\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_numbered_list_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text,
      \`content\` text,
      \`anchor_id\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages_blocks_numbered_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_numbered_list_items_order_idx\` ON \`candidate_pages_blocks_numbered_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_numbered_list_items_parent_id_idx\` ON \`candidate_pages_blocks_numbered_list_items\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_numbered_list_items\`;`)
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_numbered_list\`;`)
  await db.run(sql`DROP TABLE \`candidates_blocks_numbered_list_items\`;`)
  await db.run(sql`DROP TABLE \`candidates_blocks_numbered_list\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_numbered_list_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_numbered_list\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_numbered_list_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_numbered_list\`;`)

  for (const table of ALL_EXISTING_BLOCK_TABLES) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`anchor_id\`;`))
  }
}
