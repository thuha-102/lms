import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { connectManyRelation, connectRelation } from 'src/shared/prisma.helper';

export class TopicUpdateREQ {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  lessonIds: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  lmIds: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  addPreIds: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  addPostIds: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  deletePreIds: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  deletePostIds: number[];

  static toCreatePreLink(topicId: number, addPreIds: number[]): Prisma.TopicLinkCreateManyInput[] {
    return addPreIds.map((id) => ({ startId: id, endId: topicId }));
  }

  static toCreatePostLink(topicId: number, addPostIds: number[]): Prisma.TopicLinkCreateManyInput[] {
    return addPostIds.map((id) => ({ startId: topicId, endId: id }));
  }

  static toDeletePreLink(topicId: number, deletePreIds: number[]): Prisma.TopicLinkUpdateManyArgs[] {
    return deletePreIds.map((id) => ({ data: { state: false }, where: { startId: id, endId: topicId } }));
  }

  static toDeletePostLink(topicId: number, deletePostIds: number[]): Prisma.TopicLinkUpdateManyArgs[] {
    return deletePostIds.map((id) => ({ data: { state: false }, where: { startId: topicId, endId: id } }));
  }

  static toUpdateInput(body: TopicUpdateREQ): Prisma.TopicUpdateInput {
    return {
      title: body.title,
      // Lesson: connectManyRelation(body.lessonIds),
      LearningMaterial: connectManyRelation(body.lmIds),
    };
  }
}
