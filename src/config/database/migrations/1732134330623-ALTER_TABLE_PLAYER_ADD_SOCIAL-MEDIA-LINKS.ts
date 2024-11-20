import { MigrationInterface, QueryRunner } from "typeorm";

export class ALTERTABLEPLAYERADDSOCIALMEDIALINKS1732134330623 implements MigrationInterface {
    name = 'ALTERTABLEPLAYERADDSOCIALMEDIALINKS1732134330623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "FB_LINK" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "INSTA_LINK" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "X_LINK" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "X_LINK"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "INSTA_LINK"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "FB_LINK"`);
    }

}
