import { MigrationInterface, QueryRunner } from "typeorm";

export class UPDATEUSEREDITUSERTYPECONSTRAINT1731742292771 implements MigrationInterface {
    name = 'UPDATEUSEREDITUSERTYPECONSTRAINT1731742292771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Users_usertype_enum" RENAME TO "Users_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_usertype_enum" AS ENUM('Fan', 'Player', 'Patron', 'Mentor')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "userType" TYPE "sport_Eaze"."Users_usertype_enum" USING "userType"::"text"::"sport_Eaze"."Users_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_usertype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."Users_usertype_enum_old" AS ENUM('null', 'NULL', 'Fan', 'Player', 'Patron', 'Mentor')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Users" ALTER COLUMN "userType" TYPE "sport_Eaze"."Users_usertype_enum_old" USING "userType"::"text"::"sport_Eaze"."Users_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."Users_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "sport_Eaze"."Users_usertype_enum_old" RENAME TO "Users_usertype_enum"`);
    }

}
