import { MigrationInterface, QueryRunner } from "typeorm";

export class MilestonIsAchieved1746895935266 implements MigrationInterface {
    name = 'MilestonIsAchieved1746895935266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" ADD "isAchieved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_posttype_enum" RENAME TO "Posts_posttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" TYPE "sportEaze"."Posts_posttype_enum" USING "postType"::"text"::"sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SponsoredPosts_posttype_enum" RENAME TO "SponsoredPosts_posttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPosts_posttype_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" ALTER COLUMN "postType" TYPE "sportEaze"."SponsoredPosts_posttype_enum" USING "postType"::"text"::"sportEaze"."SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPosts_posttype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPosts_posttype_enum_old" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" ALTER COLUMN "postType" TYPE "sportEaze"."SponsoredPosts_posttype_enum_old" USING "postType"::"text"::"sportEaze"."SponsoredPosts_posttype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SponsoredPosts_posttype_enum_old" RENAME TO "SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum_old" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" TYPE "sportEaze"."Posts_posttype_enum_old" USING "postType"::"text"::"sportEaze"."Posts_posttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_posttype_enum_old" RENAME TO "Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" DROP COLUMN "isAchieved"`);
    }

}
