import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class UserRegisterCourseCreateREQ {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  static toCreateInput(learnerId: number, courseId: number): Prisma.RegisterCourseCreateInput {
    return {
      learner: connectRelation(learnerId),
      course: connectRelation(courseId),
    };
  }
}
