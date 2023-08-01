import { MigrationInterface, QueryRunner } from "typeorm";

export class Init71689869271935 implements MigrationInterface {
    name = 'Init71689869271935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image_data" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image_data" SET NOT NULL`);
    }
}
