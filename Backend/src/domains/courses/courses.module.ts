import { Module } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CourseController } from './courses.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { TopicModule } from '../topics/topics.module';
import { LessonModule } from '../lessons/lessons.module';

@Module({
  imports: [PrismaModule, TopicModule, LessonModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
