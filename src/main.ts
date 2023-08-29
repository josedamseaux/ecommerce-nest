import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan'
import { CORS } from './constants';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(morgan('dev'))
  
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders:['Content-Type', 'Authorization'],
    credentials: true,
  };
  
  app.enableCors(corsOptions);

  app.setGlobalPrefix('api')

  const configService = app.get(ConfigService)

  const PORT = configService.get('PORT')

  app.enableCors(CORS);

  await app.listen(PORT);

  console.log(`application running on:  ${await app.getUrl()}`)

}


bootstrap();