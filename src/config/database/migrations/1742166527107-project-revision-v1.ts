import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectRevisionV11742166527107 implements MigrationInterface {
    name = 'ProjectRevisionV11742166527107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "FK_b74a5a515799f73b1e371e0c90e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "about"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "preferredSport"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "fullName" character varying(100)`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_sportsinterest_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "sportsInterest" "sportEaze"."Users_sportsinterest_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_primarysport_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "primarySport" "sportEaze"."Player_primarysport_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_secondaysports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "secondaySports" "sportEaze"."Player_secondaysports_enum" array`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_playinglevel_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "playingLevel" "sportEaze"."Player_playinglevel_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "coachName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "bio" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "availableForSponsorship" boolean NOT NULL`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Contracts_status_enum" RENAME TO "Contracts_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Contracts_status_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ALTER COLUMN "status" TYPE "sportEaze"."Contracts_status_enum" USING "status"::"text"::"sportEaze"."Contracts_status_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Contracts_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."PostMedia_mediatype_enum" RENAME TO "PostMedia_mediatype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostMedia_mediatype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostMedia" ALTER COLUMN "mediaType" TYPE "sportEaze"."PostMedia_mediatype_enum" USING "mediaType"::"text"::"sportEaze"."PostMedia_mediatype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostMedia_mediatype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."PostLikes_reacttype_enum" RENAME TO "PostLikes_reacttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostLikes_reacttype_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ALTER COLUMN "reactType" TYPE "sportEaze"."PostLikes_reacttype_enum" USING "reactType"::"text"::"sportEaze"."PostLikes_reacttype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostLikes_reacttype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_visibility_enum" RENAME TO "Posts_visibility_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_visibility_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "visibility" TYPE "sportEaze"."Posts_visibility_enum" USING "visibility"::"text"::"sportEaze"."Posts_visibility_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "visibility" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_visibility_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SharedPosts_visibility_enum" RENAME TO "SharedPosts_visibility_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SharedPosts_visibility_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ALTER COLUMN "visibility" TYPE "sportEaze"."SharedPosts_visibility_enum" USING "visibility"::"text"::"sportEaze"."SharedPosts_visibility_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ALTER COLUMN "visibility" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SharedPosts_visibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_gender_enum" RENAME TO "Users_gender_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_gender_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "gender" TYPE "sportEaze"."Users_gender_enum" USING "gender"::"text"::"sportEaze"."Users_gender_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_gender_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_usertype_enum" RENAME TO "Users_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_usertype_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "userType" TYPE "sportEaze"."Users_usertype_enum" USING "userType"::"text"::"sportEaze"."Users_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_usertype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_usertype_enum_old" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "userType" TYPE "sportEaze"."Users_usertype_enum_old" USING "userType"::"text"::"sportEaze"."Users_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_usertype_enum_old" RENAME TO "Users_usertype_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_gender_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "gender" TYPE "sportEaze"."Users_gender_enum_old" USING "gender"::"text"::"sportEaze"."Users_gender_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_gender_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_gender_enum_old" RENAME TO "Users_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SharedPosts_visibility_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ALTER COLUMN "visibility" TYPE "sportEaze"."SharedPosts_visibility_enum_old" USING "visibility"::"text"::"sportEaze"."SharedPosts_visibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ALTER COLUMN "visibility" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SharedPosts_visibility_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SharedPosts_visibility_enum_old" RENAME TO "SharedPosts_visibility_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_visibility_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "visibility" TYPE "sportEaze"."Posts_visibility_enum_old" USING "visibility"::"text"::"sportEaze"."Posts_visibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "visibility" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_visibility_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_visibility_enum_old" RENAME TO "Posts_visibility_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostLikes_reacttype_enum_old" AS ENUM('0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ALTER COLUMN "reactType" TYPE "sportEaze"."PostLikes_reacttype_enum_old" USING "reactType"::"text"::"sportEaze"."PostLikes_reacttype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostLikes_reacttype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."PostLikes_reacttype_enum_old" RENAME TO "PostLikes_reacttype_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostMedia_mediatype_enum_old" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostMedia" ALTER COLUMN "mediaType" TYPE "sportEaze"."PostMedia_mediatype_enum_old" USING "mediaType"::"text"::"sportEaze"."PostMedia_mediatype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostMedia_mediatype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."PostMedia_mediatype_enum_old" RENAME TO "PostMedia_mediatype_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Contracts_status_enum_old" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ALTER COLUMN "status" TYPE "sportEaze"."Contracts_status_enum_old" USING "status"::"text"::"sportEaze"."Contracts_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Contracts_status_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Contracts_status_enum_old" RENAME TO "Contracts_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "availableForSponsorship"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "coachName"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "playingLevel"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_playinglevel_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "secondaySports"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_secondaysports_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "primarySport"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_primarysport_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "sportsInterest"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_sportsinterest_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "preferredSport" integer`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "about" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "country" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "city" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "FK_b74a5a515799f73b1e371e0c90e" FOREIGN KEY ("preferredSport") REFERENCES "sportEaze"."Sports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
