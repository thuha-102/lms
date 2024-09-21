import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { TopicCreateREQ } from './request/topics-create.request';
import { connectRelation } from 'src/shared/prisma.helper';
import { TopicUpdateREQ } from './request/topics-update.request';
import { TopicListREQ } from './request/topics-list.request';

@Injectable()
export class TopicService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: TopicCreateREQ, tx?) {
    let topic;
    try {
      const existTopic = await this.prismaService.topic.findMany({
        orderBy: { order: 'desc' },
        where: { courseId: body.courseId },
        select: { order: true },
      });
      const nextOrder = existTopic.length != 0 ? existTopic[0].order + 1 : 0;

      if (tx)
        topic = await tx.topic.create({
          data: { name: body.name, order: nextOrder, Course: connectRelation(body.courseId) },
          select: { id: true },
        });
      else
        topic = await this.prismaService.topic.create({
          data: { name: body.name, order: nextOrder, Course: connectRelation(body.courseId) },
          select: { id: true },
        });

      return { id: topic.id };
    } catch (e) {
      throw new ConflictException(e.meta.cause);
    }
  }

  async update(id: number, body: TopicUpdateREQ) {
    return await this.prismaService.topic.update({ where: { id }, data: TopicUpdateREQ.updateTopicInput(body) });
  }

  async delete(id: number) {
    return await this.prismaService.topic.delete({ where: { id } });
  }

  async detail(id: number) {
    const topic = await this.prismaService.topic.findFirst({ where: { id }, select: TopicListREQ.selectTopicField() });
    return topic;
  }
}
