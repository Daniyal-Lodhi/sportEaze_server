import { MigrationInterface, QueryRunner } from "typeorm";

export class PatronRegistrationChangeColName1742699163974 implements MigrationInterface {
    name = 'PatronRegistrationChangeColName1742699163974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" RENAME COLUMN "preferredAthleteLevels" TO "preferredPlayereLevels"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Patron_preferredathletelevels_enum" RENAME TO "Patron_preferredplayerelevels_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "sportEaze"."Patron_preferredplayerelevels_enum" RENAME TO "Patron_preferredathletelevels_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" RENAME COLUMN "preferredPlayereLevels" TO "preferredAthleteLevels"`);
    }

}
