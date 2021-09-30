import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'https://lendorborrownext-movm5510o-okawaratakumi.vercel.app/',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: ['*', 'Authorization'],
    credentials: true,
    preflightContinue: true,
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
