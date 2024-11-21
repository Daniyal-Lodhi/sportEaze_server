import { MigrationInterface, QueryRunner } from "typeorm";

export class ALTERTABLEPLAYERRENAMESOCIALMEDIALINKS1732135011070 implements MigrationInterface {
    name = 'ALTERTABLEPLAYERRENAMESOCIALMEDIALINKS1732135011070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "FB_LINK"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "INSTA_LINK"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "X_LINK"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "FB_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "INSTA_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "X_link" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "X_link"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "INSTA_link"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "FB_link"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "X_LINK" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "INSTA_LINK" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "FB_LINK" character varying(255)`);
    }

}
