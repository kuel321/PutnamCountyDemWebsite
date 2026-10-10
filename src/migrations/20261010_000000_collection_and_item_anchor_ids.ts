import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Hand-written for the same reason as prior migrations — see
// DATABASE_MIGRATIONS.md's "Known issue: the schema snapshot is stale".
//
// Extends the per-block anchor_id (added in
// 20261009_200000_numbered_list_block_and_anchor_ids) down to every
// public-facing collection that's rendered as a repeating list on the
// frontend, plus MediaGrid's per-photo array items — so any individual
// candidate, meeting, meeting minutes entry, highlight, or grid photo can
// be deep-linked to directly, not just whole blocks.

const TABLES = [
  'candidates',
  'meetings',
  'meeting_minutes',
  '_meeting_minutes_v',
  'highlights',
  'pages_blocks_media_grid_items',
  '_pages_v_blocks_media_grid_items',
  'candidates_blocks_media_grid_items',
  'candidate_pages_blocks_media_grid_items',
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`anchor_id\` text;`))
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`anchor_id\`;`))
  }
}
