import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { LargeNumberLike } from 'crypto';
import { Lesson } from 'src/domains/courses/request/courses-create.request';
import { connectRelation } from 'src/shared/prisma.helper';

export class TopicCreateREQ {
  @IsNumber()
  courseId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsOptional()
  lessons: Lesson[];

  @IsOptional()
  @IsNumber()
  totalLessons: number;

  static createTopicInput(body: TopicCreateREQ, order?: number): Prisma.TopicCreateInput {
    return {
      name: body.name,
      Course: connectRelation(body.courseId),
      totalLessons: body.lessons ? body.lessons.length : body.totalLessons,
      order: body.order ? body.order : order,
    };
  }
}
