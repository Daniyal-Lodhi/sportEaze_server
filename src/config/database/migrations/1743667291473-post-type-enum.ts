import { MigrationInterface, QueryRunner } from "typeorm";

export class PostTypeEnum1743667291473 implements MigrationInterface {
    name = 'PostTypeEnum1743667291473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP COLUMN "postType"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD "postType" "sportEaze"."Posts_posttype_enum" NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP COLUMN "postType"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD "postType" integer NOT NULL`);
    }

}
