import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11711277977158 implements MigrationInterface {
    name = 'Migration11711277977158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" ADD "image_data5" bytea`);
        await queryRunner.query(`ALTER TABLE "images" ADD "image_data6" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "image_data6"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "image_data5"`);
    }

}
