import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentsRepliesAddition1741504956237 implements MigrationInterface {
    name = 'CommentsRepliesAddition1741504956237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD "parentCommentId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_b02e05c9e50df1545bddaf89118" FOREIGN KEY ("parentCommentId") REFERENCES "sportEaze"."PostComments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_b02e05c9e50df1545bddaf89118"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP COLUMN "parentCommentId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
