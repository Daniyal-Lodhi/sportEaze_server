import { MigrationInterface, QueryRunner } from "typeorm";

export class Notificatoins1746371578842 implements MigrationInterface {
    name = 'Notificatoins1746371578842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum" AS ENUM('0')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "sportEaze"."notifications_type_enum" NOT NULL, "redirect" uuid NOT NULL, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "actorUserId" uuid, "recipientUserId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ADD CONSTRAINT "FK_016a812ce05a5f196c44d7faedc" FOREIGN KEY ("actorUserId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ADD CONSTRAINT "FK_0be815cabd15a62a5546a4b1357" FOREIGN KEY ("recipientUserId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" DROP CONSTRAINT "FK_0be815cabd15a62a5546a4b1357"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" DROP CONSTRAINT "FK_016a812ce05a5f196c44d7faedc"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."notifications"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum"`);
    }

}
