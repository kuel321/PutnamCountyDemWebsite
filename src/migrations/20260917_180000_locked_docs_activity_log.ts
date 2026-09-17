import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// The 20260917_170500_activity_log migration added the collection but missed
// this: Payload's document-locking feature needs a column on the shared
// payload_locked_documents_rels table for every collection, or any admin
// page load that queries locks (which is most of them) fails.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`activity_log_id\` integer REFERENCES activity_log(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_activity_log_id_idx\` ON \`payload_locked_documents_rels\` (\`activity_log_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_activity_log_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`activity_log_id\`;`)
}
