import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`footer\` ADD \`chasing_a_chance_url\` text DEFAULT 'https://chasingachance.com';`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`chasing_a_chance_url\`;`)
}
