import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Sample Ballot: two new collections (ballot-styles, ballot-races) plus the
// Pages "sampleBallot" block. DDL copied verbatim from what Payload's own
// schema push generates against an empty database, rather than hand-typed.
// NOT NULL columns appear only on the two new collections, which have no
// drafts/autosave — the Pages block tables (which do autosave) have none.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`ballot_styles\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`precincts\` text NOT NULL,
	\`official_ballot_url\` text,
	\`order\` numeric DEFAULT 0,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);`)
  await db.run(sql`CREATE INDEX \`ballot_styles_updated_at_idx\` ON \`ballot_styles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ballot_styles_created_at_idx\` ON \`ballot_styles\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`ballot_races\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`office\` text NOT NULL,
	\`subtitle\` text,
	\`ticket\` text NOT NULL,
	\`vote_for\` numeric DEFAULT 1,
	\`order\` numeric DEFAULT 0,
	\`note\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);`)
  await db.run(sql`CREATE INDEX \`ballot_races_updated_at_idx\` ON \`ballot_races\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ballot_races_created_at_idx\` ON \`ballot_races\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`ballot_races_choices\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`party\` text,
	\`hometown\` text,
	\`candidate_id\` integer,
	FOREIGN KEY (\`candidate_id\`) REFERENCES \`candidates\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ballot_races\`(\`id\`) ON UPDATE no action ON DELETE cascade
);`)
  await db.run(sql`CREATE INDEX \`ballot_races_choices_order_idx\` ON \`ballot_races_choices\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ballot_races_choices_parent_id_idx\` ON \`ballot_races_choices\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ballot_races_choices_candidate_idx\` ON \`ballot_races_choices\` (\`candidate_id\`);`)
  await db.run(sql`CREATE TABLE \`ballot_races_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`ballot_styles_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`ballot_races\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`ballot_styles_id\`) REFERENCES \`ballot_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade
);`)
  await db.run(sql`CREATE INDEX \`ballot_races_rels_order_idx\` ON \`ballot_races_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`ballot_races_rels_parent_idx\` ON \`ballot_races_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ballot_races_rels_path_idx\` ON \`ballot_races_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`ballot_races_rels_ballot_styles_id_idx\` ON \`ballot_races_rels\` (\`ballot_styles_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_sample_ballot\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`_path\` text NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`heading\` text DEFAULT 'Your Sample Ballot',
	\`intro\` text,
	\`precinct_lookup_url\` text,
	\`anchor_id\` text,
	\`block_name\` text,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_ballot_order_idx\` ON \`pages_blocks_sample_ballot\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_ballot_parent_id_idx\` ON \`pages_blocks_sample_ballot\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_ballot_path_idx\` ON \`pages_blocks_sample_ballot\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_sample_ballot\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`_path\` text NOT NULL,
	\`id\` integer PRIMARY KEY NOT NULL,
	\`heading\` text DEFAULT 'Your Sample Ballot',
	\`intro\` text,
	\`precinct_lookup_url\` text,
	\`anchor_id\` text,
	\`_uuid\` text,
	\`block_name\` text,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_ballot_order_idx\` ON \`_pages_v_blocks_sample_ballot\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_ballot_parent_id_idx\` ON \`_pages_v_blocks_sample_ballot\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_ballot_path_idx\` ON \`_pages_v_blocks_sample_ballot\` (\`_path\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`ballot_styles_id\` integer REFERENCES ballot_styles(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`ballot_races_id\` integer REFERENCES ballot_races(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ballot_styles_id_idx\` ON \`payload_locked_documents_rels\` (\`ballot_styles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ballot_races_id_idx\` ON \`payload_locked_documents_rels\` (\`ballot_races_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_ballot_races_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_ballot_styles_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`ballot_races_id\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`ballot_styles_id\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_sample_ballot\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_sample_ballot\`;`)
  await db.run(sql`DROP TABLE \`ballot_races_rels\`;`)
  await db.run(sql`DROP TABLE \`ballot_races_choices\`;`)
  await db.run(sql`DROP TABLE \`ballot_races\`;`)
  await db.run(sql`DROP TABLE \`ballot_styles\`;`)
}
