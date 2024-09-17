import { Prisma, SubjectType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { connectManyRelation, connectRelation } from 'src/shared/prisma.helper';

export class TopicCreateREQ {
  @IsString()
  title: string;

  @IsEnum(SubjectType)
  subject: SubjectType;

  @IsOptional()
  @IsNumber({}, { each: true })
  preTopicIds: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  postTopicIds: number[];

  static toCreatePreLinkInput(topicId: number, body: TopicCreateREQ): Prisma.TopicLinkCreateManyInput[] {
    return body.preTopicIds.map((preTopicId) => ({ startId: preTopicId, endId: topicId }));
  }

  static toCreatePostLinkInput(topicId: number, body: TopicCreateREQ): Prisma.TopicLinkCreateManyInput[] {
    return body.postTopicIds.map((postTopicId) => ({ startId: topicId, endId: postTopicId }));
  }

  static toCreateInput(body: TopicCreateREQ): Prisma.TopicCreateInput {
    return {
      title: body.title,
      subject: body.subject,
      // StartLink: connectManyRelation(body.postTopicIds),
      // EndLink: connectManyRelation(body.preTopicIds),
    };
  }
}
