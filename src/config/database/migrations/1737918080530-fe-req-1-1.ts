import { MigrationInterface, QueryRunner } from "typeorm";

export class FeReq111737918080530 implements MigrationInterface {
    name = 'FeReq111737918080530';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the new column with a default value for existing rows
        await queryRunner.query(`
            ALTER TABLE "sport_Eaze"."posts" ADD "postType" integer NOT NULL DEFAULT 0
        `);

        // Remove the default value (optional, for future inserts)
        await queryRunner.query(`
            ALTER TABLE "sport_Eaze"."posts" ALTER COLUMN "postType" DROP DEFAULT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the column in the down migration
        await queryRunner.query(`
            ALTER TABLE "sport_Eaze"."posts" DROP COLUMN "postType"
        `);
    }
}
