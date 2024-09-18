import { Prisma } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';

export class TopicUpdateREQ {
  @IsString()
  name: string;

  @IsNumber()
  order: number;

  static updateTopicInput(body: TopicUpdateREQ): Prisma.TopicUpdateInput {
    return leanObject({
      name: body.name,
      order: body.order,
    });
  }
}
