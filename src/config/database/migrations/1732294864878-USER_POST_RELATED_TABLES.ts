import { MigrationInterface, QueryRunner } from "typeorm";

export class USERPOSTRELATEDTABLES1732294864878 implements MigrationInterface {
  name = "USERPOSTRELATEDTABLES1732294864878";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "sport_Eaze"."Postlikes_reacttype_enum" AS ENUM('Like', 'Heart', 'Laugh', 'Sad', 'Wow')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."Postlikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unLiked" boolean NOT NULL DEFAULT false, "reactType" "sport_Eaze"."Postlikes_reacttype_enum" NOT NULL DEFAULT 'Like', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_3dcdc000fa3de61bee4538e546a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "sport_Eaze"."PostMedia_mediatype_enum" AS ENUM('Image', 'Video')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."PostMedia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaType" "sport_Eaze"."PostMedia_mediatype_enum" NOT NULL, "mediaOrder" integer NOT NULL, "postId" uuid, CONSTRAINT "PK_09a711528b07c186c8853981495" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "sport_Eaze"."posts_visibility_enum" AS ENUM('Public', 'Private', 'FollowersOnly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "textContent" text NOT NULL, "visibility" "sport_Eaze"."posts_visibility_enum" NOT NULL DEFAULT 'Public', "shareCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "sport_Eaze"."shared_posts_visibility_enum" AS ENUM('Public', 'Private', 'FollowersOnly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."shared_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shareMessage" character varying, "visibility" "sport_Eaze"."shared_posts_visibility_enum" NOT NULL DEFAULT 'Public', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "originalPostId" uuid, CONSTRAINT "PK_7b0439dd296d4574c393f6d5fdb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_93fa96c543c723d588d990218d7" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_3dcdc000fa3de61bee4538e546a" FOREIGN KEY ("id") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" ADD CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" ADD CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e" FOREIGN KEY ("id") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."shared_posts" ADD CONSTRAINT "FK_5dfa2e0e663fb75b9c3ad824e20" FOREIGN KEY ("originalPostId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."shared_posts" DROP CONSTRAINT "FK_5dfa2e0e663fb75b9c3ad824e20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" DROP CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" DROP CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_3dcdc000fa3de61bee4538e546a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_93fa96c543c723d588d990218d7"`,
    );
    await queryRunner.query(`DROP TABLE "sport_Eaze"."shared_posts"`);
    await queryRunner.query(
      `DROP TYPE "sport_Eaze"."shared_posts_visibility_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sport_Eaze"."posts"`);
    await queryRunner.query(`DROP TYPE "sport_Eaze"."posts_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "sport_Eaze"."PostMedia"`);
    await queryRunner.query(
      `DROP TYPE "sport_Eaze"."PostMedia_mediatype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sport_Eaze"."comments"`);
    await queryRunner.query(`DROP TABLE "sport_Eaze"."Postlikes"`);
    await queryRunner.query(
      `DROP TYPE "sport_Eaze"."Postlikes_reacttype_enum"`,
    );
  }
}
