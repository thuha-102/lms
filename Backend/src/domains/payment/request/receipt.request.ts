import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { connectManyRelation, connectRelation } from 'src/shared/prisma.helper';

export class ReceiptREQ {
  @IsNumber()
  @IsNotEmpty()
  learnerId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  courseIds: number[];

  static toCreateInput(body: ReceiptREQ): Prisma.ReceiptCreateInput {
    return {
      Learner: connectRelation(body.learnerId),
      Course: connectManyRelation(body.courseIds),
    };
  }
}
