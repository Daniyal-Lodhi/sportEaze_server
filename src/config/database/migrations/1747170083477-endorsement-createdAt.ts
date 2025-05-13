import { MigrationInterface, QueryRunner } from "typeorm";

export class EndorsementCreatedAt1747170083477 implements MigrationInterface {
    name = 'EndorsementCreatedAt1747170083477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" ADD "createdAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" DROP COLUMN "createdAt"`);
    }

}
