import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class LearnerHistoryCourseCreateREQ {
  @IsNotEmpty()
  @IsNumber()
  learnerId: number;

  static toCreateInput(body: LearnerHistoryCourseCreateREQ): Prisma.HistoryStudiedCourseCreateInput {
    return {
      Learner: connectRelation(body.learnerId),
      Lesson: connectRelation(0),
    };
  }
}
