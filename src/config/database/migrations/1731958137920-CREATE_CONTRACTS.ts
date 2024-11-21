import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATECONTRACTS1731958137920 implements MigrationInterface {
    name = 'CREATECONTRACTS1731958137920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Contracts_status_enum" AS ENUM('Initiated', 'Accepted', 'Ongoing', 'Completed')`);
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."Contracts" ("contractId" SERIAL NOT NULL, "terms" character varying(100) NOT NULL, "start" date NOT NULL, "end" date NOT NULL, "status" "sport_Eaze"."Contracts_status_enum" NOT NULL, "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_bd14b3cbeee6156105ac8b4eab7" PRIMARY KEY ("contractId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sport_Eaze"."Contracts"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Contracts_status_enum"`);
    }

}
