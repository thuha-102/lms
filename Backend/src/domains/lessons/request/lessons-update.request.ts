import { Prisma } from '@prisma/client';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';

export class LessonUpdateREQ {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  visibility: boolean;

  @IsOptional()
  @IsNumber()
  amountOfTime: number;

  static toUpdateInput(body: LessonUpdateREQ): Prisma.LessonUpdateInput {
    return leanObject({
      title: body.title,
      visibility: body.visibility,
      amountOfTime: body.amountOfTime,
    });
  }
}
