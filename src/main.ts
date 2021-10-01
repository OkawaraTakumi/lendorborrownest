import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import * as helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'https://lendorborrownext-b7acbxt6u-okawaratakumi.vercel.app',
    methods: ['*', 'GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      '*',
      'Content-Type',
      'Content-Length',
      'Accept-Encoding',
      'X-CSRF-Token',
      'Authorization',
      'accept',
      'origin',
      'Cache-Control',
      'X-Requested-With',
    ],
    exposedHeaders: ['*', 'Authorization', 'Content-Length'],
    credentials: true,
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
