import { MigrationInterface, QueryRunner } from "typeorm";

export class WalletsSet1747086968193 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Assign wallets to players without one
    const playersWithoutWallet = await queryRunner.query(`
      SELECT p.id FROM "sportEaze"."Player" p
      LEFT JOIN "sportEaze"."Wallets" w ON w."playerId" = p.id
      WHERE w."id" IS NULL
    `);

    for (const player of playersWithoutWallet) {
      await queryRunner.query(`
        INSERT INTO "sportEaze"."Wallets" ("cash", "payables", "playerId")
        VALUES (10000, 0, $1)
      `, [player.id]);
    }

    // Assign wallets to patrons without one
    const patronsWithoutWallet = await queryRunner.query(`
      SELECT p.id FROM "sportEaze"."Patron" p
      LEFT JOIN "sportEaze"."Wallets" w ON w."patronId" = p.id
      WHERE w."id" IS NULL
    `);

    for (const patron of patronsWithoutWallet) {
      await queryRunner.query(`
        INSERT INTO "sportEaze"."Wallets" ("cash", "payables", "patronId")
        VALUES (0, 0, $1)
      `, [patron.id]);
    }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
