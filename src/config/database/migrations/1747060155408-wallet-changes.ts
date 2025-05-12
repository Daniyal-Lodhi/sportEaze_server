import { MigrationInterface, QueryRunner } from "typeorm";

export class WalletChanges1747060155408 implements MigrationInterface {
    name = 'WalletChanges1747060155408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD "patronId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD CONSTRAINT "UQ_e25ad6cd7a2ffb94f17c3e7a8c3" UNIQUE ("patronId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD "playerId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD CONSTRAINT "UQ_1b819dbb677310c78fa807ece05" UNIQUE ("playerId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD CONSTRAINT "FK_e25ad6cd7a2ffb94f17c3e7a8c3" FOREIGN KEY ("patronId") REFERENCES "sportEaze"."Patron"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD CONSTRAINT "FK_1b819dbb677310c78fa807ece05" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP CONSTRAINT "FK_1b819dbb677310c78fa807ece05"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP CONSTRAINT "FK_e25ad6cd7a2ffb94f17c3e7a8c3"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP CONSTRAINT "UQ_1b819dbb677310c78fa807ece05"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP COLUMN "playerId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP CONSTRAINT "UQ_e25ad6cd7a2ffb94f17c3e7a8c3"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP COLUMN "patronId"`);
    }

}
