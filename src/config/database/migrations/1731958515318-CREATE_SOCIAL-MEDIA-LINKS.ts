import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATESOCIALMEDIALINKS1731958515318 implements MigrationInterface {
    name = 'CREATESOCIALMEDIALINKS1731958515318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."SocialMediaLinks_platform_enum" AS ENUM('Facebook', 'Instagram', 'X')`);
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."SocialMediaLinks" ("id" SERIAL NOT NULL, "platform" "sport_Eaze"."SocialMediaLinks_platform_enum" NOT NULL, "link" character varying(255) NOT NULL, CONSTRAINT "PK_7a93c426afa1dbda8d0a6128328" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sport_Eaze"."SocialMediaLinks"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."SocialMediaLinks_platform_enum"`);
    }

}
