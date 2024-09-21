import { Prisma } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class TopicCreateREQ {
  @IsNumber()
  courseId: number;

  @IsString()
  name: string;

  static createTopicInput(body: TopicCreateREQ, order: number): Prisma.TopicCreateInput {
    return {
      name: body.name,
      Course: connectRelation(body.courseId),
      order: order,
    };
  }
}
