import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserUpdateREQ } from './request/user-update.request';
import { UserRegisterCourseCreateREQ } from './request/user-register-course-create.request';
import { connectRelation } from 'src/shared/prisma.helper';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(id: number, body: UserUpdateREQ) {
    if (body.username) {
      const existUser = await this.prismaService.user.findFirst({ where: { username: body.username } });
      if (existUser) throw new ConflictException('Username is exist');
    }

    await this.prismaService.user.update({ where: { id }, data: UserUpdateREQ.toUpdateInput(body) });
    return;
  }

  async registerCourse(learnerId: number, courseId: number) {
    return await this.prismaService.registerCourse.create({
      data: UserRegisterCourseCreateREQ.toCreateInput(learnerId, courseId),
    });
  }

  async studiedLesson(learnerId: number, lessonId: number) {
    return await this.prismaService.$transaction(async (tx) => {
      const lesson = await tx.lesson.findFirst({ where: { id: lessonId }, select: { topicId: true } });
      const course = await tx.course.findFirst({
        where: { Topic: { some: { id: lesson.topicId } } },
        select: { id: true, totalLessons: true },
      });

      const registerCourse = await tx.registerCourse.findFirst({
        where: { learnerId: learnerId, courseId: course.id },
        select: { id: true, percentOfStudying: true },
      });
      if (!registerCourse) throw new NotFoundException("Learner didn't regiter this course");
      const updatePercent = Math.min(1.0, registerCourse.percentOfStudying + 1.0 / course.totalLessons);
      await tx.registerCourse.update({
        where: { id: registerCourse.id },
        data: { percentOfStudying: updatePercent },
      });

      const learner = await tx.learner.findFirst({
        where: { id: learnerId }
      })

      // register next course in sequence course if pass previous course
      const sequenceCourse = await tx.sequenceCourse.findMany({
        orderBy: { order: 'asc' },
        where: { typeLearnerId: learner.typeLearnerId },
        select: { courseId: true, order: true },
      });
      if (updatePercent - 1.0 >= 0) {
        let nextCourseId = -1;
        for (let i = 1; i < sequenceCourse.length; i++)
          if (sequenceCourse[i - 1].courseId === course.id) {
            nextCourseId = sequenceCourse[i].courseId;
            break;
          }
        if (nextCourseId !== -1) {
          await tx.registerCourse.create({ data: { learnerId: learnerId, courseId: nextCourseId } });
          await tx.learner.update({
            where: { id: learnerId },
            data: { LatestCourseInSequenceCourses: connectRelation(nextCourseId) },
          });
        }
      }

      const historyStudied = await tx.historyStudiedCourse.findFirst({ where: { lessonId, learnerId } });
      if (!historyStudied) await tx.historyStudiedCourse.create({ data: { learnerId, lessonId } });
    });
  }
}
