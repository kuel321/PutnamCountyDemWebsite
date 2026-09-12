import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// The 20260912_195232_president_messages migration added the collection but
// missed this: Payload's document-locking feature needs a column on the
// shared payload_locked_documents_rels table for every collection, or any
// save operation (in any collection) fails when it checks for locks.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`president_messages_id\` integer REFERENCES president_messages(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_president_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`president_messages_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_president_messages_id_idx\`;`,
  )
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`president_messages_id\`;`)
}
