import { DEFAULT_USER_PROFILE_PIC_URL } from "src/common/consts/user-const";
import { MigrationInterface, QueryRunner } from "typeorm";

export class MentorRegistration1743105255623 implements MigrationInterface {
    name = 'MentorRegistration1743105255623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_role_enum" AS ENUM('Coach', 'Fitness Trainer', 'Sports Psychologist')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_sportinterests_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."mentors" ("id" uuid NOT NULL, "role" "sportEaze"."mentors_role_enum" NOT NULL, "sportInterests" "sportEaze"."mentors_sportinterests_enum" array NOT NULL, "yearsOfExperience" character varying(50) NOT NULL, "currentAffiliation" character varying(255), "website" character varying, "linkedIn" character varying, "fbLink" character varying, "xLink" character varying, "instaLink" character varying, "verificationDocuments" text array, CONSTRAINT "PK_67a614446eab992e4d0580afebf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`UPDATE "sportEaze"."Users" SET "profilePicUrl" = '${DEFAULT_USER_PROFILE_PIC_URL}' WHERE "profilePicUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" SET DEFAULT 'https://res.cloudinary.com/dpe70dvug/image/upload/v1743014138/Untitled_200_x_200_px_1_cie24l.png'`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD CONSTRAINT "FK_67a614446eab992e4d0580afebf" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP CONSTRAINT "FK_67a614446eab992e4d0580afebf"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "profilePicUrl" DROP NOT NULL`);
        await queryRunner.query(`UPDATE "sportEaze"."Users" SET "profilePicUrl" = NULL WHERE "profilePicUrl" = '${DEFAULT_USER_PROFILE_PIC_URL}'`);
        await queryRunner.query(`DROP TABLE "sportEaze"."mentors"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_sportinterests_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_role_enum"`);
    }

}
