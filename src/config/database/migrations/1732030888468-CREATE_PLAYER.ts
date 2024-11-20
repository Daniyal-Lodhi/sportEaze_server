import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEPLAYER1732030888468 implements MigrationInterface {
    name = 'CREATEPLAYER1732030888468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."Player" ("userId" uuid NOT NULL, "rank" integer NOT NULL, "region" character varying(25) NOT NULL, "club" character varying(25) NOT NULL, "about" character varying(200) NOT NULL, CONSTRAINT "CHK_3d1bff4e9d7d9be730feeda3c9" CHECK (rank >= 1 AND rank <= 100), CONSTRAINT "PK_9be207182e9cd0809fe0d8f7302" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302"`);
        await queryRunner.query(`DROP TABLE "sport_Eaze"."Player"`);
    }

}
