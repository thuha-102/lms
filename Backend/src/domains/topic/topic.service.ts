import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { TopicCreateREQ } from './request/topic-create.request';
import { TopicUpdateREQ } from './request/topic-update.request';
import { TopicLinkDeleteREQ } from './request/topic-link-delete.request';
import { TopicDetailRESP } from './response/topic-detail.response';
import { TopicLinkUpdateREQ } from './request/topic-link-update.request';
import { connectRelation } from 'src/shared/prisma.helper';
import { TopicDTO } from './dto/topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: TopicCreateREQ) {
    await this.prismaService.$transaction(async (tx) => {
      const topic = await tx.topic.create({
        data: TopicCreateREQ.toCreateInput(body),
        select: { id: true },
      });

      const createTopicLinkPromises = [];

      if (body.postTopicIds) {
        createTopicLinkPromises.push(
          ...body.postTopicIds.map((postTopicId) =>
            tx.topicLink.create({
              data: { start: connectRelation(topic.id), end: connectRelation(postTopicId) },
            }),
          ),
        );
      }

      if (body.preTopicIds) {
        createTopicLinkPromises.push(
          ...body.preTopicIds.map((preTopicId) =>
            tx.topicLink.create({
              data: { start: connectRelation(preTopicId), end: connectRelation(topic.id) },
            }),
          ),
        );
      }
      await Promise.all(createTopicLinkPromises);
    });
  }

  async createBatch(body: TopicCreateREQ[]) {
    return;
    // await this.prismaService.$transaction(async (tx) => {
    //   // let topicIds = [];
    //   // for (let i = 0; i < body.length; i++) {
    //   //   const topic = await tx.topic.create({ data: TopicCreateREQ.toCreateInput(body[i]), select: { id: true } });
    //   //   topicIds.push(topic.id);
    //   // }

    //   // for (let i = 0; i < body.length; i++) {
    //   //   if (body[i].postTopicIds)
    //   //     await tx.topicLink.createMany({
    //   //       data: body[i].postTopicIds.map((postId) => ({ startId: topicIds[i], endId: postId })),
    //   //     });

    //   //   if (body[i].preTopicIds)
    //   //     await tx.topicLink.createMany({
    //   //       data: body[i].postTopicIds.map((preId) => ({ startId: preId, endId: topicIds[i] })),
    //   //     });
    //   // }
    // });
  }

  async detail(id: number) {
    const topic = await this.prismaService.topic.findFirst({ where: { id: id }, select: { title: true } });

    const preTopics = (
      await this.prismaService.topicLink.findMany({ where: { state: true, endId: id }, select: { startId: true, start: true } })
    ).map((t) => t.start);

    const postTopics = (
      await this.prismaService.topicLink.findMany({ where: { state: true, startId: id }, select: { endId: true, end: true } })
    ).map((t) => t.end);

    return {
      title: topic.title,
      preTopics: preTopics,
      postTopics: postTopics,
    };
  }

  async update(id: number, body: TopicUpdateREQ) {
    await this.prismaService.topic.update({
      where: { id },
      data: TopicUpdateREQ.toUpdateInput(body),
    });

    this.prismaService.$transaction(async (tx) => {
      if (body.addPreIds) await tx.topicLink.createMany({ data: TopicUpdateREQ.toCreatePreLink(id, body.addPreIds) });
      if (body.addPostIds) await tx.topicLink.createMany({ data: TopicUpdateREQ.toCreatePostLink(id, body.addPostIds) });

      if (body.deletePreIds)
        for (let i = 0; i < body.deletePreIds.length; i++)
          await tx.topicLink.deleteMany({ where: { startId: body.deletePreIds[i], endId: id } });

      if (body.deletePostIds)
        for (let i = 0; i < body.deletePostIds.length; i++)
          await tx.topicLink.deleteMany({ where: { startId: id, endId: body.deletePostIds[i] } });
    });
  }

  async updateLink(id: number, body: TopicLinkUpdateREQ) {
    const link = await this.prismaService.topicLink.findFirst({ where: { id }, select: { state: true } });

    if (!body.state) body.state = link.state;
    await this.prismaService.topicLink.update({ where: { id }, data: TopicLinkUpdateREQ.toUpdateInput(body) });
  }

  async disactiveLink(id: number, body: TopicLinkDeleteREQ) {
    const link = await this.prismaService.topicLink.findMany({
      where: { startId: id, endId: { in: body.postIds } },
      select: { id: true },
    });

    link.map((link) =>
      this.prismaService.topicLink.update({
        where: { id: link.id },
        data: { state: false },
      }),
    );
  }

  async list() {
    const topics = await this.prismaService.topic.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, title: true, subject: true, StartLink: true, EndLink: true },
    });
    return topics.map((topic) => TopicDTO.fromEntity(topic));
  }
}
