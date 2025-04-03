import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedLikeType1743270921075 implements MigrationInterface {
    name = 'RemovedLikeType1743270921075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ALTER COLUMN "reactType" SET DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ALTER COLUMN "reactType" DROP DEFAULT`);
    }

}
