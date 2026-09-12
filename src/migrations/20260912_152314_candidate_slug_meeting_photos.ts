import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Candidates: add slug field (auto-generated from title, same pattern as Pages/Posts)
  await db.run(sql`ALTER TABLE \`candidates\` ADD \`generate_slug\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`candidates\` ADD \`slug\` text;`)
  await db.run(
    sql`UPDATE \`candidates\` SET \`slug\` = lower(replace(\`title\`, ' ', '-')) WHERE \`slug\` IS NULL;`,
  )
  await db.run(sql`CREATE UNIQUE INDEX \`candidates_slug_idx\` ON \`candidates\` (\`slug\`);`)

  // Meetings: add photos gallery, with a per-photo "hide from public page" checkbox
  await db.run(sql`
    CREATE TABLE \`meetings_photos\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`image_id\` integer NOT NULL,
      \`hide_from_public\` integer DEFAULT false,
      FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`meetings\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(sql`CREATE INDEX \`meetings_photos_order_idx\` ON \`meetings_photos\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`meetings_photos_parent_id_idx\` ON \`meetings_photos\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`meetings_photos_image_idx\` ON \`meetings_photos\` (\`image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`meetings_photos\`;`)

  await db.run(sql`DROP INDEX \`candidates_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`candidates\` DROP COLUMN \`slug\`;`)
  await db.run(sql`ALTER TABLE \`candidates\` DROP COLUMN \`generate_slug\`;`)
}
