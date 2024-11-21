import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDPLAYERPREFERREDSPORTCOL1732031015376 implements MigrationInterface {
    name = 'ADDPLAYERPREFERREDSPORTCOL1732031015376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD "preferredSport" integer`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD CONSTRAINT "FK_b74a5a515799f73b1e371e0c90e" FOREIGN KEY ("preferredSport") REFERENCES "sport_Eaze"."Sports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP CONSTRAINT "FK_b74a5a515799f73b1e371e0c90e"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP COLUMN "preferredSport"`);
    }

}
