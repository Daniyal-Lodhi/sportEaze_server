import { MigrationInterface, QueryRunner } from "typeorm";

export class USERPOSTRELATEDTABLES21732295246927 implements MigrationInterface {
  name = "USERPOSTRELATEDTABLES21732295246927";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_3dcdc000fa3de61bee4538e546a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" ADD "PostId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_4bb18650cf8c48e71f132381a29" FOREIGN KEY ("PostId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_4bb18650cf8c48e71f132381a29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" DROP COLUMN "PostId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_3dcdc000fa3de61bee4538e546a" FOREIGN KEY ("id") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
