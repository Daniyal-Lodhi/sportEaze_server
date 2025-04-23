import { MigrationInterface, QueryRunner } from "typeorm";

export class SponsorAddPosting11744819557060 implements MigrationInterface {
    name = 'SponsorAddPosting11744819557060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."Locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cityName" character varying(100) NOT NULL, CONSTRAINT "PK_52e5d0236e8f2bca8b2792b1e3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPostMedia_mediatype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SponsoredPostMedia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaType" "sportEaze"."SponsoredPostMedia_mediatype_enum" NOT NULL, "mediaLink" character varying NOT NULL, "mediaThumbnail" character varying, "mediaOrder" integer NOT NULL, "sponsoredPostId" uuid NOT NULL, CONSTRAINT "PK_fb172ce6568322429d2fe77a80b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SponsoredPostTargetSports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sponsoredPostId" uuid NOT NULL, "sport" "sportEaze"."SponsoredPostTargetSports_sport_enum" NOT NULL, CONSTRAINT "PK_898b0f8a7c49803e545d9cba201" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPosts_posttype_enum" AS ENUM('1')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SponsoredPosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postType" "sportEaze"."SponsoredPosts_posttype_enum" NOT NULL, "text" text NOT NULL, "ctaLink" text NOT NULL, "targetAudienceAge" character varying(20) NOT NULL, "targetReachableUsers" integer NOT NULL, "amountToSpend" integer NOT NULL, "currency" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af9b42ccc2530ec99ffca517942" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostMedia" ADD CONSTRAINT "FK_010b850d2806b75cae6711bf61c" FOREIGN KEY ("sponsoredPostId") REFERENCES "sportEaze"."SponsoredPosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostTargetSports" ADD CONSTRAINT "FK_4536086bf2a57cbc1a29ffe3c51" FOREIGN KEY ("sponsoredPostId") REFERENCES "sportEaze"."SponsoredPosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" ADD CONSTRAINT "FK_eb6b18699495add3e4202536cc9" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" DROP CONSTRAINT "FK_eb6b18699495add3e4202536cc9"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostTargetSports" DROP CONSTRAINT "FK_4536086bf2a57cbc1a29ffe3c51"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostMedia" DROP CONSTRAINT "FK_010b850d2806b75cae6711bf61c"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SponsoredPosts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SponsoredPostTargetSports"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SponsoredPostMedia"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPostMedia_mediatype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Locations"`);
    }

}
