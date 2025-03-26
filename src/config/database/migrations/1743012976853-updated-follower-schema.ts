import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedFollowerSchema1743012976853 implements MigrationInterface {
    name = 'UpdatedFollowerSchema1743012976853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "REL_e23570f14dc2e46a348ac0618f"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "REL_cccee741c1cf2e3dfe04a00b1f"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "UQ_80d91d874a653fda1e5bdd1110f" UNIQUE ("playerId", "followerId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "sportEaze"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "UQ_80d91d874a653fda1e5bdd1110f"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "REL_cccee741c1cf2e3dfe04a00b1f" UNIQUE ("followerId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "REL_e23570f14dc2e46a348ac0618f" UNIQUE ("playerId")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
