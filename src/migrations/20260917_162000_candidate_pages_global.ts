import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // New global: "Candidate Pages (All Candidates)" — blocks shown on every
  // candidate profile page (e.g. the district finder), separate from each
  // candidate's own "Additional Content Blocks" field.
  await db.run(sql`
    CREATE TABLE \`candidate_pages\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`updated_at\` text,
      \`created_at\` text
    );
  `)

  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_find_district\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text DEFAULT 'Find Your District',
      \`intro\` text DEFAULT 'Enter your home address to see your Magisterial, WV House, WV Senate, and US Congressional districts.',
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_find_district_order_idx\` ON \`candidate_pages_blocks_find_district\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_find_district_parent_id_idx\` ON \`candidate_pages_blocks_find_district\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_find_district_path_idx\` ON \`candidate_pages_blocks_find_district\` (\`_path\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_content\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`rich_text\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_content_order_idx\` ON \`candidate_pages_blocks_content\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_content_parent_id_idx\` ON \`candidate_pages_blocks_content\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_content_path_idx\` ON \`candidate_pages_blocks_content\` (\`_path\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_media_content\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`media_id\` integer NOT NULL,
      \`external_link\` text,
      \`content\` text,
      \`block_name\` text,
      FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_content_order_idx\` ON \`candidate_pages_blocks_media_content\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_content_parent_id_idx\` ON \`candidate_pages_blocks_media_content\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_content_path_idx\` ON \`candidate_pages_blocks_media_content\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_content_media_idx\` ON \`candidate_pages_blocks_media_content\` (\`media_id\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_media_grid\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_grid_order_idx\` ON \`candidate_pages_blocks_media_grid\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_grid_parent_id_idx\` ON \`candidate_pages_blocks_media_grid\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_grid_path_idx\` ON \`candidate_pages_blocks_media_grid\` (\`_path\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`candidate_pages_blocks_media_grid_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`media_id\` integer NOT NULL,
      \`caption\` text,
      FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidate_pages_blocks_media_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_grid_items_order_idx\` ON \`candidate_pages_blocks_media_grid_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_grid_items_parent_id_idx\` ON \`candidate_pages_blocks_media_grid_items\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidate_pages_blocks_media_grid_items_media_idx\` ON \`candidate_pages_blocks_media_grid_items\` (\`media_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_media_grid_items\`;`)
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_media_grid\`;`)
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_media_content\`;`)
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`candidate_pages_blocks_find_district\`;`)
  await db.run(sql`DROP TABLE \`candidate_pages\`;`)
}
