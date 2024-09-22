import { Module } from '@nestjs/common';
import { SequenceCoursesService } from './sequenceCourses.service';
import { SequenceCoursesController } from './sequenceCourses.controller';
import { TypeLearnerService } from '../typeLearner/typeLearner.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SequenceCoursesService, TypeLearnerService],
  controllers: [SequenceCoursesController],
})
export class SequenceCoursesModule {}
