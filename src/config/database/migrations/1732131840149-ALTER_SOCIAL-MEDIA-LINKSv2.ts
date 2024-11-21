import { MigrationInterface, QueryRunner } from "typeorm";

export class ALTERSOCIALMEDIALINKSv21732131840149 implements MigrationInterface {
    name = 'ALTERSOCIALMEDIALINKSv21732131840149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP COLUMN "platform"`);
        await queryRunner.query(`DROP TYPE "sport_Eaze"."SocialMediaLinks_platform_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD "FB_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD "INSTA_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD "X_link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP CONSTRAINT "FK_ce5d6e1a4acea522b717aafb7c3"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD CONSTRAINT "UQ_ce5d6e1a4acea522b717aafb7c3" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD CONSTRAINT "FK_ce5d6e1a4acea522b717aafb7c3" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP CONSTRAINT "FK_ce5d6e1a4acea522b717aafb7c3"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP CONSTRAINT "UQ_ce5d6e1a4acea522b717aafb7c3"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD CONSTRAINT "FK_ce5d6e1a4acea522b717aafb7c3" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP COLUMN "X_link"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP COLUMN "INSTA_link"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP COLUMN "FB_link"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD "link" character varying(255) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "sport_Eaze"."SocialMediaLinks_platform_enum" AS ENUM('Facebook', 'Instagram', 'X')`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD "platform" "sport_Eaze"."SocialMediaLinks_platform_enum" NOT NULL`);
    }

}
