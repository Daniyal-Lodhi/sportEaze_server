import { MigrationInterface, QueryRunner } from "typeorm";

export class PostContractRelFox1746903889167 implements MigrationInterface {
    name = 'PostContractRelFox1746903889167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_e97295d43146eedfbced74f9af8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_c8338fde48c5a41672ff831ec81"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "UQ_e97295d43146eedfbced74f9af8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "UQ_c8338fde48c5a41672ff831ec81"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_e97295d43146eedfbced74f9af8" FOREIGN KEY ("contractId") REFERENCES "sportEaze"."Contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_c8338fde48c5a41672ff831ec81" FOREIGN KEY ("milestoneId") REFERENCES "sportEaze"."Milestones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_c8338fde48c5a41672ff831ec81"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_e97295d43146eedfbced74f9af8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "UQ_c8338fde48c5a41672ff831ec81" UNIQUE ("milestoneId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "UQ_e97295d43146eedfbced74f9af8" UNIQUE ("contractId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_c8338fde48c5a41672ff831ec81" FOREIGN KEY ("milestoneId") REFERENCES "sportEaze"."Milestones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_e97295d43146eedfbced74f9af8" FOREIGN KEY ("contractId") REFERENCES "sportEaze"."Contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
