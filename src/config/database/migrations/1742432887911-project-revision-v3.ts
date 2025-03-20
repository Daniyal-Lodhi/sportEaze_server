import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectRevisionV31742432887911 implements MigrationInterface {
    name = 'ProjectRevisionV31742432887911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" RENAME COLUMN "sportsInterest" TO "sportInterests"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_sportsinterest_enum" RENAME TO "Users_sportinterests_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "sportInterests"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "sportInterests" "sportEaze"."Users_sportinterests_enum" array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "sportInterests"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_sportinterests_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "sportInterests" "sportEaze"."Users_sportinterests_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" RENAME COLUMN "sportInterests" TO "sportsInterest"`);
    }

}
