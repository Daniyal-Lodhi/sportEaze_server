import { MigrationInterface, QueryRunner } from "typeorm";

export class WalletChanges1747077550474 implements MigrationInterface {
    name = 'WalletChanges1747077550474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "FK_7bffb976c762d82d1eee71887f0"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP CONSTRAINT "FK_872e306463546723102599b8335"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "UQ_7bffb976c762d82d1eee71887f0"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP COLUMN "walletId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP CONSTRAINT "UQ_872e306463546723102599b8335"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP COLUMN "walletId"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."notifications_type_enum" RENAME TO "notifications_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ALTER COLUMN "type" TYPE "sportEaze"."notifications_type_enum" USING "type"::"text"::"sportEaze"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum_old" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ALTER COLUMN "type" TYPE "sportEaze"."notifications_type_enum_old" USING "type"::"text"::"sportEaze"."notifications_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."notifications_type_enum_old" RENAME TO "notifications_type_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD "walletId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD CONSTRAINT "UQ_872e306463546723102599b8335" UNIQUE ("walletId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD "walletId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "UQ_7bffb976c762d82d1eee71887f0" UNIQUE ("walletId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD CONSTRAINT "FK_872e306463546723102599b8335" FOREIGN KEY ("walletId") REFERENCES "sportEaze"."Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "FK_7bffb976c762d82d1eee71887f0" FOREIGN KEY ("walletId") REFERENCES "sportEaze"."Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
