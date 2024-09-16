import { BackgroundKnowledgeType, Prisma } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { connectRelation, leanObject } from 'src/shared/prisma.helper';

export class CourseUpdateREQ {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  visibility: boolean;

  @IsOptional()
  @IsEnum(BackgroundKnowledgeType)
  level: BackgroundKnowledgeType;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  amountOfTime: number;

  @IsOptional()
  @IsNumber()
  lessonId: number;

  static toUpdateInput(body: CourseUpdateREQ): Prisma.CourseUpdateInput {
    return leanObject({
      name: body.name,
      updatedAt: new Date(),
      visibility: body.visibility,
      level: body.level,
      description: body.description,
      amountOfTime: body.amountOfTime,
      Lesson: body.lessonId ? connectRelation(body.lessonId) : null,
    });
  }
}
