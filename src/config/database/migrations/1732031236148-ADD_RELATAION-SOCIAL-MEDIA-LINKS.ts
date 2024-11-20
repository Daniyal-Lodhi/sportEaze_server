import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDRELATAIONSOCIALMEDIALINKS1732031236148 implements MigrationInterface {
    name = 'ADDRELATAIONSOCIALMEDIALINKS1732031236148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" ADD CONSTRAINT "FK_ce5d6e1a4acea522b717aafb7c3" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Player"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP CONSTRAINT "FK_ce5d6e1a4acea522b717aafb7c3"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."SocialMediaLinks" DROP COLUMN "userId"`);
    }

}
