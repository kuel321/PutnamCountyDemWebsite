import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    CREATE TABLE \`president_messages\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`title\` text DEFAULT 'A Message from the President' NOT NULL,
      \`message\` text NOT NULL,
      \`image_id\` integer,
      \`display_date\` text NOT NULL,
      \`archive_date\` text,
      \`placement\` text DEFAULT 'sitewide' NOT NULL,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
    );
  `)
  await db.run(
    sql`CREATE INDEX \`president_messages_image_idx\` ON \`president_messages\` (\`image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`president_messages_updated_at_idx\` ON \`president_messages\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`president_messages_created_at_idx\` ON \`president_messages\` (\`created_at\`);`,
  )

  // Pages: register the new "President's Message" layout block (published + versions tables)
  await db.run(sql`
    CREATE TABLE \`pages_blocks_president_message\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_president_message_order_idx\` ON \`pages_blocks_president_message\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_president_message_parent_id_idx\` ON \`pages_blocks_president_message\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_president_message_path_idx\` ON \`pages_blocks_president_message\` (\`_path\`);`,
  )

  await db.run(sql`
    CREATE TABLE \`_pages_v_blocks_president_message\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`_path\` text NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`_uuid\` text,
      \`block_name\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_president_message_order_idx\` ON \`_pages_v_blocks_president_message\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_president_message_parent_id_idx\` ON \`_pages_v_blocks_president_message\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_president_message_path_idx\` ON \`_pages_v_blocks_president_message\` (\`_path\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_pages_v_blocks_president_message\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_president_message\`;`)
  await db.run(sql`DROP TABLE \`president_messages\`;`)
}
