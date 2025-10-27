import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying(100) NOT NULL,
        "username" character varying(100) NOT NULL,
        "password" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create notes table
    await queryRunner.query(`
      CREATE TABLE "notes" (
        "id" SERIAL NOT NULL,
        "title" character varying(255) NOT NULL,
        "content" text NOT NULL,
        "category" character varying(50),
        "userId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notes_id" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "notes" 
      ADD CONSTRAINT "FK_notes_userId" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Insert sample data
    await queryRunner.query(`
      INSERT INTO "users" ("email", "username", "password") VALUES 
      ('admin@example.com', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
    `);

    await queryRunner.query(`
      INSERT INTO "notes" ("title", "content", "category") VALUES 
      ('Welcome to Notes Service', 'This is your first note! You can edit or delete it.', 'General'),
      ('Getting Started', 'Here are some tips for using the notes service:\n\n1. Create new notes using the + button\n2. Click on any note to view or edit it\n3. Use categories to organize your notes\n4. Search through your notes using the search bar', 'Tips'),
      ('Sample Note', 'This is a sample note with some content. You can modify this text or delete this note entirely.', 'Sample')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
