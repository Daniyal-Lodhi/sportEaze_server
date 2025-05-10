import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationCreatedAt1746609973948 implements MigrationInterface {
    name = 'NotificationCreatedAt1746609973948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."notifications_type_enum" RENAME TO "notifications_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ALTER COLUMN "type" TYPE "sportEaze"."notifications_type_enum" USING "type"::"text"::"sportEaze"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum_old" AS ENUM('0')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ALTER COLUMN "type" TYPE "sportEaze"."notifications_type_enum_old" USING "type"::"text"::"sportEaze"."notifications_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."notifications_type_enum_old" RENAME TO "notifications_type_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" DROP COLUMN "createdAt"`);
    }

}
