import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectRevisionV21742237175257 implements MigrationInterface {
    name = 'ProjectRevisionV21742237175257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "FK_05655610e77f99bc8814af2b72c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Achievements" DROP CONSTRAINT "FK_4294cffda1c4f72bb5872b3475e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "CHK_3d1bff4e9d7d9be730feeda3c9"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "club"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "FB_link"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "INSTA_link"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "X_link"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "secondaySports"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_secondaysports_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "playerId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Achievements" DROP COLUMN "playerId"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_secondarysports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "secondarySports" "sportEaze"."Player_secondarysports_enum" array`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "currentTeam" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "playerBio" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "trainingLocation" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "fbLink" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "instaLink" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "xLink" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "coachName"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "coachName" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "coachName"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "coachName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "xLink"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "instaLink"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "fbLink"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "trainingLocation"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "playerBio"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "currentTeam"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "secondarySports"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_secondarysports_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Achievements" ADD "playerId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "playerId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "bio" character varying(200)`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_secondaysports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "secondaySports" "sportEaze"."Player_secondaysports_enum" array`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "X_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "INSTA_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "FB_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "club" character varying(25)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "region" character varying(25)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "rank" integer`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "CHK_3d1bff4e9d7d9be730feeda3c9" CHECK (((rank >= 1) AND (rank <= 100)))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Achievements" ADD CONSTRAINT "FK_4294cffda1c4f72bb5872b3475e" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "FK_05655610e77f99bc8814af2b72c" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
