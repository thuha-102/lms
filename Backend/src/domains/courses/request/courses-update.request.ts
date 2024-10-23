import { Prisma } from '@prisma/client';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';

export class CourseUpdateREQ {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  avatarId: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  orderTopicIds: number[];

  @IsOptional()
  orderLessonIds: number[][];

  static toUpdateInput(body: CourseUpdateREQ): Prisma.CourseUpdateInput {
    return leanObject({
      name: body.name,
      avatarId: body.avatarId,
      updatedAt: new Date(),
      description: body.description,
    });
  }
}
