import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';

export class TopicUpdateREQ {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  order: number;

  static updateTopicInput(body: TopicUpdateREQ): Prisma.TopicUpdateInput {
    return leanObject({
      name: body.name,
      order: body.order,
    });
  }
}
