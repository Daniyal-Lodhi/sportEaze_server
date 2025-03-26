import { MigrationInterface, QueryRunner } from "typeorm";

export class Network11742684683460 implements MigrationInterface {
    name = 'Network11742684683460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."Followers" ("id" uuid NOT NULL, "playerId" uuid NOT NULL, "followerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_e23570f14dc2e46a348ac0618f" UNIQUE ("playerId"), CONSTRAINT "REL_cccee741c1cf2e3dfe04a00b1f" UNIQUE ("followerId"), CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Connections" ("id" uuid NOT NULL, "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "status" "sportEaze"."Connections_status_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_afc8205a0693827a5c269e2116" UNIQUE ("senderId"), CONSTRAINT "REL_02987a11281e42d09924ff1aa5" UNIQUE ("receiverId"), CONSTRAINT "PK_0ee1f6fd09d463a63ca7cded8b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_afc8205a0693827a5c269e2116b" FOREIGN KEY ("senderId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_02987a11281e42d09924ff1aa58" FOREIGN KEY ("receiverId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_02987a11281e42d09924ff1aa58"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_afc8205a0693827a5c269e2116b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Connections"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Followers"`);
    }

}
