import { MigrationInterface, QueryRunner } from "typeorm";

export class ALTERPOSTMEDIAADDCOLPOSTID1732376336794
  implements MigrationInterface
{
  name = "ALTERPOSTMEDIAADDCOLPOSTID1732376336794";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" DROP CONSTRAINT "FK_af691d55a60ad460f5b79b1f506"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" RENAME COLUMN "postIdId" TO "postId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" ALTER COLUMN "postId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" ADD CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" DROP CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" ALTER COLUMN "postId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" RENAME COLUMN "postId" TO "postIdId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" ADD CONSTRAINT "FK_af691d55a60ad460f5b79b1f506" FOREIGN KEY ("postIdId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
