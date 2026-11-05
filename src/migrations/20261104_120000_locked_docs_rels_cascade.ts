import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// payload_locked_documents_rels gets one column per collection. The five added
// by later migrations (president messages, activity log, treasury reports,
// ballot styles/races) used `ADD ... REFERENCES x(id)`, which has no
// ON DELETE CASCADE — so deleting one of those documents while a lock row
// pointed at it could fail, and dev push mode saw the table as different from
// Payload's schema on every start (and crashed rebuilding it).
//
// SQLite can't alter a foreign key in place, so this rebuilds the table with
// Payload's exact definition. Lock rows are transient; any that point at a
// document that no longer exists are dropped rather than copied.

// [column, referenced table], in Payload's column order.
const RELATIONS: [string, string][] = [
  ['pages_id', 'pages'],
  ['posts_id', 'posts'],
  ['media_id', 'media'],
  ['categories_id', 'categories'],
  ['meetings_id', 'meetings'],
  ['meeting_minutes_id', 'meeting_minutes'],
  ['candidates_id', 'candidates'],
  ['districts_id', 'districts'],
  ['highlights_id', 'highlights'],
  ['minutes_submissions_id', 'minutes_submissions'],
  ['users_id', 'users'],
  ['club_members_id', 'club_members'],
  ['president_messages_id', 'president_messages'],
  ['treasury_reports_id', 'treasury_reports'],
  ['ballot_styles_id', 'ballot_styles'],
  ['ballot_races_id', 'ballot_races'],
  ['activity_log_id', 'activity_log'],
  ['redirects_id', 'redirects'],
  ['forms_id', 'forms'],
  ['form_submissions_id', 'form_submissions'],
  ['search_id', 'search'],
  ['payload_folders_id', 'payload_folders'],
]

// The five columns whose foreign keys this migration fixes; down() restores
// them to the plain `REFERENCES x(id)` form they had before.
const UNCASCADED = new Set([
  'president_messages_id',
  'activity_log_id',
  'treasury_reports_id',
  'ballot_styles_id',
  'ballot_races_id',
])

const columns = ['id', 'order', 'parent_id', 'path', ...RELATIONS.map(([column]) => column)]

function createTableSQL(tableName: string, cascadeAll: boolean): string {
  const columnDefs = [
    '`id` integer PRIMARY KEY NOT NULL',
    '`order` integer',
    '`parent_id` integer NOT NULL',
    '`path` text NOT NULL',
    ...RELATIONS.map(([column, table]) =>
      !cascadeAll && UNCASCADED.has(column)
        ? `\`${column}\` integer REFERENCES ${table}(id)`
        : `\`${column}\` integer`,
    ),
  ]
  const foreignKeys = [
    'FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade',
    ...RELATIONS.filter(([column]) => cascadeAll || !UNCASCADED.has(column)).map(
      ([column, table]) =>
        `FOREIGN KEY (\`${column}\`) REFERENCES \`${table}\`(\`id\`) ON UPDATE no action ON DELETE cascade`,
    ),
  ]
  return `CREATE TABLE \`${tableName}\` (\n\t${[...columnDefs, ...foreignKeys].join(',\n\t')}\n);`
}

async function rebuild({ db }: MigrateUpArgs | MigrateDownArgs, cascadeAll: boolean) {
  const columnList = columns.map((column) => `\`${column}\``).join(', ')
  const validRows = [
    '`parent_id` IN (SELECT `id` FROM `payload_locked_documents`)',
    ...RELATIONS.map(
      ([column, table]) => `(\`${column}\` IS NULL OR \`${column}\` IN (SELECT \`id\` FROM \`${table}\`))`,
    ),
  ].join('\n    AND ')

  await db.run(sql.raw(createTableSQL('__new_payload_locked_documents_rels', cascadeAll)))
  await db.run(
    sql.raw(
      `INSERT INTO \`__new_payload_locked_documents_rels\` (${columnList})\n  SELECT ${columnList} FROM \`payload_locked_documents_rels\`\n  WHERE ${validRows};`,
    ),
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )

  // Dropping the old table dropped its indexes too, so these are all fresh.
  // Payload names the parent_id index `_parent_idx`; every other one is `_<column>_idx`.
  for (const column of ['order', 'parent_id', 'path', ...RELATIONS.map(([c]) => c)]) {
    const indexName = `payload_locked_documents_rels_${column === 'parent_id' ? 'parent' : column}_idx`
    await db.run(
      sql.raw(
        `CREATE INDEX \`${indexName}\` ON \`payload_locked_documents_rels\` (\`${column}\`);`,
      ),
    )
  }
}

export async function up(args: MigrateUpArgs): Promise<void> {
  await rebuild(args, true)
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await rebuild(args, false)
}
