import { Prisma } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class LessonCreateREQ {
  @IsString()
  title: string;

  @IsNumber()
  topicId: number;

  @IsNumber()
  order: number;

  @IsNumber()
  fileid: number;

  static toCreateInput(body: LessonCreateREQ): Prisma.LessonCreateInput {
    return {
      title: body.title,
      order: body.order,
      Topic: connectRelation(body.topicId),
      LearningMaterial: connectRelation(body.fileid),
    };
  }
}
