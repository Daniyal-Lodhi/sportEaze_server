import { DEFAULT_USER_PROFILE_PIC_URL } from "src/common/consts/user-const";
import { MigrationInterface, QueryRunner } from "typeorm";

export class MentorRegistration1743105255623 implements MigrationInterface {
    name = 'MentorRegistration1743105255623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patrons_patrontype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patrons_supportedsports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patrons_preferredplayerlevels_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patrons_preferredfundingtypes_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patrons_status_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Patrons" ("id" uuid NOT NULL, "patronType" "sportEaze"."Patrons_patrontype_enum" NOT NULL, "industryType" character varying, "supportedSports" "sportEaze"."Patrons_supportedsports_enum" array NOT NULL, "preferredPlayerLevels" "sportEaze"."Patrons_preferredplayerlevels_enum" array NOT NULL, "preferredFundingTypes" "sportEaze"."Patrons_preferredfundingtypes_enum" array NOT NULL, "website" character varying, "linkedIn" character varying, "fbLink" character varying, "xLink" character varying, "instaLink" character varying, "status" "sportEaze"."Patrons_status_enum" NOT NULL DEFAULT '1', "reviewedByAdminId" uuid, "adminReviewComment" text, CONSTRAINT "PK_b45fdbae11f4f877ec958600a26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_role_enum" AS ENUM('Coach', 'Fitness Trainer', 'Sports Psychologist')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_sportinterests_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."mentors" ("id" uuid NOT NULL, "role" "sportEaze"."mentors_role_enum" NOT NULL, "sportInterests" "sportEaze"."mentors_sportinterests_enum" array NOT NULL, "yearsOfExperience" character varying(50) NOT NULL, "currentAffiliation" character varying(255), "website" character varying, "linkedIn" character varying, "fbLink" character varying, "xLink" character varying, "instaLink" character varying, "verificationDocuments" text array, CONSTRAINT "PK_67a614446eab992e4d0580afebf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`UPDATE "sportEaze"."Users" SET "profilePicUrl" = '${DEFAULT_USER_PROFILE_PIC_URL}' WHERE "profilePicUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" SET DEFAULT 'https://res.cloudinary.com/dpe70dvug/image/upload/v1743014138/Untitled_200_x_200_px_1_cie24l.png'`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patrons" ADD CONSTRAINT "FK_b45fdbae11f4f877ec958600a26" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD CONSTRAINT "FK_67a614446eab992e4d0580afebf" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP CONSTRAINT "FK_67a614446eab992e4d0580afebf"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patrons" DROP CONSTRAINT "FK_b45fdbae11f4f877ec958600a26"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "sportEaze"."mentors"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_sportinterests_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_role_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Patrons"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patrons_status_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patrons_preferredfundingtypes_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patrons_preferredplayerlevels_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patrons_supportedsports_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patrons_patrontype_enum"`);
    }

}
