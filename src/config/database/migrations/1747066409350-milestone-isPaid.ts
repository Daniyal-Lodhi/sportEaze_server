import { MigrationInterface, QueryRunner } from "typeorm";

export class MilestoneIsPaid1747066409350 implements MigrationInterface {
    name = 'MilestoneIsPaid1747066409350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" ADD "isPaid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" DROP COLUMN "isPaid"`);
    }

}
