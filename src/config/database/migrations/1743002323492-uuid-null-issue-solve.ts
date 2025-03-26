import { MigrationInterface, QueryRunner } from "typeorm";

export class UuidNullIssueSolve1743002323492 implements MigrationInterface {
    name = 'UuidNullIssueSolve1743002323492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
