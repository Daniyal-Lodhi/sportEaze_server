import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseStructure1741459153019 implements MigrationInterface {
    name = 'BaseStructure1741459153019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."Achievements" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "description" character varying(250), "dateAchieved" date NOT NULL, "playerId" uuid, CONSTRAINT "PK_875a7fc75abffd6cbca8adccbd8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Contracts_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Contracts" ("contractId" SERIAL NOT NULL, "terms" character varying(100) NOT NULL, "start" date NOT NULL, "end" date NOT NULL, "status" "sportEaze"."Contracts_status_enum" NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "playerId" uuid, CONSTRAINT "PK_bd14b3cbeee6156105ac8b4eab7" PRIMARY KEY ("contractId"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Sports" ("id" SERIAL NOT NULL, "name" character varying(25) NOT NULL, CONSTRAINT "UQ_943769ff5b2ecd52ae3dab49aab" UNIQUE ("name"), CONSTRAINT "PK_b21fe37bae098517da43542fec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostMedia_mediatype_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."PostMedia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaType" "sportEaze"."PostMedia_mediatype_enum" NOT NULL, "mediaLink" character varying NOT NULL, "mediaThumbnail" character varying, "mediaOrder" integer NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_09a711528b07c186c8853981495" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostLikes_reacttype_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."PostLikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "reactType" "sportEaze"."PostLikes_reacttype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f28e59e14e5f90fbd763c541751" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."PostComments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2440dc3d7ccd7aff688fc008336" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_visibility_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "textContent" text NOT NULL, "visibility" "sportEaze"."Posts_visibility_enum" NOT NULL DEFAULT '0', "shareCount" integer NOT NULL DEFAULT '0', "postType" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_gender_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_usertype_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100), "username" character varying(100), "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "gender" "sportEaze"."Users_gender_enum", "dob" date, "city" character varying(100), "country" character varying(100), "profilePicUrl" character varying, "userType" "sportEaze"."Users_usertype_enum", "deleted" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Player" ("id" uuid NOT NULL, "rank" integer, "region" character varying(25), "club" character varying(25), "FB_link" character varying(255), "INSTA_link" character varying(255), "X_link" character varying(255), "about" character varying(200), "preferredSport" integer, CONSTRAINT "CHK_3d1bff4e9d7d9be730feeda3c9" CHECK (rank >= 1 AND rank <= 100), CONSTRAINT "PK_c390d9968607986a5f038e3305e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."RatingAndReviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "review" character varying(100) NOT NULL, "playerId" uuid, CONSTRAINT "CHK_bab4097154ade10265a9b79142" CHECK (rating >= 1 AND rating <= 5), CONSTRAINT "PK_021c02f375fc4cca0f046c17611" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SharedPosts_visibility_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SharedPosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shareMessage" character varying, "visibility" "sportEaze"."SharedPosts_visibility_enum" NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "originalPostId" uuid, CONSTRAINT "PK_5380853888c1d325c9281436832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Achievements" ADD CONSTRAINT "FK_4294cffda1c4f72bb5872b3475e" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "FK_05655610e77f99bc8814af2b72c" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostMedia" ADD CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ADD CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ADD CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "FK_c390d9968607986a5f038e3305e" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "FK_b74a5a515799f73b1e371e0c90e" FOREIGN KEY ("preferredSport") REFERENCES "sportEaze"."Sports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."RatingAndReviews" ADD CONSTRAINT "FK_5546938192060d9bced030537fe" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ADD CONSTRAINT "FK_6bd0c3d39dedcef6ed351acca19" FOREIGN KEY ("originalPostId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" DROP CONSTRAINT "FK_6bd0c3d39dedcef6ed351acca19"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."RatingAndReviews" DROP CONSTRAINT "FK_5546938192060d9bced030537fe"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "FK_b74a5a515799f73b1e371e0c90e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "FK_c390d9968607986a5f038e3305e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" DROP CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" DROP CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostMedia" DROP CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "FK_05655610e77f99bc8814af2b72c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Achievements" DROP CONSTRAINT "FK_4294cffda1c4f72bb5872b3475e"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SharedPosts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SharedPosts_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."RatingAndReviews"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Player"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Users"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Posts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."PostComments"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."PostLikes"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostLikes_reacttype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."PostMedia"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostMedia_mediatype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Sports"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Contracts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Contracts_status_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Achievements"`);
    }

}
