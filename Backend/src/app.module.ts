import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './services/prisma/prisma.module';
import { UserModule } from './domains/user/user.module';
import { LearningModule } from './domains/learning/learning.module';
import { TopicModule } from './domains/topic/topic.module';
import { AuthModule } from './domains/auth/auth.module';
import { CourseModule } from './domains/courses/courses.module';
import { LessonModule } from './domains/lessons/lessons.module';
import { FileModule } from './services/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PythonRunnerModule } from './domains/pythonRunner/pythonRunner.module';
import { IntroQuestionModule } from './domains/introQuestion/introQuestion.module';
import { join } from 'path';
import { AnalyticsModule } from './domains/analytics/analytics.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AnalyticsModule,
    UserModule,
    LearningModule,
    TopicModule,
    CourseModule,
    LessonModule,
    FileModule,
    PythonRunnerModule,
    IntroQuestionModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
