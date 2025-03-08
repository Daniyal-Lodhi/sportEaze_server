import { MigrationInterface, QueryRunner } from "typeorm";

export class POSTLIKECHANGE11741297033287 implements MigrationInterface {
    name = 'POSTLIKECHANGE11741297033287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" ALTER COLUMN "reactType" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" ALTER COLUMN "reactType" SET DEFAULT '0'`);
    }

}
