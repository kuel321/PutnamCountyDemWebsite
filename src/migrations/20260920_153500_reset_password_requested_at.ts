import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Hand-written for the same reason as 20260918_150000 — see
// DATABASE_MIGRATIONS.md's "Known issue: the schema snapshot is stale".
// This column is new in this version of Payload's auth system itself (not
// something added to our own config) — bumping payload/@payloadcms/* to
// 3.90.1 as part of a dependency security update added it automatically.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD \`reset_password_requested_at\` text;`)
  await db.run(sql`ALTER TABLE \`club_members\` ADD \`reset_password_requested_at\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`club_members\` DROP COLUMN \`reset_password_requested_at\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`reset_password_requested_at\`;`)
}
