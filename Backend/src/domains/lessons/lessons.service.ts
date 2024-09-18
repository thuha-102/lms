import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonCreateREQ } from './request/lessons-create.request';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LessonUpdateREQ } from './request/lessons-update.request';
import { LessonListREQ } from './request/lessons-list.request';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: LessonCreateREQ) {
    const lesson = await this.prismaService.lesson.create({ data: LessonCreateREQ.toCreateInput(body), select: { id: true } });
    return { id: lesson.id };
  }

  async detail(id: number) {
    const lesson = await this.prismaService.lesson.findFirst({ where: { id }, select: LessonListREQ.selectLessonField() });
    if (!lesson) throw new NotFoundException(`Not found lesson ${id}`);

    return lesson;
  }

  async update(id: number, body: LessonUpdateREQ) {
    const lesson = await this.prismaService.lesson.findFirst({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    await this.prismaService.lesson.update({ where: { id }, data: LessonUpdateREQ.toUpdateInput(body) });
  }

  async delete(id: number) {
    await this.prismaService.lesson.delete({ where: { id } });
  }
}
