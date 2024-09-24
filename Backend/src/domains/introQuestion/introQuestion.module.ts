import { Module } from '@nestjs/common';
import { IntroQuestionService } from './introQuestion.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { IntroQuestionController } from './introQuestion.controller';
import { SequenceCoursesService } from '../sequenceCourses/sequenceCourses.service';

@Module({
  imports: [PrismaModule],
  providers: [IntroQuestionService, SequenceCoursesService],
  controllers: [IntroQuestionController],
})
export class IntroQuestionModule {}
