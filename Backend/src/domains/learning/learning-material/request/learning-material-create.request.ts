import { LearningMaterialType, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class Quiz {
  id: number;
  questionarie: {
    question: String;
    answers: String[];
    correctAnswer: number;
  }[];
}

export class LearningMaterialCreateREQ {
  @IsNumber()
  lessonId: number;

  @IsEnum(LearningMaterialType)
  type: LearningMaterialType;

  static toCreateInput(body: LearningMaterialCreateREQ, filepath: string): Prisma.LearningMaterialCreateInput {
    return {
      Lesson: connectRelation(body.lessonId),
      type: body.type,
    };
  }
}
