import { MigrationInterface, QueryRunner } from "typeorm";

export class USERPOSTRELATEDTABLES71732300686718 implements MigrationInterface {
    name = 'USERPOSTRELATEDTABLES71732300686718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_4bb18650cf8c48e71f132381a29"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_93fa96c543c723d588d990218d7"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" DROP CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" RENAME COLUMN "postId" TO "postIdId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP COLUMN "PostId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD "userIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD "postIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD "userIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD "postIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_b9a5ae564d1538e1272ddb115a3" FOREIGN KEY ("userIdId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_2d994af52e4a2157d7cdfccfcb5" FOREIGN KEY ("postIdId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_eceec63aabe184730569db684e7" FOREIGN KEY ("userIdId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_30e6a2e07ef940670d493b759ed" FOREIGN KEY ("postIdId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" ADD CONSTRAINT "FK_af691d55a60ad460f5b79b1f506" FOREIGN KEY ("postIdId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" DROP CONSTRAINT "FK_af691d55a60ad460f5b79b1f506"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_30e6a2e07ef940670d493b759ed"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP CONSTRAINT "FK_eceec63aabe184730569db684e7"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_2d994af52e4a2157d7cdfccfcb5"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP CONSTRAINT "FK_b9a5ae564d1538e1272ddb115a3"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "postIdId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP COLUMN "postIdId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD "postId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD "PostId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" RENAME COLUMN "postIdId" TO "postId"`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."PostMedia" ADD CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_93fa96c543c723d588d990218d7" FOREIGN KEY ("userId") REFERENCES "sport_Eaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_Eaze"."Postlikes" ADD CONSTRAINT "FK_4bb18650cf8c48e71f132381a29" FOREIGN KEY ("PostId") REFERENCES "sport_Eaze"."posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
