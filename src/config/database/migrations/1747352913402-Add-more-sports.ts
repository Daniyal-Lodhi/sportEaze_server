import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreSports1747352913402 implements MigrationInterface {
    name = 'AddMoreSports1747352913402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "sportEaze"."mentors_sportinterests_enum" RENAME TO "mentors_sportinterests_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_sportinterests_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ALTER COLUMN "sportInterests" TYPE "sportEaze"."mentors_sportinterests_enum"[] USING "sportInterests"::"text"::"sportEaze"."mentors_sportinterests_enum"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_sportinterests_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."mentors_primarysport_enum" RENAME TO "mentors_primarysport_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_primarysport_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ALTER COLUMN "primarySport" TYPE "sportEaze"."mentors_primarysport_enum" USING "primarySport"::"text"::"sportEaze"."mentors_primarysport_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_primarysport_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Player_primarysport_enum" RENAME TO "Player_primarysport_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_primarysport_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ALTER COLUMN "primarySport" TYPE "sportEaze"."Player_primarysport_enum" USING "primarySport"::"text"::"sportEaze"."Player_primarysport_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_primarysport_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Player_secondarysports_enum" RENAME TO "Player_secondarysports_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_secondarysports_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ALTER COLUMN "secondarySports" TYPE "sportEaze"."Player_secondarysports_enum"[] USING "secondarySports"::"text"::"sportEaze"."Player_secondarysports_enum"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_secondarysports_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_sportinterests_enum" RENAME TO "Users_sportinterests_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_sportinterests_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "sportInterests" TYPE "sportEaze"."Users_sportinterests_enum"[] USING "sportInterests"::"text"::"sportEaze"."Users_sportinterests_enum"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_sportinterests_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Patron_supportedsports_enum" RENAME TO "Patron_supportedsports_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_supportedsports_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ALTER COLUMN "supportedSports" TYPE "sportEaze"."Patron_supportedsports_enum"[] USING "supportedSports"::"text"::"sportEaze"."Patron_supportedsports_enum"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_supportedsports_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum" RENAME TO "SponsoredPostTargetSports_sport_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostTargetSports" ALTER COLUMN "sport" TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum" USING "sport"::"text"::"sportEaze"."SponsoredPostTargetSports_sport_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostTargetSports" ALTER COLUMN "sport" TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum_old" USING "sport"::"text"::"sportEaze"."SponsoredPostTargetSports_sport_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum_old" RENAME TO "SponsoredPostTargetSports_sport_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_supportedsports_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ALTER COLUMN "supportedSports" TYPE "sportEaze"."Patron_supportedsports_enum_old"[] USING "supportedSports"::"text"::"sportEaze"."Patron_supportedsports_enum_old"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_supportedsports_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Patron_supportedsports_enum_old" RENAME TO "Patron_supportedsports_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_sportinterests_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "sportInterests" TYPE "sportEaze"."Users_sportinterests_enum_old"[] USING "sportInterests"::"text"::"sportEaze"."Users_sportinterests_enum_old"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_sportinterests_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_sportinterests_enum_old" RENAME TO "Users_sportinterests_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_secondarysports_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ALTER COLUMN "secondarySports" TYPE "sportEaze"."Player_secondarysports_enum_old"[] USING "secondarySports"::"text"::"sportEaze"."Player_secondarysports_enum_old"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_secondarysports_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Player_secondarysports_enum_old" RENAME TO "Player_secondarysports_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_primarysport_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ALTER COLUMN "primarySport" TYPE "sportEaze"."Player_primarysport_enum_old" USING "primarySport"::"text"::"sportEaze"."Player_primarysport_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_primarysport_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Player_primarysport_enum_old" RENAME TO "Player_primarysport_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_primarysport_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ALTER COLUMN "primarySport" TYPE "sportEaze"."mentors_primarysport_enum_old" USING "primarySport"::"text"::"sportEaze"."mentors_primarysport_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_primarysport_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."mentors_primarysport_enum_old" RENAME TO "mentors_primarysport_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_sportinterests_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ALTER COLUMN "sportInterests" TYPE "sportEaze"."mentors_sportinterests_enum_old"[] USING "sportInterests"::"text"::"sportEaze"."mentors_sportinterests_enum_old"[]`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_sportinterests_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."mentors_sportinterests_enum_old" RENAME TO "mentors_sportinterests_enum"`);
    }

}
