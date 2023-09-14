import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitDb1694406232068 implements MigrationInterface {
	name = 'InitDb1694406232068'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE "event_history" (
                "id" SERIAL NOT NULL,
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "protocol_type" character varying,
                "url" character varying NOT NULL,
                "header" text NOT NULL DEFAULT '{}',
                "request" text NOT NULL DEFAULT '{}',
                "response" text NOT NULL DEFAULT '{}',
                "success" boolean NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cdac290cc64352558c203d86f03" PRIMARY KEY ("id")
            )
        `)
		await queryRunner.query(`
            CREATE INDEX "idx_event_history__code" ON "event_history" ("code")
        `)
		await queryRunner.query(`
            CREATE TABLE "event" (
                "id" SERIAL NOT NULL,
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                CONSTRAINT "UQ_58f788de12432757f10c683bbd6" UNIQUE ("code"),
                CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
            )
        `)
		await queryRunner.query(`
            CREATE TABLE "hook" (
                "id" SERIAL NOT NULL,
                "event_id" integer NOT NULL,
                "protocol_type" character varying NOT NULL DEFAULT 'RestAPI',
                "url" character varying NOT NULL,
                "header" text NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                CONSTRAINT "PK_4fae52db3090a56452a9c93e0ed" PRIMARY KEY ("id")
            )
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DROP TABLE "hook"
        `)
		await queryRunner.query(`
            DROP TABLE "event"
        `)
		await queryRunner.query(`
            DROP INDEX "public"."idx_event_history__code"
        `)
		await queryRunner.query(`
            DROP TABLE "event_history"
        `)
	}
}
