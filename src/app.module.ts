import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/module/users.module';
import { UsersService } from './users/service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ProductsModule } from './products/module/products.module';
import { ProductsService } from './products/service/products.service';
import { AuthModule } from './auth/module/auth.module';
import { AuthService } from './auth/service/auth.service';
import { PurchasesModule } from './purchases/module/purchases.module';
import { PurchasesService } from './purchases/service/purchases.service';
import { ShoppingcartService } from './shoppingCart/services/shoppingCart.service';
import { PaymentsService } from './payments/service/payments.service';
import { PaymentsController } from './payments/controller/payments.controller';
import { ShoppingcartModule } from './shoppingCart/module/shoppingcart.module';
import { TemporalshoppingcartService } from './shoppingCart/services/temporalshoppingcart.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`,
    isGlobal: true,
  }),
  TypeOrmModule.forRoot(DataSourceConfig),
  AuthModule, UsersModule, ProductsModule, PurchasesModule, ShoppingcartModule],
  providers: [UsersService, ProductsService, AuthService, PurchasesService, ShoppingcartService, TemporalshoppingcartService, PaymentsService],
  controllers: [PaymentsController],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware, cookieParser())
  //     .exclude(
  //       { path: '/auth/login', method: RequestMethod.ALL },
  //     )
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}