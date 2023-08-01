import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from '../entities/products.entity';
import { ProductsService } from '../service/products.service';
import { ProductsController } from '../controller/products.controller';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([ProductsEntity])],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService, TypeOrmModule]
})
export class ProductsModule {}
