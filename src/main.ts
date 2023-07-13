import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan'
import { CORS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(morgan('dev'))
  app.setGlobalPrefix('api')
  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT')
  app.enableCors(CORS);
  await app.listen(PORT);
  console.log(`application running on:  ${await app.getUrl()}`)
  const aver = configService.get('DB_NAME')

  console.log(PORT)
}


bootstrap();