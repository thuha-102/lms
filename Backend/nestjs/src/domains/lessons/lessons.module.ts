import { Module } from '@nestjs/common';
import { LessonService } from './lessons.service';
import { LessonController } from './lessons.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { CourseModule } from '../courses/courses.module';

@Module({
  imports: [PrismaModule, CourseModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
