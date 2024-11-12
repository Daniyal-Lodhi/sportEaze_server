import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATETESTUSER1731445119825 implements MigrationInterface {
    name = 'CREATETESTUSER1731445119825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."test_user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "age" integer NOT NULL, CONSTRAINT "PK_1e8066454616813bc033c295f9f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sport_Eaze"."test_user_entity"`);
    }

}
