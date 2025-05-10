import { MigrationInterface, QueryRunner } from "typeorm";

export class Wallets1746808444978 implements MigrationInterface {
    name = 'Wallets1746808444978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."Wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" integer NOT NULL, "pending" integer NOT NULL, CONSTRAINT "PK_22643866c3dcd5442c341d43b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD "walletId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD CONSTRAINT "UQ_872e306463546723102599b8335" UNIQUE ("walletId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "walletId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "UQ_7bffb976c762d82d1eee71887f0" UNIQUE ("walletId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD CONSTRAINT "FK_872e306463546723102599b8335" FOREIGN KEY ("walletId") REFERENCES "sportEaze"."Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "FK_7bffb976c762d82d1eee71887f0" FOREIGN KEY ("walletId") REFERENCES "sportEaze"."Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "FK_7bffb976c762d82d1eee71887f0"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP CONSTRAINT "FK_872e306463546723102599b8335"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "UQ_7bffb976c762d82d1eee71887f0"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "walletId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP CONSTRAINT "UQ_872e306463546723102599b8335"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP COLUMN "walletId"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Wallets"`);

    }

}
