import type { SQLiteSchemaHook } from '@payloadcms/db-sqlite'
import type { Payload } from 'payload'

/**
 * Columns that are `required: true` in the Payload config but deliberately
 * nullable in the database, as `table: [column, ...]` using the real SQL names.
 *
 * Payload derives `NOT NULL` from `required`, but these columns were created
 * nullable by hand-written migrations (required is enforced by Payload's
 * validation instead). Without this, dev push mode sees a mismatch on every
 * start and tries to rebuild each table — which also crashes, because
 * drizzle-kit emits duplicate `CREATE INDEX` statements during rebuilds.
 *
 * If you add a migration that makes a required column nullable on purpose,
 * add it here too. If a column here is removed or renamed, take it out —
 * startup logs a warning for any entry that no longer matches the schema.
 */
const NULLABLE_REQUIRED_COLUMNS: Record<string, string[]> = {
  candidate_pages_blocks_numbered_list_items: ['heading'],
  candidates: ['slug'],
  candidates_blocks_media_content: ['media_id'],
  candidates_blocks_media_grid_items: ['media_id'],
  candidates_blocks_numbered_list_items: ['heading'],
  president_messages: ['author_id'],
  treasury_reports: ['file_id'],
}

// The parts of Payload's raw (pre-Drizzle) schema this hook touches. The full
// types live in @payloadcms/drizzle, which isn't a direct dependency.
type RawSchemaAdapter = {
  payload: Payload
  rawTables: Record<
    string,
    { name: string; columns: Record<string, { name: string; notNull?: boolean }> }
  >
}

/**
 * Runs before Payload turns its raw schema into Drizzle tables, so both dev
 * push and `migrate:create` see these columns as nullable.
 */
export const keepRequiredColumnsNullable: SQLiteSchemaHook = (args) => {
  // The hook receives the adapter at runtime, but SQLiteSchemaHook's args type omits it.
  const { payload, rawTables } = (args as typeof args & { adapter: RawSchemaAdapter }).adapter

  for (const [tableName, columnNames] of Object.entries(NULLABLE_REQUIRED_COLUMNS)) {
    const table = Object.values(rawTables).find((rawTable) => rawTable.name === tableName)

    for (const columnName of columnNames) {
      const column = table && Object.values(table.columns).find((col) => col.name === columnName)

      if (!column) {
        payload.logger.warn(
          `keepRequiredColumnsNullable: ${tableName}.${columnName} isn't in the schema anymore — remove it from NULLABLE_REQUIRED_COLUMNS.`,
        )
        continue
      }

      column.notNull = false
    }
  }

  return args.schema
}
