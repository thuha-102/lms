import { Prisma } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class LessonCreateREQ {
  @IsString()
  title: string;

  @IsNumber()
  topicId: number;

  @IsNumber()
  fileId: number;

  static toCreateInput(body: LessonCreateREQ, order: number): Prisma.LessonCreateInput {
    return {
      title: body.title,
      order: order,
      Topic: connectRelation(body.topicId),
      LearningMaterial: connectRelation(body.fileId),
    };
  }
}
