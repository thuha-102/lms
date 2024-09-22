import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { SequenceCourseService } from './sequenceCourse.service';
import { SequenceCourseController } from './sequenceCourse.controller';

@Module({
  imports: [PrismaModule],
  providers: [SequenceCourseService],
  controllers: [SequenceCourseController],
})
export class SequenceCourseModule {}
