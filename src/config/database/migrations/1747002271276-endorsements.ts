import { MigrationInterface, QueryRunner } from "typeorm";

export class Endorsements1747002271276 implements MigrationInterface {
    name = 'Endorsements1747002271276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."Endorsements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer, "review" character varying(100) NOT NULL, "playerId" uuid, "mentorId" uuid, CONSTRAINT "CHK_a3c5adfea8afc1aead21512835" CHECK (rating >= 1 AND rating <= 5), CONSTRAINT "PK_4ccc95f4ad44fec089566615100" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" ADD CONSTRAINT "FK_88ea7550d553b1ab8d77e3bb569" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" ADD CONSTRAINT "FK_2fa4c0c6a78b3d0bc28a49035a3" FOREIGN KEY ("mentorId") REFERENCES "sportEaze"."mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" DROP CONSTRAINT "FK_2fa4c0c6a78b3d0bc28a49035a3"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" DROP CONSTRAINT "FK_88ea7550d553b1ab8d77e3bb569"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Endorsements"`);
    }

}
