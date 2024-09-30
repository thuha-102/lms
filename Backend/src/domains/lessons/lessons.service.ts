import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { LessonCreateREQ } from './request/lessons-create.request';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LessonUpdateREQ } from './request/lessons-update.request';
import { LessonListREQ } from './request/lessons-list.request';
import { Prisma } from '@prisma/client';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: LessonCreateREQ, tx?, order?) {
    try {
      let lesson;
      const nextOrder = order ? order : 0;

      if (tx) lesson = await tx.lesson.create({ data: LessonCreateREQ.toCreateInput(body, nextOrder), select: { id: true } });
      else {
        lesson = await this.prismaService.lesson.create({
          data: LessonCreateREQ.toCreateInput(body, body.order),
          select: { id: true, topicId: true },
        });

        const topic = await this.prismaService.topic.update({
          where: { id: lesson.topicId },
          data: {
            totalLessons: { increment: 1 },
          },
          select: { courseId: true },
        });

        await this.prismaService.course.update({ where: { id: topic.courseId }, data: { totalLessons: { increment: 1 } } });
      }
      return { id: lesson.id };
    } catch (e) {
      console.log(e)
      throw new ConflictException(e);
    }
  }

  async detail(id: number) {
    const lesson = await this.prismaService.lesson.findFirst({ where: { id }, select: LessonListREQ.selectLessonField() });
    if (!lesson) throw new NotFoundException(`Not found lesson ${id}`);

    return LessonListREQ.fromEntity(lesson as any);
  }

  async updateOrder(lessonIds: number[]) {
    for (let i = 0; i < lessonIds.length; i++) {
      await this.prismaService.lesson.update({ where: { id: lessonIds[i] }, data: { order: i } });
    }
  }

  async update(id: number, body: LessonUpdateREQ) {
    const lesson = await this.prismaService.lesson.findFirst({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    await this.prismaService.lesson.update({ where: { id }, data: LessonUpdateREQ.toUpdateInput(body) });
  }

  async delete(id: number) {
    const { topicId } = await this.prismaService.lesson.delete({ where: { id }, select: { topicId: true } });
    const { courseId } = await this.prismaService.topic.update({
      where: { id: topicId },
      data: { totalLessons: { decrement: 1 } },
      select: { courseId: true },
    });
    await this.prismaService.course.update({ where: { id: courseId }, data: { totalLessons: { decrement: 1 } } });
  }
}
