import { LevelType, Prisma } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { connectManyRelation, connectRelation } from 'src/shared/prisma.helper';

export class Lesson {
  time: number;
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
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  salePercent: number;

  @IsOptional()
  @IsString()
  labels: string[];

  @IsString()
  description: string;

  @IsOptional()
  topicNames: string[];

  @IsArray()
  lessons: Lesson[][];

  @IsOptional()
  @IsNumber()
  avatarId: number;

  @IsOptional()
  @IsEnum(LevelType)
  level: LevelType;

  @IsOptional()
  @IsNumber()
  passPercent: number;

  static toCreateInput(body: CourseCreateREQ): Prisma.CourseCreateInput {
    return {
      name: body.name,
      labels: body.labels,
      description: body.description,
      price: body.price,
      salePercent: body.salePercent ? body.salePercent : 0,
      level: body.level,
      avatarId: body.avatarId,
      passPercent: body.passPercent,
    };
  }
}
