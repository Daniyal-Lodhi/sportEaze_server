import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATERATINGREVIES1732037996868 implements MigrationInterface {
  name = "CREATERATINGREVIES1732037996868";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."Rating and Reviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "review" character varying(100) NOT NULL, "playerId" uuid, CONSTRAINT "CHK_b8233431f0892e13ce49714f75" CHECK (rating >= 1 AND rating <= 5), CONSTRAINT "PK_9e0eafb38f0b0329324773f4e16" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Rating and Reviews" ADD CONSTRAINT "FK_8b31212c7a289d5cc7c0d10a0bd" FOREIGN KEY ("playerId") REFERENCES "sport_Eaze"."Player"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_Eaze"."Rating and Reviews" DROP CONSTRAINT "FK_8b31212c7a289d5cc7c0d10a0bd"`,
    );
    await queryRunner.query(`DROP TABLE "sport_Eaze"."Rating and Reviews"`);
  }
}
