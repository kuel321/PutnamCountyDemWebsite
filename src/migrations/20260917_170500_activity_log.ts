import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // New collection: a simple "who did what, when" record, written automatically
  // by a shared hook (src/hooks/activityLog.ts) attached to every other
  // collection/global — nothing here is entered by hand.
  await db.run(sql`
    CREATE TABLE \`activity_log\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`summary\` text,
      \`action\` text,
      \`area\` text,
      \`item\` text,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );
  `)
  await db.run(
    sql`CREATE INDEX \`activity_log_updated_at_idx\` ON \`activity_log\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`activity_log_created_at_idx\` ON \`activity_log\` (\`created_at\`);`,
  )

  // The "actor" field is a polymorphic relationship (users OR club-members),
  // which Payload's sqlite adapter stores as a separate join table with one
  // nullable FK column per possible related collection.
  await db.run(sql`
    CREATE TABLE \`activity_log_rels\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`order\` integer,
      \`parent_id\` integer NOT NULL,
      \`path\` text NOT NULL,
      \`users_id\` integer,
      \`club_members_id\` integer,
      FOREIGN KEY (\`parent_id\`) REFERENCES \`activity_log\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY (\`club_members_id\`) REFERENCES \`club_members\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`activity_log_rels_order_idx\` ON \`activity_log_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`activity_log_rels_parent_idx\` ON \`activity_log_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`activity_log_rels_path_idx\` ON \`activity_log_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`activity_log_rels_users_id_idx\` ON \`activity_log_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`activity_log_rels_club_members_id_idx\` ON \`activity_log_rels\` (\`club_members_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`activity_log_rels\`;`)
  await db.run(sql`DROP TABLE \`activity_log\`;`)
}
