import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEUSER1731685137419 implements MigrationInterface {
    name = 'CREATEUSER1731685137419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" DROP COLUMN "gender"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_gender_enum" AS ENUM('Male', 'Female', 'Other')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ADD "gender" "sport_Eaze"."Users_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" DROP COLUMN "userType"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_usertype_enum" AS ENUM('null', 'NULL', 'Fan', 'Player', 'Patron', 'Mentor')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ADD "userType" "sport_Eaze"."Users_usertype_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" DROP COLUMN "userType"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ADD "userType" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ADD "gender" character varying(10) NOT NULL`);
    }

}
