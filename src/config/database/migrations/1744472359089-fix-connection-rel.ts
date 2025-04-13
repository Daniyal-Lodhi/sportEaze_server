import { MigrationInterface, QueryRunner } from "typeorm";

export class FixConnectionRel1744472359089 implements MigrationInterface {
    name = 'FixConnectionRel1744472359089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_afc8205a0693827a5c269e2116b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_02987a11281e42d09924ff1aa58"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "REL_afc8205a0693827a5c269e2116"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "REL_02987a11281e42d09924ff1aa5"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_afc8205a0693827a5c269e2116b" FOREIGN KEY ("senderId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_02987a11281e42d09924ff1aa58" FOREIGN KEY ("receiverId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_02987a11281e42d09924ff1aa58"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_afc8205a0693827a5c269e2116b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "REL_02987a11281e42d09924ff1aa5" UNIQUE ("receiverId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "REL_afc8205a0693827a5c269e2116" UNIQUE ("senderId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_02987a11281e42d09924ff1aa58" FOREIGN KEY ("receiverId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_afc8205a0693827a5c269e2116b" FOREIGN KEY ("senderId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
