import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesService } from '../service/purchases.service';
import { PurchasesController } from '../controller/purchases.controller';
import { PurchaseEntity } from '../entities/purchase.entity';
import { UsersPurchasesEntity } from 'src/users/entities/usersPurchases.entity';

    
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([PurchaseEntity, UsersPurchasesEntity])],
    providers: [PurchasesService],  
    controllers: [PurchasesController],
    exports: [PurchasesService, TypeOrmModule]
})
export class PurchasesModule {}
