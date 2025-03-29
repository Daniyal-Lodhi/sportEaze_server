import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedLikeType1743270921075 implements MigrationInterface {
    name = 'RemovedLikeType1743270921075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ALTER COLUMN "reactType" SET DEFAULT '2'`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."mentors_role_enum" RENAME TO "mentors_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_role_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ALTER COLUMN "role" TYPE "sportEaze"."mentors_role_enum" USING "role"::"text"::"sportEaze"."mentors_role_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_role_enum_old" AS ENUM('Coach', 'Fitness Trainer', 'Sports Psychologist')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ALTER COLUMN "role" TYPE "sportEaze"."mentors_role_enum_old" USING "role"::"text"::"sportEaze"."mentors_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_role_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."mentors_role_enum_old" RENAME TO "mentors_role_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ALTER COLUMN "reactType" DROP DEFAULT`);
    }

}
