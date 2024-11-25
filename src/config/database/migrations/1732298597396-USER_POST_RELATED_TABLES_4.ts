import { MigrationInterface, QueryRunner } from "typeorm";

export class USERPOSTRELATEDTABLES41732298597396 implements MigrationInterface {
  name = "USERPOSTRELATEDTABLES41732298597396";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" ADD "mediaLink" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."PostMedia" DROP COLUMN "mediaLink"`,
    );
  }
}
