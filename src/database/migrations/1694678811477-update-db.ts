import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDb1694678811477 implements MigrationInterface {
    name = 'UpdateDb1694678811477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "hook"
            ALTER COLUMN "created_at"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "hook"
            ALTER COLUMN "updated_at"
            SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "hook"
            ALTER COLUMN "updated_at" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "hook"
            ALTER COLUMN "created_at" DROP NOT NULL
        `);
    }

}
