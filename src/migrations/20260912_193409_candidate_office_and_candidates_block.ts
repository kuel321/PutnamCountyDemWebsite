import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Candidates: add "Office / Race" short text field
  await db.run(sql`ALTER TABLE \`candidates\` ADD \`office\` text;`)

  // Pages: register the new "Candidates" layout block (published + versions tables)
  await db.run(sql`
    CREATE TABLE \`pages_blocks_candidates\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`heading\` text DEFAULT 'Meet Our Candidates',
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_candidates_order_idx\` ON \`pages_blocks_candidates\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_candidates_parent_id_idx\` ON \`pages_blocks_candidates\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_candidates_path_idx\` ON \`pages_blocks_candidates\` (\`_path\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_candidates\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`heading\` text DEFAULT 'Meet Our Candidates',
      \`_uuid\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_candidates_order_idx\` ON \`_pages_v_blocks_candidates\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_candidates_parent_id_idx\` ON \`_pages_v_blocks_candidates\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_candidates_path_idx\` ON \`_pages_v_blocks_candidates\` (\`_path\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_pages_v_blocks_candidates\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_candidates\`;`)
  await db.run(sql`ALTER TABLE \`candidates\` DROP COLUMN \`office\`;`)
}
