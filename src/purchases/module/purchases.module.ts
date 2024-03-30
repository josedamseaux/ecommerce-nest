import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesService } from '../service/purchases.service';
import { PurchasesController } from '../controller/purchases.controller';
import { UsersPurchasesEntity } from 'src/purchases/entities/usersPurchases.entity';


    
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([ UsersPurchasesEntity])],
    providers: [PurchasesService],  
    controllers: [PurchasesController],
    exports: [PurchasesService, TypeOrmModule]
})
export class PurchasesModule {}
