import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class LearnerHistoryCourseCreateREQ {
  @IsNotEmpty()
  @IsNumber()
  learnerId: number;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  static toCreateInput(body: LearnerHistoryCourseCreateREQ): Prisma.HistoryOfCourseCreateInput {
    return {
      learner: connectRelation(body.learnerId),
      course: connectRelation(body.courseId),
    };
  }
}
