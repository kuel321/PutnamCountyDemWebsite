import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`candidates_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text NOT NULL,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`candidates_links_order_idx\` ON \`candidates_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidates_links_parent_id_idx\` ON \`candidates_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`candidates_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`candidates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`candidates_gallery_order_idx\` ON \`candidates_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`candidates_gallery_parent_id_idx\` ON \`candidates_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`candidates_gallery_image_idx\` ON \`candidates_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`candidates\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`type\` text DEFAULT 'putnam-county' NOT NULL,
  	\`district_id\` integer,
  	\`headshot_id\` integer,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`district_id\`) REFERENCES \`districts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`headshot_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`candidates_district_idx\` ON \`candidates\` (\`district_id\`);`)
  await db.run(sql`CREATE INDEX \`candidates_headshot_idx\` ON \`candidates\` (\`headshot_id\`);`)
  await db.run(sql`CREATE INDEX \`candidates_updated_at_idx\` ON \`candidates\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`candidates_created_at_idx\` ON \`candidates\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`candidates_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`candidates\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`candidates_rels_order_idx\` ON \`candidates_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`candidates_rels_parent_idx\` ON \`candidates_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`candidates_rels_path_idx\` ON \`candidates_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`candidates_rels_pages_id_idx\` ON \`candidates_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`candidates_rels_posts_id_idx\` ON \`candidates_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE TABLE \`districts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`number\` numeric,
  	\`boundary\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`districts_updated_at_idx\` ON \`districts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`districts_created_at_idx\` ON \`districts\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`candidates_id\` integer REFERENCES candidates(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`districts_id\` integer REFERENCES districts(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_candidates_id_idx\` ON \`payload_locked_documents_rels\` (\`candidates_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_districts_id_idx\` ON \`payload_locked_documents_rels\` (\`districts_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`candidates_links\`;`)
  await db.run(sql`DROP TABLE \`candidates_gallery\`;`)
  await db.run(sql`DROP TABLE \`candidates\`;`)
  await db.run(sql`DROP TABLE \`candidates_rels\`;`)
  await db.run(sql`DROP TABLE \`districts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`meetings_id\` integer,
  	\`meeting_minutes_id\` integer,
  	\`users_id\` integer,
  	\`redirects_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`search_id\` integer,
  	\`payload_folders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`meetings_id\`) REFERENCES \`meetings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`meeting_minutes_id\`) REFERENCES \`meeting_minutes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_folders_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id", "media_id", "categories_id", "meetings_id", "meeting_minutes_id", "users_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id", "media_id", "categories_id", "meetings_id", "meeting_minutes_id", "users_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_meetings_id_idx\` ON \`payload_locked_documents_rels\` (\`meetings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_meeting_minutes_id_idx\` ON \`payload_locked_documents_rels\` (\`meeting_minutes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
}
