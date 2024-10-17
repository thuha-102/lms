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

      let numberLessons = 0,
        numberTopics = body.topicNames.length;

      for (let i = 0; i < body.topicNames.length; i++) {
        const { id } = await this.topicService.create(
          {
            courseId: course.id,
            name: body.topicNames[i],
            totalLessons: i < body.lessons.length ? body.lessons[i].length : 0,
          } as any,
          tx,
          i,
        );

        if (i < body.lessons.length) {
          for (let j = 0; j < body.lessons[i].length; j++) {
            const lesson = body.lessons[i][j];
            await this.lessonService.create({ order: j, title: lesson.title, fileId: lesson.fileId, topicId: id }, tx, j);
          }
          numberLessons += body.lessons[i].length;
        }
      }

      await tx.course.update({ where: { id: course.id }, data: { totalLessons: numberLessons, totalTopics: numberTopics } });
      return { id: course.id };
    });
  }

  async detail(id: number, userId?: number) {
    const course = await this.prismaService.course.findFirst({ where: { id }, select: CourseDTO.selectFields() });
    if (!course) throw new NotFoundException('Course not found');

    const topics = await this.prismaService.topic.findMany({
      orderBy: { order: 'asc' },
      where: { courseId: course.id },
      select: TopicDTO.selectTopicField(),
    });
    let topcicDTOs: TopicDTO[] = [];

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

    if (userId) {
      const registered = await this.prismaService.registerCourse.findFirst({ where: { learnerId: userId, courseId: id } });
      const inCart = await this.prismaService.cart.findFirst({where: {learnerId: userId, courseId: id}});
      return {
        ...CourseDTO.fromEnTity(course as any, topcicDTOs),
        registered: registered ? true : false,
        inCart: inCart ? true : false
      };
    }

    return CourseDTO.fromEnTity(course as any, topcicDTOs);
  }

  async studiedCourse(courseId: number, learnerId: number) {
    const lessonIds = (
      await this.prismaService.topic.findMany({ where: { courseId }, select: { Lessons: { select: { id: true } } } })
    )
      .map((topic) => topic.Lessons.map((lesson) => lesson.id))
      .flat(1);

    const studiedLesson = (
      await this.prismaService.historyStudiedCourse.findMany({
        where: { learnerId: learnerId, lessonId: { in: lessonIds } },
      })
    ).map((history) => history.lessonId);

    return { studiedLesson: studiedLesson };
  }

  async getAll(query: CourseListREQ) {
    const condition = CourseListREQ.toCondition(query);
    const courses = await this.prismaService.course.findMany({
      orderBy: {
        id: 'asc',
      },
      where: query.keyword ? condition : undefined,
      select: CourseListDTO.selectFields(),
    });

    return courses.map((c) => CourseListDTO.fromEntity(c as any));
  }

  async update(id: number, body: CourseUpdateREQ) {
    const course = await this.prismaService.course.findFirst({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    //update order of topicIds
    if (body.orderTopicIds) {
      body.orderTopicIds.map(async (id, index) => {
        await this.prismaService.topic.update({ where: { id }, data: { order: index } });
      });
    }
    if (body.orderLessonIds) {
      for (let i = 0; i < body.orderLessonIds.length; i++) {
        const lessonIds = body.orderLessonIds[i];
        lessonIds.map(async (id, index) => await this.prismaService.lesson.update({ where: { id }, data: { order: index } }));
      }
    }

    await this.prismaService.course.update({ where: { id }, data: CourseUpdateREQ.toUpdateInput(body) });
  }

  async delete(id: number) {
    await this.prismaService.course.delete({ where: { id } });
  }
}
