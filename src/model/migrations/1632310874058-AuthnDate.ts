import {MigrationInterface, QueryRunner} from "typeorm";

export class AuthnDate1632310874058 implements MigrationInterface {
    name = 'AuthnDate1632310874058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userName" varchar NOT NULL, "password" varchar NOT NULL, "creationDate" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_bb8c2552037cbafec3c98932e4e" UNIQUE ("userName"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name") SELECT "id", "name" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "type" integer NOT NULL, "ownerId" integer, "creationDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_138d7762e76b7fee9de6db0f8eb" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_media"("id", "name", "type", "ownerId") SELECT "id", "name", "type", "ownerId" FROM "media"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`ALTER TABLE "temporary_media" RENAME TO "media"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" RENAME TO "temporary_media"`);
        await queryRunner.query(`CREATE TABLE "media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "type" integer NOT NULL, "ownerId" integer, CONSTRAINT "FK_138d7762e76b7fee9de6db0f8eb" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "media"("id", "name", "type", "ownerId") SELECT "id", "name", "type", "ownerId" FROM "temporary_media"`);
        await queryRunner.query(`DROP TABLE "temporary_media"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user"("id", "name") SELECT "id", "name" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
