import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { connectRelation, leanObject } from 'src/shared/prisma.helper';

export class LessonUpdateREQ {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsOptional()
  @IsNumber()
  fileId: number;

  static toUpdateInput(body: LessonUpdateREQ): Prisma.LessonUpdateInput {
    return leanObject({
      title: body.title,
      order: body.order,
      LearningMaterial: connectRelation(body.fileId),
    });
  }
}
