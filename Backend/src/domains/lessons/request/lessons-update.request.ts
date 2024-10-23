import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { QuizCreateREQ } from 'src/services/file/request/quiz.create';
import { connectRelation, leanObject } from 'src/shared/prisma.helper';

export class LessonUpdateREQ {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  time: number;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsOptional()
  @IsNumber()
  fileId: number;

  @IsOptional()
  questionnaire: QuizCreateREQ;

  static toUpdateInput(body: LessonUpdateREQ): Prisma.LessonUpdateInput {
    return leanObject({
      title: body.title,
      order: body.order,
      time: body.time,
      LearningMaterial: body.fileId ? connectRelation(body.fileId) : null,
    });
  }
}
