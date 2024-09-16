import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class LearnerLogCreateREQ {
  @IsNotEmpty()
  @IsNumber()
  learningMaterialVisittedTime: number;

  @IsNotEmpty()
  @IsNumber()
  learningMaterialId: number;

  @IsOptional()
  @IsNumber()
  learnerId: number;

  @IsOptional()
  @IsNumber()
  learnerAnswer: string[] | string | number[];

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  time: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  attempts: number;

  static toCreateInput(userID: number, body: LearnerLogCreateREQ, score: number): Prisma.LearnerLogCreateInput {
    return {
      learningMaterialVisittedTime: Date.now(),
      learningMaterialRating: body.rating,
      score: score,
      time: body.time,
      attempts: 1,
      learningMaterial: connectRelation(body.learningMaterialId),
      learner: connectRelation(userID),
    };
  }

  static toCreateBatchInput(body: LearnerLogCreateREQ): Prisma.LearnerLogCreateInput {
    let score = 0;
    return {
      learningMaterialVisittedTime: Date.now(),
      learningMaterialRating: body.rating,
      score: score,
      time: body.time,
      attempts: body.attempts,
      learningMaterial: connectRelation(body.learningMaterialId),
      learner: connectRelation(body.learnerId),
    };
  }
}
