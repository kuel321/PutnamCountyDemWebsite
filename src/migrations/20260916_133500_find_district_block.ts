import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Pages: register the new "Find Your District (Map)" layout block (published + versions tables)
  await db.run(sql`
    CREATE TABLE \`pages_blocks_find_district\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text DEFAULT 'Find Your District',
      \`intro\` text DEFAULT 'Enter your home address to see your Magisterial, WV House, WV Senate, and US Congressional districts.',
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_find_district_order_idx\` ON \`pages_blocks_find_district\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_find_district_parent_id_idx\` ON \`pages_blocks_find_district\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_find_district_path_idx\` ON \`pages_blocks_find_district\` (\`_path\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_find_district\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`heading\` text DEFAULT 'Find Your District',
      \`intro\` text DEFAULT 'Enter your home address to see your Magisterial, WV House, WV Senate, and US Congressional districts.',
      \`_uuid\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_find_district_order_idx\` ON \`_pages_v_blocks_find_district\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_find_district_parent_id_idx\` ON \`_pages_v_blocks_find_district\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_find_district_path_idx\` ON \`_pages_v_blocks_find_district\` (\`_path\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_pages_v_blocks_find_district\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_find_district\`;`)
}
