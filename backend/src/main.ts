import 'dotenv/config'; // ⚠️ MUST be first — loads .env before any other import reads process.env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.API_URL
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();


