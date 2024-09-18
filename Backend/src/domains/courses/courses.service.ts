import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseCreateREQ } from './request/courses-create.request';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CourseUpdateREQ } from './request/courses-update.request';
import { CourseDTO, CourseListDTO } from './dto/course.dto';
import { CourseListREQ } from './request/courses-list.request';
import { LessonService } from '../lessons/lessons.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicService: TopicService,
    private readonly lessonService: LessonService,
  ) {}

  async create(body: CourseCreateREQ) {
    const course = await this.prismaService.course.create({ data: CourseCreateREQ.toCreateInput(body), select: { id: true } });

    return { id: course.id };
  }

  async detail(id: number) {
    const course = await this.prismaService.course.findFirst({ where: { id }, select: CourseDTO.selectFields() });
    // const lessons = await this.prismaService.lesson.findMany({ where: { courseId: course.id}, select: {id: true, title: true}})
    if (!course) throw new NotFoundException('Course not found');

    return CourseDTO.fromEnTity(course as any);
  }

  async getAll(query: CourseListREQ) {
    const condition = CourseListREQ.toCondition(query);
    const courses = await this.prismaService.course.findMany({
      orderBy: {
        id: 'asc',
      },
      where: condition,
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });

    return courses.map((c) => CourseListDTO.fromEntity(c as any));
  }

  async update(id: number, body: CourseUpdateREQ) {
    const course = await this.prismaService.course.findFirst({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    await this.prismaService.course.update({ where: { id }, data: CourseUpdateREQ.toUpdateInput(body) });
  }
}
