import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`treasury_reports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`fiscal_year\` numeric,
  	\`period\` text,
  	\`notes\` text,
  	\`file_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`treasury_reports_file_idx\` ON \`treasury_reports\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`treasury_reports_updated_at_idx\` ON \`treasury_reports\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`treasury_reports_created_at_idx\` ON \`treasury_reports\` (\`created_at\`);`)

  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`treasury_reports_id\` integer REFERENCES treasury_reports(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_treasury_reports_id_idx\` ON \`payload_locked_documents_rels\` (\`treasury_reports_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_treasury_reports_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`treasury_reports_id\`;`)
  await db.run(sql`DROP TABLE \`treasury_reports\`;`)
}
