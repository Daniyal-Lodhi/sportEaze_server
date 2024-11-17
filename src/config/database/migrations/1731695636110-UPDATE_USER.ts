import { MigrationInterface, QueryRunner } from "typeorm";

export class UPDATEUSER1731695636110 implements MigrationInterface {
    name = 'UPDATEUSER1731695636110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "gender" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "dob" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "deleted" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "deleted" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "dob" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "gender" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "name" SET NOT NULL`);
    }

}
