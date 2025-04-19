import { MigrationInterface, QueryRunner } from "typeorm";

export class Chat1744676808940 implements MigrationInterface {
    name = 'Chat1744676808940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."Chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user1Id" uuid, "user2Id" uuid, CONSTRAINT "PK_64c36c2b8d86a0d5de4cf64de8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "sentAt" TIMESTAMP NOT NULL DEFAULT now(), "chatId" uuid, "senderId" uuid, CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_posttype_enum" RENAME TO "Posts_posttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" TYPE "sportEaze"."Posts_posttype_enum" USING "postType"::"text"::"sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" ADD CONSTRAINT "FK_29ebdd46ca7a26482aae61bd8a1" FOREIGN KEY ("user1Id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" ADD CONSTRAINT "FK_64db13a97e3338d4c00f6c6913e" FOREIGN KEY ("user2Id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" ADD CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e" FOREIGN KEY ("chatId") REFERENCES "sportEaze"."Chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" ADD CONSTRAINT "FK_b4f327890b06f4fd32a2697103c" FOREIGN KEY ("senderId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" DROP CONSTRAINT "FK_b4f327890b06f4fd32a2697103c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" DROP CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" DROP CONSTRAINT "FK_64db13a97e3338d4c00f6c6913e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" DROP CONSTRAINT "FK_29ebdd46ca7a26482aae61bd8a1"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum_old" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" TYPE "sportEaze"."Posts_posttype_enum_old" USING "postType"::"text"::"sportEaze"."Posts_posttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ALTER COLUMN "postType" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`ALTER TYPE "sportEaze"."Posts_posttype_enum_old" RENAME TO "Posts_posttype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Messages"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Chats"`);
    }

}
