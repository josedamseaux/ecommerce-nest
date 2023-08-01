import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { UsersPurchasesEntity } from '../entities/usersPurchases.entity';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, UsersPurchasesEntity])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
