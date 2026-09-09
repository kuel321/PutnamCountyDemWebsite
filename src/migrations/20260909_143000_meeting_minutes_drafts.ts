import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_meeting_minutes_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_date\` text,
  	\`version_meeting_id\` integer,
  	\`version_content\` text,
  	\`version_file_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`meeting_minutes\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meeting_id\`) REFERENCES \`meetings\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_parent_idx\` ON \`_meeting_minutes_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_version_version_meeting_idx\` ON \`_meeting_minutes_v\` (\`version_meeting_id\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_version_version_file_idx\` ON \`_meeting_minutes_v\` (\`version_file_id\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_version_version_updated_at_idx\` ON \`_meeting_minutes_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_version_version_created_at_idx\` ON \`_meeting_minutes_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_version_version__status_idx\` ON \`_meeting_minutes_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_created_at_idx\` ON \`_meeting_minutes_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_updated_at_idx\` ON \`_meeting_minutes_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_meeting_minutes_v_latest_idx\` ON \`_meeting_minutes_v\` (\`latest\`);`)

  await db.run(sql`CREATE TABLE \`__new_meeting_minutes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`date\` text,
  	\`meeting_id\` integer,
  	\`content\` text,
  	\`file_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`meeting_id\`) REFERENCES \`meetings\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  // Existing rows predate drafts and have always been publicly visible — carry
  // them forward as published rather than defaulting to draft.
  await db.run(sql`INSERT INTO \`__new_meeting_minutes\` (\`id\`, \`title\`, \`date\`, \`meeting_id\`, \`content\`, \`file_id\`, \`updated_at\`, \`created_at\`, \`_status\`)
    SELECT \`id\`, \`title\`, \`date\`, \`meeting_id\`, \`content\`, \`file_id\`, \`updated_at\`, \`created_at\`, 'published' FROM \`meeting_minutes\`;`)
  await db.run(sql`DROP TABLE \`meeting_minutes\`;`)
  await db.run(sql`ALTER TABLE \`__new_meeting_minutes\` RENAME TO \`meeting_minutes\`;`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_meeting_idx\` ON \`meeting_minutes\` (\`meeting_id\`);`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_file_idx\` ON \`meeting_minutes\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_updated_at_idx\` ON \`meeting_minutes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_created_at_idx\` ON \`meeting_minutes\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`meeting_minutes__status_idx\` ON \`meeting_minutes\` (\`_status\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_meeting_minutes_v\`;`)

  await db.run(sql`CREATE TABLE \`__old_meeting_minutes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`meeting_id\` integer,
  	\`content\` text,
  	\`file_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`meeting_id\`) REFERENCES \`meetings\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__old_meeting_minutes\` (\`id\`, \`title\`, \`date\`, \`meeting_id\`, \`content\`, \`file_id\`, \`updated_at\`, \`created_at\`)
    SELECT \`id\`, \`title\`, \`date\`, \`meeting_id\`, \`content\`, \`file_id\`, \`updated_at\`, \`created_at\` FROM \`meeting_minutes\`;`)
  await db.run(sql`DROP TABLE \`meeting_minutes\`;`)
  await db.run(sql`ALTER TABLE \`__old_meeting_minutes\` RENAME TO \`meeting_minutes\`;`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_meeting_idx\` ON \`meeting_minutes\` (\`meeting_id\`);`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_file_idx\` ON \`meeting_minutes\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_updated_at_idx\` ON \`meeting_minutes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`meeting_minutes_created_at_idx\` ON \`meeting_minutes\` (\`created_at\`);`)
}
