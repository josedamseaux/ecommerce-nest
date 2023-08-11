import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesService } from '../service/purchases.service';
import { PurchasesController } from '../controller/purchases.controller';
import { PurchaseEntity } from '../entities/purchase.entity';
import { UsersPurchasesEntity } from 'src/users/entities/usersPurchases.entity';
import { ShoppingCartEntity } from '../entities/shoppingCart.entity';
import { ShoppingcartService } from '../service/shoppingCart.service';

    
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([PurchaseEntity, UsersPurchasesEntity, ShoppingCartEntity])],
    providers: [PurchasesService, ShoppingcartService],  
    controllers: [PurchasesController],
    exports: [PurchasesService, TypeOrmModule]
})
export class PurchasesModule {}
