import { MigrationInterface, QueryRunner } from "typeorm";

export class ALTERPLAYERALLOWNULL1732054862761 implements MigrationInterface {
    name = 'ALTERPLAYERALLOWNULL1732054862761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "rank" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "region" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "club" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "about" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "about" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "club" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "region" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ALTER COLUMN "rank" SET NOT NULL`);
    }

}
