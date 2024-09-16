import { IsNumber } from 'class-validator';

export class TopicLinkDeleteREQ {
  @IsNumber({}, { each: true })
  postIds: number[];
}
