import { MigrationInterface, QueryRunner } from "typeorm";

export class PatronRegistration1742690380129 implements MigrationInterface {
    name = 'PatronRegistration1742690380129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_patrontype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_supportedsports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_preferredathletelevels_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_preferredfundingtypes_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Patron" ("id" uuid NOT NULL, "patronType" "sportEaze"."Patron_patrontype_enum" NOT NULL, "industryType" character varying, "supportedSports" "sportEaze"."Patron_supportedsports_enum" array NOT NULL, "preferredAthleteLevels" "sportEaze"."Patron_preferredathletelevels_enum" array NOT NULL, "preferredFundingTypes" "sportEaze"."Patron_preferredfundingtypes_enum" array NOT NULL, "website" character varying, "linkedIn" character varying, "fbLink" character varying, "xLink" character varying, "instaLink" character varying, CONSTRAINT "PK_d6aee0f33518f9362cbcc901356" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD CONSTRAINT "FK_d6aee0f33518f9362cbcc901356" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP CONSTRAINT "FK_d6aee0f33518f9362cbcc901356"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Patron"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_preferredfundingtypes_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_preferredathletelevels_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_supportedsports_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_patrontype_enum"`);
    }

}
