import { MigrationInterface, QueryRunner } from "typeorm";

export class SharedPosts1741526672655 implements MigrationInterface {
    name = 'SharedPosts1741526672655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ADD CONSTRAINT "FK_f69432f9c6c0052237d601c7db4" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" DROP CONSTRAINT "FK_f69432f9c6c0052237d601c7db4"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" DROP COLUMN "userId"`);
    }

}
