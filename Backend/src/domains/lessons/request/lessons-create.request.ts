import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class LessonCreateREQ {
  @IsString()
  title: string;

  @IsNumber()
  topicId: number;

  @IsOptional()
  order: number;

  @IsOptional()
  @IsNumber()
  fileId: number;

  @IsOptional()
  @IsNumber()
  time: number;

  static toCreateInput(body: LessonCreateREQ, order: number): Prisma.LessonCreateInput {
    return {
      title: body.title,
      order: order,
      time: body.time,
      Topic: connectRelation(body.topicId),
      ...(body.fileId && { LearningMaterial: connectRelation(body.fileId) }),
    };
  }
}
