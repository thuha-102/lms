import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { TopicCreateREQ } from './request/topics-create.request';
import { connectRelation } from 'src/shared/prisma.helper';
import { TopicUpdateREQ } from './request/topics-update.request';
import { TopicListREQ } from './request/topics-list.request';
import { LessonService } from '../lessons/lessons.service';

@Injectable()
export class TopicService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lessonService: LessonService,
  ) {}

  async create(body: TopicCreateREQ, tx?, order?) {
    try {
      let topic;
      const nextOrder = order ? order : 0;

      if (tx) {
        topic = await tx.topic.create({
          data: { name: body.name, order: nextOrder, Course: connectRelation(body.courseId) },
          select: { id: true },
        });
      } else {
        topic = await this.prismaService.topic.create({
          data: TopicCreateREQ.createTopicInput(body),
          select: { id: true },
        });

        await this.prismaService.course.update({
          where: { id: body.courseId },
          data: { totalTopics: { increment: 1 }, totalLessons: { increment: body.lessons ? body.lessons.length : 0 } },
        });

        if (body.lessons) {
          for (let i = 0; i < body.lessons.length; i++) {
            const lesson = body.lessons[i];
            await this.lessonService.create({ title: lesson.title, fileId: lesson.fileId, topicId: topic.id }, undefined, i);
          }
        }
      }

      return { id: topic.id };
    } catch (e) {
      // throw new ConflictException(e.meta.cause);
      return e;
    }
  }

  async updateOrder(topicIds?: number[]) {
    return await this.prismaService.$transaction(async (tx) => {
      for (let i = 0; i < topicIds.length; i++) await tx.topic.update({ where: { id: topicIds[i] }, data: { order: i } });
    });
  }

  async update(id: number, body: TopicUpdateREQ) {
    return await this.prismaService.topic.update({ where: { id }, data: TopicUpdateREQ.updateTopicInput(body) });
  }

  async delete(id: number) {
    const deleteTopicInFo = await this.prismaService.topic.delete({
      where: { id },
      select: { courseId: true, Lessons: { select: { id: true } } },
    });
    const courseId = deleteTopicInFo.courseId,
      deleteLesson = deleteTopicInFo.Lessons.length;

    await this.prismaService.course.update({
      where: { id: courseId },
      data: { totalTopics: { decrement: 1 }, totalLessons: { decrement: deleteLesson } },
    });
  }

  async detail(id: number) {
    const topic = await this.prismaService.topic.findFirst({ where: { id }, select: TopicListREQ.selectTopicField() });
    return topic;
  }
}
