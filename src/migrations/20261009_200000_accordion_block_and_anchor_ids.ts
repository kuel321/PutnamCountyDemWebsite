import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Hand-written for the same reason as prior migrations — see
// DATABASE_MIGRATIONS.md's "Known issue: the schema snapshot is stale".
// Two changes bundled together since they touch the same block configs:
// 1. A new "Numbered Accordion" block (pages, candidates, candidate_pages).
// 2. An optional `anchor_id` column added to every existing block type, so
//    any block on the site can be deep-linked to (e.g. #history).

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

  // --- Pages: new "accordion" block (published) ---
  await db.run(sql`
    CREATE TABLE \`pages_blocks_accordion\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`anchor_id\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_order_idx\` ON \`pages_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_parent_id_idx\` ON \`pages_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_path_idx\` ON \`pages_blocks_accordion\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`pages_blocks_accordion_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text NOT NULL,
      \`content\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_items_order_idx\` ON \`pages_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_items_parent_id_idx\` ON \`pages_blocks_accordion_items\` (\`_parent_id\`);`)

  // --- Pages: new "accordion" block (versions) ---
  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_accordion\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_order_idx\` ON \`_pages_v_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_parent_id_idx\` ON \`_pages_v_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_path_idx\` ON \`_pages_v_blocks_accordion\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_accordion_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`heading\` text NOT NULL,
      \`content\` text,
      \`_uuid\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_items_order_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_items_parent_id_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_parent_id\`);`)

  // --- Candidates collection: new "accordion" block ---
  await db.run(sql`
    CREATE TABLE \`candidates_blocks_accordion\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`anchor_id\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidates\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidates_blocks_accordion_order_idx\` ON \`candidates_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidates_blocks_accordion_parent_id_idx\` ON \`candidates_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`candidates_blocks_accordion_path_idx\` ON \`candidates_blocks_accordion\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`candidates_blocks_accordion_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text NOT NULL,
      \`content\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidates_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidates_blocks_accordion_items_order_idx\` ON \`candidates_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidates_blocks_accordion_items_parent_id_idx\` ON \`candidates_blocks_accordion_items\` (\`_parent_id\`);`)

  // --- CandidatePages global: new "accordion" block ---
  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_accordion\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`anchor_id\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_accordion_order_idx\` ON \`candidate_pages_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_accordion_parent_id_idx\` ON \`candidate_pages_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_accordion_path_idx\` ON \`candidate_pages_blocks_accordion\` (\`_path\`);`)

  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_accordion_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text NOT NULL,
      \`content\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_accordion_items_order_idx\` ON \`candidate_pages_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidate_pages_blocks_accordion_items_parent_id_idx\` ON \`candidate_pages_blocks_accordion_items\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`candidates_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`candidates_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion\`;`)

  for (const table of ALL_EXISTING_BLOCK_TABLES) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`anchor_id\`;`))
  }
}
