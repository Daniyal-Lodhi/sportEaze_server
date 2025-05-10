import { MigrationInterface, QueryRunner } from "typeorm";

export class AppSettings1746398494107 implements MigrationInterface {
    name = 'AppSettings1746398494107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."AppSettings" ("id" SERIAL NOT NULL, "allowDeleteUser" boolean NOT NULL DEFAULT true, "allowUpdateUser" boolean NOT NULL DEFAULT true, "shouldTakeConsent" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_6aa09b2e72fe676f59619a8045d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sportEaze"."AppSettings"`);
    }
}
