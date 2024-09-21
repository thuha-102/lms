import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { PrismaClientExceptionFilter } from './shared/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.use(bodyParser.json({ limit: '10mb' }));
  app.enableCors();
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
