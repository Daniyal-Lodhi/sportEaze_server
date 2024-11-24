import { MigrationInterface, QueryRunner } from "typeorm";

export class USERPOSTRELATEDTABLES31732298437685 implements MigrationInterface {
    name = 'USERPOSTRELATEDTABLES31732298437685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD "postId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
