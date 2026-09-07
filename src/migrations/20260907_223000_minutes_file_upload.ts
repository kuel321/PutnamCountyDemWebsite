import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`minutes_submissions\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`minutes_submissions\` ADD \`file_id\` integer REFERENCES media(id);`)
  await db.run(
    sql`CREATE INDEX \`minutes_submissions_file_idx\` ON \`minutes_submissions\` (\`file_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`meeting_minutes\` ADD \`file_id\` integer REFERENCES media(id);`)
  await db.run(
    sql`CREATE INDEX \`meeting_minutes_file_idx\` ON \`meeting_minutes\` (\`file_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`meeting_minutes_file_idx\`;`)
  await db.run(sql`ALTER TABLE \`meeting_minutes\` DROP COLUMN \`file_id\`;`)
  await db.run(sql`DROP INDEX \`minutes_submissions_file_idx\`;`)
  await db.run(sql`ALTER TABLE \`minutes_submissions\` DROP COLUMN \`file_id\`;`)
  await db.run(sql`ALTER TABLE \`minutes_submissions\` ADD \`content\` text;`)
}
