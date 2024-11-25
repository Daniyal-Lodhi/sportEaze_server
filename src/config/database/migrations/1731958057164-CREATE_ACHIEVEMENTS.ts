import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEACHIEVEMENTS1731958057164 implements MigrationInterface {
  name = "CREATEACHIEVEMENTS1731958057164";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."Achievements" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "description" character varying(250), "dateAchieved" date NOT NULL, CONSTRAINT "PK_875a7fc75abffd6cbca8adccbd8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sport_Eaze"."Achievements"`);
  }
}
