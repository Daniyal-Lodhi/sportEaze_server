import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractStatus1746899497971 implements MigrationInterface {
    name = 'ContractStatus1746899497971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Contracts_status_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "status" "sportEaze"."Contracts_status_enum" NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Contracts_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "status" integer NOT NULL DEFAULT '1'`);
    }

}
