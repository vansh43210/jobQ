import 'dotenv/config'; // ⚠️ MUST be first — loads .env before any other import reads process.env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { testConnection } from './db/db.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await testConnection();
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();


