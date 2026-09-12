import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Users: add a profile photo, reused anywhere this person is credited as an author.
  await db.run(sql`ALTER TABLE \`users\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`users_image_idx\` ON \`users\` (\`image_id\`);`)

  // President Messages: replace the standalone photo with an author relationship
  // (name + photo now come from the linked user). SQLite can't drop a column
  // that's part of a foreign key, so the table is rebuilt.
  await db.run(sql`
    CREATE TABLE \`__new_president_messages\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`title\` text DEFAULT 'A Message from the President' NOT NULL,
      \`author_id\` integer,
      \`message\` text NOT NULL,
      \`display_date\` text NOT NULL,
      \`archive_date\` text,
      \`placement\` text DEFAULT 'sitewide' NOT NULL,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
    );
  `)
  await db.run(sql`
    INSERT INTO \`__new_president_messages\`
      (\`id\`, \`title\`, \`message\`, \`display_date\`, \`archive_date\`, \`placement\`, \`updated_at\`, \`created_at\`)
    SELECT \`id\`, \`title\`, \`message\`, \`display_date\`, \`archive_date\`, \`placement\`, \`updated_at\`, \`created_at\`
    FROM \`president_messages\`;
  `)
  await db.run(sql`DROP TABLE \`president_messages\`;`)
  await db.run(sql`ALTER TABLE \`__new_president_messages\` RENAME TO \`president_messages\`;`)
  await db.run(
    sql`CREATE INDEX \`president_messages_author_idx\` ON \`president_messages\` (\`author_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`president_messages_updated_at_idx\` ON \`president_messages\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`president_messages_created_at_idx\` ON \`president_messages\` (\`created_at\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`
    CREATE TABLE \`__new_president_messages\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`title\` text DEFAULT 'A Message from the President' NOT NULL,
      \`message\` text NOT NULL,
      \`image_id\` integer,
      \`display_date\` text NOT NULL,
      \`archive_date\` text,
      \`placement\` text DEFAULT 'sitewide' NOT NULL,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
    );
  `)
  await db.run(sql`
    INSERT INTO \`__new_president_messages\`
      (\`id\`, \`title\`, \`message\`, \`display_date\`, \`archive_date\`, \`placement\`, \`updated_at\`, \`created_at\`)
    SELECT \`id\`, \`title\`, \`message\`, \`display_date\`, \`archive_date\`, \`placement\`, \`updated_at\`, \`created_at\`
    FROM \`president_messages\`;
  `)
  await db.run(sql`DROP TABLE \`president_messages\`;`)
  await db.run(sql`ALTER TABLE \`__new_president_messages\` RENAME TO \`president_messages\`;`)
  await db.run(
    sql`CREATE INDEX \`president_messages_image_idx\` ON \`president_messages\` (\`image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`president_messages_updated_at_idx\` ON \`president_messages\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`president_messages_created_at_idx\` ON \`president_messages\` (\`created_at\`);`,
  )

  // SQLite can't drop a column that's part of a foreign key either, so this
  // table is rebuilt too.
  await db.run(sql`
    CREATE TABLE \`__new_users\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`name\` text,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`email\` text NOT NULL,
      \`reset_password_token\` text,
      \`reset_password_expiration\` text,
      \`salt\` text,
      \`hash\` text,
      \`login_attempts\` numeric DEFAULT 0,
      \`lock_until\` text
    );
  `)
  await db.run(sql`
    INSERT INTO \`__new_users\`
      (\`id\`, \`name\`, \`updated_at\`, \`created_at\`, \`email\`, \`reset_password_token\`, \`reset_password_expiration\`, \`salt\`, \`hash\`, \`login_attempts\`, \`lock_until\`)
    SELECT \`id\`, \`name\`, \`updated_at\`, \`created_at\`, \`email\`, \`reset_password_token\`, \`reset_password_expiration\`, \`salt\`, \`hash\`, \`login_attempts\`, \`lock_until\`
    FROM \`users\`;
  `)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`ALTER TABLE \`__new_users\` RENAME TO \`users\`;`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
}
