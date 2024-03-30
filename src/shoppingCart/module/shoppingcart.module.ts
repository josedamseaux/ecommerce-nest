
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingcartController } from '../controller/shoppingcart.controller';
import { ShoppingcartService } from '../services/shoppingCart.service';
import { ShoppingCartEntity } from '../entities/shoppingCart.entity';
import { TemporalShoppingCartEntity } from '../entities/temporalShoppingCart.entity';
import { TemporalshoppingcartService } from '../services/temporalshoppingcart.service';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([ShoppingCartEntity, TemporalShoppingCartEntity])],
    providers: [ShoppingcartService, TemporalshoppingcartService],
    controllers: [ShoppingcartController],
    exports: [ShoppingcartService, TypeOrmModule, TemporalshoppingcartService]
})
export class ShoppingcartModule {}
