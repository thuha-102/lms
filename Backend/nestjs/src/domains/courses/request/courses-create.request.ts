import { BackgroundKnowledgeType, Prisma } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { connectManyRelation, connectRelation } from 'src/shared/prisma.helper';

export class CourseCreateREQ {
  @IsString()
  name: string;

  @IsNumber()
  idInstructor: number;

  @IsOptional()
  @IsBoolean()
  visibility: boolean = false;

  @IsEnum(BackgroundKnowledgeType)
  level: BackgroundKnowledgeType;

  @IsString()
  description: string;

  @IsNumber()
  amountOfTime: number;

  @IsNumber({}, { each: true })
  lessonIds: number[];

  static toCreateInput(body: CourseCreateREQ): Prisma.CourseCreateInput {
    return {
      Instructor: connectRelation(body.idInstructor),
      name: body.name,
      visibility: body.visibility,
      level: body.level,
      description: body.description,
      amountOfTime: 0,
      Lesson: connectManyRelation(body.lessonIds),
    };
  }
}
