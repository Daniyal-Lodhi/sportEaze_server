import { MigrationInterface, QueryRunner } from "typeorm";

export class POSTLIKECHANGE1741293952854 implements MigrationInterface {
    name = 'POSTLIKECHANGE1741293952854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" DROP COLUMN "unLiked"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostLikes" ADD "unLiked" boolean NOT NULL DEFAULT false`);
    }

}
