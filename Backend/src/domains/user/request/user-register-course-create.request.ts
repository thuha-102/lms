import { Prisma } from '@prisma/client';
import { connectRelation } from 'src/shared/prisma.helper';

export class UserRegisterCourseCreateREQ {
  static toCreateInput(learnerId: number, courseId: number): Prisma.RegisterCourseCreateInput {
    return {
      Learner: connectRelation(learnerId),
      Course: connectRelation(courseId),
    };
  }
}
