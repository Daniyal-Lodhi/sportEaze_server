import { MigrationInterface, QueryRunner } from "typeorm";

export class SuperUser11745685577785 implements MigrationInterface {
    name = 'SuperUser11745685577785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_usertype_enum" RENAME TO "Users_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_usertype_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "userType" TYPE "sportEaze"."Users_usertype_enum" USING "userType"::"text"::"sportEaze"."Users_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_usertype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_usertype_enum_old" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Users" ALTER COLUMN "userType" TYPE "sportEaze"."Users_usertype_enum_old" USING "userType"::"text"::"sportEaze"."Users_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Users_usertype_enum_old" RENAME TO "Users_usertype_enum"`);
    }

}
