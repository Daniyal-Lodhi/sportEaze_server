import { MigrationInterface, QueryRunner } from "typeorm";

export class PatronVerification1742794067697 implements MigrationInterface {
    name = 'PatronVerification1742794067697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_status_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD "status" "sportEaze"."Patron_status_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD "reviewedByAdminId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD "adminReviewComment" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP COLUMN "adminReviewComment"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP COLUMN "reviewedByAdminId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_status_enum"`);
    }

}
