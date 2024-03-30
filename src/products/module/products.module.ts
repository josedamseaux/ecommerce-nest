import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from '../entities/products.entity';
import { ProductsService } from '../service/products.service';
import { ProductsController } from '../controller/products.controller';
import { LikesEntity } from '../entities/likes.entity';
import { CouponsEntity } from '../entities/coupons.entity';
import { ImagesEntity } from '../entities/images.entity';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([ProductsEntity, LikesEntity, CouponsEntity, ImagesEntity])],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService, TypeOrmModule]
})
export class ProductsModule {}
