import { MigrationInterface, QueryRunner } from "typeorm";

export class ALTERTABLEPLAYERUSERIDTOID1732105650807 implements MigrationInterface {
    name = 'ALTERTABLEPLAYERUSERIDTOID1732105650807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" RENAME COLUMN "userId" TO "id"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" RENAME CONSTRAINT "PK_9be207182e9cd0809fe0d8f7302" TO "PK_c390d9968607986a5f038e3305e"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD CONSTRAINT "FK_c390d9968607986a5f038e3305e" FOREIGN KEY ("id") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" DROP CONSTRAINT "FK_c390d9968607986a5f038e3305e"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" RENAME CONSTRAINT "PK_c390d9968607986a5f038e3305e" TO "PK_9be207182e9cd0809fe0d8f7302"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" RENAME COLUMN "id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Player" ADD CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
