import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Pages: register the new "Photo Grid (3-Wide)" layout block (published + versions tables)
  await db.run(sql`
    CREATE TABLE \`pages_blocks_media_grid\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_media_grid_order_idx\` ON \`pages_blocks_media_grid\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_media_grid_parent_id_idx\` ON \`pages_blocks_media_grid\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_media_grid_path_idx\` ON \`pages_blocks_media_grid\` (\`_path\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`pages_blocks_media_grid_items\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`media_id\` integer,
      \`caption\` text,
      FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_media_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_media_grid_items_order_idx\` ON \`pages_blocks_media_grid_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_media_grid_items_parent_id_idx\` ON \`pages_blocks_media_grid_items\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_media_grid_items_media_idx\` ON \`pages_blocks_media_grid_items\` (\`media_id\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_media_grid\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`heading\` text,
      \`_uuid\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_order_idx\` ON \`_pages_v_blocks_media_grid\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_parent_id_idx\` ON \`_pages_v_blocks_media_grid\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_grid_path_idx\` ON \`_pages_v_blocks_media_grid\` (\`_path\`);`,
  )

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

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_grid_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_grid_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_grid\`;`)
}
