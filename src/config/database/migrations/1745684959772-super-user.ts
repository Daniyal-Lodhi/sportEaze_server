import { MigrationInterface, QueryRunner } from "typeorm";

export class SuperUser1745684959772 implements MigrationInterface {
    name = 'SuperUser1745684959772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" DROP COLUMN "isAdmin"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

}
