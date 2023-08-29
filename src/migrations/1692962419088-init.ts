import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1692962419088 implements MigrationInterface {
    name = 'Init1692962419088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_purchases" ADD "session_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_purchases" DROP COLUMN "session_id"`);
    }

}
