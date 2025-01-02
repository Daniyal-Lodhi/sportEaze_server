import { MigrationInterface, QueryRunner } from "typeorm";

export class FIXEDUSERENTITIES1732476419139 implements MigrationInterface {
  name = "FIXEDUSERENTITIES1732476419139";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_30e6a2e07ef940670d493b759ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_eceec63aabe184730569db684e7"`,
    );
    await queryRunner.query(
      `CREATE TYPE "sport_Eaze"."post_likes_reacttype_enum" AS ENUM('Like', 'Heart', 'Laugh', 'Sad', 'Wow')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."post_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "unLiked" boolean NOT NULL DEFAULT false, "reactType" "sport_Eaze"."post_likes_reacttype_enum" NOT NULL DEFAULT 'Like', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4ac7cb9daf243939c6eabb2e0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "userIdId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "postIdId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD "postId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."post_likes" ADD CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."post_likes" ADD CONSTRAINT "FK_6999d13aca25e33515210abaf16" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."post_likes" DROP CONSTRAINT "FK_6999d13aca25e33515210abaf16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."post_likes" DROP CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "postId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD "postIdId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD "userIdId" uuid`,
    );
    await queryRunner.query(`DROP TABLE "sport_Eaze"."post_likes"`);
    await queryRunner.query(
      `DROP TYPE "sport_Eaze"."post_likes_reacttype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_eceec63aabe184730569db684e7" FOREIGN KEY ("userIdId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_30e6a2e07ef940670d493b759ed" FOREIGN KEY ("postIdId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
