import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './services/prisma/prisma.module';
import { UserModule } from './domains/user/user.module';
import { OntologyModule } from './services/ontology/ontology.module';
import { LearningModule } from './domains/learning/learning.module';
import { TopicModule } from './domains/topic/topic.module';
import { ForumModule } from './domains/forum/forum.module';
import { AuthModule } from './domains/auth/auth.module';
import { CourseModule } from './domains/courses/courses.module';
import { LessonModule } from './domains/lessons/lessons.module';
import { FileModule } from './services/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ModelModule } from './domains/model/model.module';
import { ModelVariationModule } from './domains/modelVariation/modelVariation.module';
import { DatasetModule } from './domains/dataset/dataset.module';
import { NotebookModule } from './domains/notebook/notebook.module';
import { PythonRunnerModule } from './domains/pythonRunner/pythonRunner.module';
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
    OntologyModule,
    ForumModule,
    CourseModule,
    LessonModule,
    FileModule,
    ModelModule,
    ModelVariationModule,
    DatasetModule,
    NotebookModule,
    PythonRunnerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
