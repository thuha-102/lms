import { Prisma } from '@prisma/client';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { connectRelation } from 'src/shared/prisma.helper';

export class TopicLinkUpdateREQ {
  @IsOptional()
  @IsBoolean()
  state: boolean;

  @IsOptional()
  @IsNumber()
  startId: number;

  @IsOptional()
  @IsNumber()
  endId: number;

  static toUpdateInput(body: TopicLinkUpdateREQ): Prisma.TopicLinkUpdateInput {
    return {
      state: body.state,
      start: connectRelation(body.startId),
      end: connectRelation(body.endId),
    };
  }
}
