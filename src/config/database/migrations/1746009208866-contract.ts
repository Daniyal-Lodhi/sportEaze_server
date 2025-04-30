import { MigrationInterface, QueryRunner } from "typeorm";

export class Contract1746009208866 implements MigrationInterface {
    name = 'Contract1746009208866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."Milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "amount" numeric NOT NULL, "contractId" uuid, CONSTRAINT "PK_3035946cbed11e88315905ccebb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "PK_bd14b3cbeee6156105ac8b4eab7"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "contractId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Contracts_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "terms"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "PK_4f88addbb8b532d6e46459c8755" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "description" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "totalAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "patronId" uuid`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "playerId" uuid`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_posttype_enum" RENAME TO "Posts_posttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" TYPE "sportEaze"."Posts_posttype_enum" USING "postType"::"text"::"sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" ALTER COLUMN "sentAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SponsoredPosts_posttype_enum" RENAME TO "SponsoredPosts_posttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPosts_posttype_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" ALTER COLUMN "postType" TYPE "sportEaze"."SponsoredPosts_posttype_enum" USING "postType"::"text"::"sportEaze"."SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPosts_posttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" ADD CONSTRAINT "FK_851e8f28d8b9a58015df0cc76a6" FOREIGN KEY ("contractId") REFERENCES "sportEaze"."Contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "FK_c26e56a62413f1fb283d5b5920a" FOREIGN KEY ("patronId") REFERENCES "sportEaze"."Patron"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "FK_05655610e77f99bc8814af2b72c" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "FK_05655610e77f99bc8814af2b72c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "FK_c26e56a62413f1fb283d5b5920a"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" DROP CONSTRAINT "FK_851e8f28d8b9a58015df0cc76a6"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPosts_posttype_enum_old" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" ALTER COLUMN "postType" TYPE "sportEaze"."SponsoredPosts_posttype_enum_old" USING "postType"::"text"::"sportEaze"."SponsoredPosts_posttype_enum_old"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."SponsoredPosts_posttype_enum_old" RENAME TO "SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" ALTER COLUMN "sentAt" SET DEFAULT now()`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum_old" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" TYPE "sportEaze"."Posts_posttype_enum_old" USING "postType"::"text"::"sportEaze"."Posts_posttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_posttype_enum_old" RENAME TO "Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "playerId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "patronId"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "PK_4f88addbb8b532d6e46459c8755"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "terms" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Contracts_status_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "status" "sportEaze"."Contracts_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "end" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "start" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD "contractId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "PK_bd14b3cbeee6156105ac8b4eab7" PRIMARY KEY ("contractId")`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Milestones"`);
    }

}
