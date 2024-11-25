import { MigrationInterface, QueryRunner } from "typeorm";

export class USERPOSTRELATEDTABLES51732298796810 implements MigrationInterface {
  name = "USERPOSTRELATEDTABLES51732298796810";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" DROP CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" ADD "userId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."posts" ADD CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e" FOREIGN KEY ("id") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
