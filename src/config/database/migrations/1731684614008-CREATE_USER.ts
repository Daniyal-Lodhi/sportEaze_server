import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEUSER1731684614008 implements MigrationInterface {
    name = 'CREATEUSER1731684614008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport_Eaze"."Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "gender" character varying(10) NOT NULL, "dob" date NOT NULL, "city" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "profilePicUrl" character varying, "userType" character varying(50), "deleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sport_Eaze"."Users"`);
    }

}
