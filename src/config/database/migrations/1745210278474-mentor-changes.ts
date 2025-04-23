import { MigrationInterface, QueryRunner } from "typeorm";

export class MentorChanges1745210278474 implements MigrationInterface {
    name = 'MentorChanges1745210278474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD "primarySport" "sportEaze"."mentors_primarysport_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD "bio" character varying`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP COLUMN "yearsOfExperience"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD "yearsOfExperience" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP COLUMN "yearsOfExperience"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD "yearsOfExperience" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "isAdmin"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP COLUMN "primarySport"`);
    }

}
