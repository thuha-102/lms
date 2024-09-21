import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseCreateREQ } from './request/courses-create.request';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CourseUpdateREQ } from './request/courses-update.request';
import { CourseDTO, CourseListDTO } from './dto/course.dto';
import { CourseListREQ } from './request/courses-list.request';
import { LessonService } from '../lessons/lessons.service';
import { TopicService } from '../topics/topics.service';
import { TopicDTO } from '../topics/dto/topics.dto';
import { LessonDTO } from '../lessons/dto/lessons.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicService: TopicService,
    private readonly lessonService: LessonService,
  ) {}

  async create(body: CourseCreateREQ) {
    return this.prismaService.$transaction(async (tx) => {
      const course = await tx.course.create({ data: CourseCreateREQ.toCreateInput(body), select: { id: true } });

      for (let i = 0; i < body.topicNames.length; i++) {
        const { id } = await this.topicService.create({ courseId: course.id, name: body.topicNames[i] }, tx);
        for (let j = 0; j < body.lessons[i].length; j++) {
          const lesson = body.lessons[i][j];
          await this.lessonService.create({ title: lesson.title, fileId: lesson.fileId, topicId: id }, tx);
        }
      }
      return { id: course.id };
    });
  }

  async detail(id: number) {
    const course = await this.prismaService.course.findFirst({ where: { id }, select: CourseDTO.selectFields() });
    if (!course) throw new NotFoundException('Course not found');

    const topics = await this.prismaService.topic.findMany({
      orderBy: { order: 'asc' },
      where: { courseId: course.id },
      select: TopicDTO.selectTopicField(),
    });
    let topcicDTOs: TopicDTO[];

    for (let i = 0; i < topics.length; i++) {
      const lessons = await this.prismaService.lesson.findMany({
        orderBy: { order: 'asc' },
        where: { topicId: topics[i].id },
        select: LessonDTO.selectLessonField(),
      });
      topcicDTOs.push(
        TopicDTO.fromEntity(
          topics[i],
          lessons.map((lesson) => LessonDTO.fromEntity(lesson)),
        ),
      );
    }

    return CourseDTO.fromEnTity(course as any, topcicDTOs);
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