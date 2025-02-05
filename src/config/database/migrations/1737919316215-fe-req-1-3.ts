import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaThumbnailToPostMedia1677919098321 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the column as nullable
        await queryRunner.query(
            `ALTER TABLE "sport_Eaze"."PostMedia" ADD "mediaThumbnail" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the column
        await queryRunner.query(
            `ALTER TABLE "sport_Eaze"."PostMedia" DROP COLUMN "mediaThumbnail"`
        );
    }
}
