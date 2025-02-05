import { MigrationInterface, QueryRunner } from "typeorm";

export class TableNameConventionSet11738767366367 implements MigrationInterface {
    name = 'TableNameConventionSet11738767366367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."PostMedia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaType" "sport_Eaze"."PostMedia_mediatype_enum" NOT NULL, "mediaLink" character varying NOT NULL, "mediaThumbnail" character varying, "mediaOrder" integer NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_09a711528b07c186c8853981495" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."PostLikes_reacttype_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."PostLikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "unLiked" boolean NOT NULL DEFAULT false, "reactType" "sport_Eaze"."PostLikes_reacttype_enum" NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f28e59e14e5f90fbd763c541751" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."PostComments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2440dc3d7ccd7aff688fc008336" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Posts_visibility_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."Posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "textContent" text NOT NULL, "visibility" "sport_Eaze"."Posts_visibility_enum" NOT NULL DEFAULT '0', "shareCount" integer NOT NULL DEFAULT '0', "postType" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."RatingAndReviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "review" character varying(100) NOT NULL, "playerId" uuid, CONSTRAINT "CHK_bab4097154ade10265a9b79142" CHECK (rating >= 1 AND rating <= 5), CONSTRAINT "PK_021c02f375fc4cca0f046c17611" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."SharedPosts_visibility_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."SharedPosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shareMessage" character varying, "visibility" "sport_Eaze"."SharedPosts_visibility_enum" NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "originalPostId" uuid, CONSTRAINT "PK_5380853888c1d325c9281436832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" ADD CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" ADD CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" ADD CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostComments" ADD CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."RatingAndReviews" ADD CONSTRAINT "FK_5546938192060d9bced030537fe" FOREIGN KEY ("playerId") REFERENCES "sport_Eaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SharedPosts" ADD CONSTRAINT "FK_6bd0c3d39dedcef6ed351acca19" FOREIGN KEY ("originalPostId") REFERENCES "sport_Eaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SharedPosts" DROP CONSTRAINT "FK_6bd0c3d39dedcef6ed351acca19"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."RatingAndReviews" DROP CONSTRAINT "FK_5546938192060d9bced030537fe"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostComments" DROP CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" DROP CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" DROP CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" DROP CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c"`);
        await queryRunner.query(`DROP TABLE "sport_Eaze"."SharedPosts"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."SharedPosts_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "sport_Eaze"."RatingAndReviews"`);
        await queryRunner.query(`DROP TABLE "sport_Eaze"."Posts"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Posts_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "sport_Eaze"."PostComments"`);
        await queryRunner.query(`DROP TABLE "sport_Eaze"."PostLikes"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."PostLikes_reacttype_enum"`);
        await queryRunner.query(`DROP TABLE "sport_Eaze"."PostMedia"`);
    }

}
