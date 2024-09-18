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

@Module({
  imports: [
    PrismaModule,
    // AuthModule,
    // UserModule,
    // LearningModule,
    // CourseModule,
    // LessonModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
