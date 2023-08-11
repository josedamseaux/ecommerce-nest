import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { UsersPurchasesEntity } from '../entities/usersPurchases.entity';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import { PurchasesService } from 'src/purchases/service/purchases.service';
import { PurchasesModule } from 'src/purchases/module/purchases.module';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, UsersPurchasesEntity])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
