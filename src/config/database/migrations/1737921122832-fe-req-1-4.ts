import { MigrationInterface, QueryRunner } from "typeorm";

export class FeReq141737921122832 implements MigrationInterface {
    name = 'FeReq141737921122832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Contracts_status_enum" RENAME TO "Contracts_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Contracts_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Contracts" ALTER COLUMN "status" TYPE "sport_Eaze"."Contracts_status_enum" USING "status"::"text"::"sport_Eaze"."Contracts_status_enum"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Contracts_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."PostMedia_mediatype_enum" RENAME TO "PostMedia_mediatype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."PostMedia_mediatype_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" ALTER COLUMN "mediaType" TYPE "sport_Eaze"."PostMedia_mediatype_enum" USING "mediaType"::"text"::"sport_Eaze"."PostMedia_mediatype_enum"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."PostMedia_mediatype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."post_likes_reacttype_enum" RENAME TO "post_likes_reacttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."post_likes_reacttype_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."post_likes" ALTER COLUMN "reactType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."post_likes" ALTER COLUMN "reactType" TYPE "sport_Eaze"."post_likes_reacttype_enum" USING "reactType"::"text"::"sport_Eaze"."post_likes_reacttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."post_likes" ALTER COLUMN "reactType" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."post_likes_reacttype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."posts_visibility_enum" RENAME TO "posts_visibility_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."posts_visibility_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."posts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."posts" ALTER COLUMN "visibility" TYPE "sport_Eaze"."posts_visibility_enum" USING "visibility"::"text"::"sport_Eaze"."posts_visibility_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."posts" ALTER COLUMN "visibility" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."posts_visibility_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Users_gender_enum" RENAME TO "Users_gender_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_gender_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "gender" TYPE "sport_Eaze"."Users_gender_enum" USING "gender"::"text"::"sport_Eaze"."Users_gender_enum"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_gender_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Users_usertype_enum" RENAME TO "Users_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_usertype_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "userType" TYPE "sport_Eaze"."Users_usertype_enum" USING "userType"::"text"::"sport_Eaze"."Users_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_usertype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."shared_posts_visibility_enum" RENAME TO "shared_posts_visibility_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."shared_posts_visibility_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."shared_posts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."shared_posts" ALTER COLUMN "visibility" TYPE "sport_Eaze"."shared_posts_visibility_enum" USING "visibility"::"text"::"sport_Eaze"."shared_posts_visibility_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."shared_posts" ALTER COLUMN "visibility" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."shared_posts_visibility_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."shared_posts_visibility_enum_old" AS ENUM('Public', 'Private', 'FollowersOnly')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."shared_posts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."shared_posts" ALTER COLUMN "visibility" TYPE "sport_Eaze"."shared_posts_visibility_enum_old" USING "visibility"::"text"::"sport_Eaze"."shared_posts_visibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."shared_posts" ALTER COLUMN "visibility" SET DEFAULT 'Public'`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."shared_posts_visibility_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."shared_posts_visibility_enum_old" RENAME TO "shared_posts_visibility_enum"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_usertype_enum_old" AS ENUM('Fan', 'Player', 'Patron', 'Mentor')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "userType" TYPE "sport_Eaze"."Users_usertype_enum_old" USING "userType"::"text"::"sport_Eaze"."Users_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Users_usertype_enum_old" RENAME TO "Users_usertype_enum"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_gender_enum_old" AS ENUM('Male', 'Female', 'Other')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "gender" TYPE "sport_Eaze"."Users_gender_enum_old" USING "gender"::"text"::"sport_Eaze"."Users_gender_enum_old"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_gender_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Users_gender_enum_old" RENAME TO "Users_gender_enum"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."posts_visibility_enum_old" AS ENUM('Public', 'Private', 'FollowersOnly')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."posts" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."posts" ALTER COLUMN "visibility" TYPE "sport_Eaze"."posts_visibility_enum_old" USING "visibility"::"text"::"sport_Eaze"."posts_visibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."posts" ALTER COLUMN "visibility" SET DEFAULT 'Public'`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."posts_visibility_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."posts_visibility_enum_old" RENAME TO "posts_visibility_enum"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."post_likes_reacttype_enum_old" AS ENUM('Like', 'Heart', 'Laugh', 'Sad', 'Wow')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."post_likes" ALTER COLUMN "reactType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."post_likes" ALTER COLUMN "reactType" TYPE "sport_Eaze"."post_likes_reacttype_enum_old" USING "reactType"::"text"::"sport_Eaze"."post_likes_reacttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."post_likes" ALTER COLUMN "reactType" SET DEFAULT 'Like'`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."post_likes_reacttype_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."post_likes_reacttype_enum_old" RENAME TO "post_likes_reacttype_enum"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."PostMedia_mediatype_enum_old" AS ENUM('Image', 'Video')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" ALTER COLUMN "mediaType" TYPE "sport_Eaze"."PostMedia_mediatype_enum_old" USING "mediaType"::"text"::"sport_Eaze"."PostMedia_mediatype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."PostMedia_mediatype_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."PostMedia_mediatype_enum_old" RENAME TO "PostMedia_mediatype_enum"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Contracts_status_enum_old" AS ENUM('Initiated', 'Accepted', 'Ongoing', 'Completed')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Contracts" ALTER COLUMN "status" TYPE "sport_Eaze"."Contracts_status_enum_old" USING "status"::"text"::"sport_Eaze"."Contracts_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Contracts_status_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Contracts_status_enum_old" RENAME TO "Contracts_status_enum"`);
    }

}
