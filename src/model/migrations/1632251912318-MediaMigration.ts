import {MigrationInterface, QueryRunner} from "typeorm";

export class MediaMigration1632251912318 implements MigrationInterface {
    name = 'MediaMigration1632251912318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "isLocal" boolean NOT NULL, "mediaId" integer)`);
        await queryRunner.query(`CREATE TABLE "media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "type" integer NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "isLocal" boolean NOT NULL, "mediaId" integer, CONSTRAINT "FK_b8f0e6b37be0ac15836589db3de" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_source"("id", "url", "isLocal", "mediaId") SELECT "id", "url", "isLocal", "mediaId" FROM "source"`);
        await queryRunner.query(`DROP TABLE "source"`);
        await queryRunner.query(`ALTER TABLE "temporary_source" RENAME TO "source"`);
        await queryRunner.query(`CREATE TABLE "temporary_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "type" integer NOT NULL, "ownerId" integer, CONSTRAINT "FK_138d7762e76b7fee9de6db0f8eb" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_media"("id", "name", "type", "ownerId") SELECT "id", "name", "type", "ownerId" FROM "media"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`ALTER TABLE "temporary_media" RENAME TO "media"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" RENAME TO "temporary_media"`);
        await queryRunner.query(`CREATE TABLE "media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "type" integer NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`INSERT INTO "media"("id", "name", "type", "ownerId") SELECT "id", "name", "type", "ownerId" FROM "temporary_media"`);
        await queryRunner.query(`DROP TABLE "temporary_media"`);
        await queryRunner.query(`ALTER TABLE "source" RENAME TO "temporary_source"`);
        await queryRunner.query(`CREATE TABLE "source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "isLocal" boolean NOT NULL, "mediaId" integer)`);
        await queryRunner.query(`INSERT INTO "source"("id", "url", "isLocal", "mediaId") SELECT "id", "url", "isLocal", "mediaId" FROM "temporary_source"`);
        await queryRunner.query(`DROP TABLE "temporary_source"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "source"`);
    }

}
