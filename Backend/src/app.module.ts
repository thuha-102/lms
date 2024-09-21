import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './services/prisma/prisma.module';
import { UserModule } from './domains/user/user.module';
import { LearningModule } from './domains/learning/learning.module';
import { AuthModule } from './domains/auth/auth.module';
import { CourseModule } from './domains/courses/courses.module';
import { LessonModule } from './domains/lessons/lessons.module';
import { FileModule } from './services/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TopicModule } from './domains/topics/topics.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/http-exception.filter';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    // LearningModule,
    CourseModule,
    TopicModule,
    LessonModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}