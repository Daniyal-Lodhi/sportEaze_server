import { MigrationInterface, QueryRunner } from "typeorm";

export class UnreadMsgs1745139498700 implements MigrationInterface {
    name = 'UnreadMsgs1745139498700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" ADD "isRead" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" DROP COLUMN "isRead"`);
    }

}
