import { MigrationInterface, QueryRunner } from "typeorm";

export class PatronRegistrationChangeColNameV21742699448178 implements MigrationInterface {
    name = 'PatronRegistrationChangeColNameV21742699448178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" RENAME COLUMN "preferredPlayereLevels" TO "preferredPlayerLevels"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Patron_preferredplayerelevels_enum" RENAME TO "Patron_preferredplayerlevels_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "sportEaze"."Patron_preferredplayerlevels_enum" RENAME TO "Patron_preferredplayerelevels_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" RENAME COLUMN "preferredPlayerLevels" TO "preferredPlayereLevels"`);
    }

}
