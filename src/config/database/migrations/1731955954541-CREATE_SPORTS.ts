import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATESPORTS1731955954541 implements MigrationInterface {
  name = "CREATESPORTS1731955954541";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."Sports" ("id" SERIAL NOT NULL, "name" character varying(25) NOT NULL, CONSTRAINT "UQ_943769ff5b2ecd52ae3dab49aab" UNIQUE ("name"), CONSTRAINT "PK_b21fe37bae098517da43542fec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_Eaze"."test_user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "age" integer NOT NULL, CONSTRAINT "PK_1e8066454616813bc033c295f9f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sport_Eaze"."test_user_entity"`);
    await queryRunner.query(`DROP TABLE "sport_Eaze"."Sports"`);
  }
}
