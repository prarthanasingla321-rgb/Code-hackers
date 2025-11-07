import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
const helmet = require('helmet');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  await app.listen(process.env.PORT_API || 3001, '0.0.0.0');
  console.log('API listening on', process.env.PORT_API || 3001);
}
bootstrap();