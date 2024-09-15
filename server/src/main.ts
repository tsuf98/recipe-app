import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(json({ limit: '1mb' }));
  const configService = app.get(ConfigService);

  const isDevMode = configService.get('NODE_ENV') === 'development';

  if (isDevMode) {
    app.enableCors();
  }

  await app.listen(3000);
}
bootstrap();
