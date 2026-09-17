import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// The 20260917_143700_media_grid_block migration got this table's id/parent
// columns wrong: nested-array rows inside a *versioned* block use an
// auto-increment integer id (matching the versioned block table's own id
// type), not the text/uuid id used by nested arrays in the *live* tables.
// Payload inserts version rows with id: null expecting SQLite to assign it,
// which fails against a text PRIMARY KEY (no autoincrement) — every attempt
// to add a photo to a Photo Grid block while editing a draft/autosave fails
// with "NOT NULL constraint failed: _pages_v_blocks_media_grid_items.id".
// Table is confirmed empty in production, so a drop+recreate is lossless.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_grid_items\`;`)

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_media_grid_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`media_id\` integer,
      \`caption\` text,
      \`_uuid\` text,
      FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_media_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_items_order_idx\` ON \`_pages_v_blocks_media_grid_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_items_parent_id_idx\` ON \`_pages_v_blocks_media_grid_items\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_items_media_idx\` ON \`_pages_v_blocks_media_grid_items\` (\`media_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_grid_items\`;`)

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_media_grid_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`media_id\` integer,
      \`caption\` text,
      \`_uuid\` text,
      FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_media_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_items_order_idx\` ON \`_pages_v_blocks_media_grid_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_items_parent_id_idx\` ON \`_pages_v_blocks_media_grid_items\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_items_media_idx\` ON \`_pages_v_blocks_media_grid_items\` (\`media_id\`);`,
  )
}
