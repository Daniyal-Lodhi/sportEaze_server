import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDRELATAIONCONTRACTS1732033266563 implements MigrationInterface {
    name = 'ADDRELATAIONCONTRACTS1732033266563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Contracts" ADD "playerId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Contracts" ADD CONSTRAINT "FK_05655610e77f99bc8814af2b72c" FOREIGN KEY ("playerId") REFERENCES "sport_Eaze"."Player"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Contracts" DROP CONSTRAINT "FK_05655610e77f99bc8814af2b72c"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Contracts" DROP COLUMN "playerId"`);
    }

}
