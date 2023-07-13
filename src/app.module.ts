import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/module/users.module';
import { UsersController } from './users/controller/users.controller';
import { UsersService } from './users/service/users.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ProductsModule } from './products/module/products.module';
import { ProductsController } from './products/controller/products.controller';
import { ProductsService } from './products/service/products.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`,
    isGlobal: true
  }),  
  TypeOrmModule.forRoot(DataSourceConfig),
  UsersModule, ProductsModule],
  controllers: [UsersController, ProductsController],
  providers: [AppService, UsersService, ProductsService],
})
export class AppModule {}
