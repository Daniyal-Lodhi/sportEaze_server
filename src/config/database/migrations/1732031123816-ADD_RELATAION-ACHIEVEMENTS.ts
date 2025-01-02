import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDRELATAIONACHIEVEMENTS1732031123816
  implements MigrationInterface
{
  name = "ADDRELATAIONACHIEVEMENTS1732031123816";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Achievements" ADD "playerId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Achievements" ADD CONSTRAINT "FK_4294cffda1c4f72bb5872b3475e" FOREIGN KEY ("playerId") REFERENCES "sport_Eaze"."Player"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Achievements" DROP CONSTRAINT "FK_4294cffda1c4f72bb5872b3475e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Achievements" DROP COLUMN "playerId"`,
    );
  }
}
