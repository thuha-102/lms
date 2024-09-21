import { Prisma } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { connectManyRelation, connectRelation } from 'src/shared/prisma.helper';

export class Lesson {
  title: string;
  fileId: number;
}

export class CourseCreateREQ {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  visibility: boolean = false;

  @IsOptional()
  @IsString()
  labels: string[];

  @IsString()
  description: string;

  @IsOptional()
  topicNames: string[];

  @IsArray()
  lessons: Lesson[][];

  static toCreateInput(body: CourseCreateREQ): Prisma.CourseCreateInput {
    return {
      name: body.name,
      labels: body.labels,
      description: body.description,
    };
  }
}
