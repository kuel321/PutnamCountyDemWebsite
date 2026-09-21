import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Hand-written for the same reason as prior migrations — see
// DATABASE_MIGRATIONS.md's "Known issue: the schema snapshot is stale".
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`candidates\` ADD \`order\` numeric DEFAULT 0;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`candidates\` DROP COLUMN \`order\`;`)
}
