import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDb1694427210436 implements MigrationInterface {
    name = 'ChangeDb1694427210436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "event_history" DROP COLUMN "url"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_history" DROP COLUMN "header"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "event_history"
            ADD "header" text NOT NULL DEFAULT '{}'
        `);
        await queryRunner.query(`
            ALTER TABLE "event_history"
            ADD "url" character varying NOT NULL
        `);
    }

}
