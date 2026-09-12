import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    CREATE TABLE \`candidates_photos\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`image_id\` integer NOT NULL,
      FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidates\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await db.run(
    sql`CREATE INDEX \`candidates_photos_order_idx\` ON \`candidates_photos\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidates_photos_parent_id_idx\` ON \`candidates_photos\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`candidates_photos_image_idx\` ON \`candidates_photos\` (\`image_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`candidates_photos\`;`)
}
