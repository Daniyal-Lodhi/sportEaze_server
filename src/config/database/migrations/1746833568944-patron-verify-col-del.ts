import { MigrationInterface, QueryRunner } from "typeorm";

export class PatronVerifyColDel1746833568944 implements MigrationInterface {
    name = 'PatronVerifyColDel1746833568944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP COLUMN "reviewedByAdminId"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."notifications_type_enum" RENAME TO "notifications_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ALTER COLUMN "type" TYPE "sportEaze"."notifications_type_enum" USING "type"::"text"::"sportEaze"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum_old" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ALTER COLUMN "type" TYPE "sportEaze"."notifications_type_enum_old" USING "type"::"text"::"sportEaze"."notifications_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."notifications_type_enum_old" RENAME TO "notifications_type_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD "reviewedByAdminId" uuid`);
    }
}
