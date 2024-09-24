import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserUpdateREQ } from './request/user-update.request';
import { UserRegisterCourseCreateREQ } from './request/user-register-course-create.request';
import { connectRelation } from 'src/shared/prisma.helper';
import { Prisma } from '@prisma/client';
import { LearnerListREPS } from './reponse/learner-list.reponse';
import { UserInfoDTO } from './dto/user-infomation.dto';
import { QuizAnswers } from 'src/services/file/dto/file.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(username?: string) {
    const learners = await this.prismaService.learner.findMany({
      where: { User: { username: { contains: username ? username : '' } } },
      select: { id: true, User: { select: { username: true, createdAt: true } }, TypeLearner: { select: { name: true } } },
    });

    return learners.map((learner) => LearnerListREPS.fromEntity(learner as any));
  }

  async detail(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, username: true, accountType: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const registerCourseIds = (
      await this.prismaService.registerCourse.findMany({ where: { learnerId: user.id }, select: { courseId: true } })
    ).map((register) => register.courseId);

    return UserInfoDTO.fromEntity(user as any, registerCourseIds);
  }

  async update(id: number, body: UserUpdateREQ) {
    if (body.username) {
      const existUser = await this.prismaService.user.findFirst({ where: { username: body.username } });
      if (existUser) throw new ConflictException('Username is exist');
    }

    await this.prismaService.user.update({ where: { id }, data: UserUpdateREQ.toUpdateInput(body) });
    return;
  }

  async registerCourse(learnerId: number, courseId: number) {
    return await this.prismaService.$transaction(async (tx) => {
      try {
        return await this.prismaService.registerCourse.create({
          data: UserRegisterCourseCreateREQ.toCreateInput(learnerId, courseId),
        });
      } catch (e) {
        return e;
      }
    });
  }

  async historyQuiz(learnerId: number, quizId: number) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.prismaService.historyStudiedQuiz.findMany({
        orderBy: { createdAt: 'desc' },
        where: { learningMaterialId: quizId },
        select: { createdAt: true, score: true, totalQuestion: true },
      });
    });
  }

  async studiedQuiz(learnerId: number, quizAnswers: QuizAnswers, tx) {
    const question = await tx.quiz.findMany({
      orderBy: { index: 'asc' },
      where: { id: quizAnswers.quizId },
      select: { correctAnswer: true },
    });
    if (question.length !== quizAnswers.answers.length)
      throw new ConflictException('Answers length is difference from quizes length');

    const historyQuizId = (await tx.historyStudiedQuiz.create({
      data: { Learner: connectRelation(learnerId), LearningMaterail: connectRelation(quizAnswers.quizId) },
      select: { id: true },
    })).id;

    let trueAnswer = 0;
    for (let i = 0; i < question.length; i++) {
      if (question[i].correctAnswer === quizAnswers.answers[i]) trueAnswer++;

      const data: Prisma.ResultOfStudyingQuizCreateInput = {
        HistoryStudiedQuiz: connectRelation(historyQuizId),
        Quiz: { connect: { id_index: { id: quizAnswers.quizId, index: i } } },
        answer: quizAnswers.answers[i],
      };
      await tx.resultOfStudyingQuiz.create({ data });
    }

    await tx.historyStudiedQuiz.update({
      where: { id: historyQuizId },
      data: { score: trueAnswer, totalQuestion: question.length },
    });
    return trueAnswer;
  }

  async studiedLesson(learnerId: number, lessonId: number, quizAnswers: QuizAnswers) {
    return await this.prismaService.$transaction(async (tx) => {
      try {
        let trueAnswer;
        if (quizAnswers) 
          trueAnswer = this.studiedQuiz(learnerId, quizAnswers, tx);

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
        const historyStudied = await tx.historyStudiedCourse.findFirst({ where: { lessonId, learnerId } });
        if (!historyStudied) await tx.historyStudiedCourse.create({ data: { learnerId, lessonId } });

        const updatePercent = historyStudied
          ? registerCourse.percentOfStudying
          : Math.min(1.0, registerCourse.percentOfStudying + 1.0 / course.totalLessons);
        await tx.registerCourse.update({
          where: { id: registerCourse.id },
          data: { percentOfStudying: updatePercent },
        });

        const learner = await tx.learner.findFirst({
          where: { id: learnerId },
          select: { typeLearnerId: true },
        });

        // register next course in sequence course if pass previous course
        const sequenceCourse = await tx.sequenceCourse.findMany({
          orderBy: { order: 'asc' },
          where: { typeLearnerId: learner.typeLearnerId ? learner.typeLearnerId : -1 },
          select: { courseId: true, order: true },
        });

        if (sequenceCourse.length !== 0 && updatePercent - 1.0 >= 0) {
          let nextCourseId = -1;
          for (let i = 1; i < sequenceCourse.length; i++) {
            if (sequenceCourse[i - 1].courseId === course.id) {
              nextCourseId = sequenceCourse[i].courseId;
              break;
            }
          }
          if (nextCourseId !== -1) {
            await tx.registerCourse.create({ data: { learnerId: learnerId, courseId: nextCourseId } });
            await tx.learner.update({
              where: { id: learnerId },
              data: { LatestCourseInSequenceCourses: connectRelation(nextCourseId) },
            });
          }
        }

        if (quizAnswers) return { trueAnswer: await trueAnswer, totalQuestion: quizAnswers.answers.length };
      } catch (e) {
        return e;
      }
    });
  }

  async ownCourse(filter?: string, visibility?: boolean) {
    let orQuery: Prisma.CourseWhereInput[] = [
      filter ? { name: { contains: filter, mode: Prisma.QueryMode.insensitive } } : undefined,
      filter ? { labels: { has: filter } } : undefined,
      visibility !== undefined ? { visibility: { equals: visibility } } : undefined,
    ].filter(Boolean);

    return await this.prismaService.course.findMany({
      where: orQuery.length ? { OR: orQuery } : undefined,
      select: {
        id: true,
        name: true,
        price: true,
        amountOfTime: true,
        description: true,
        avatarId: true,
      },
    });
  }

  async studiedCourse(learnerId: number, keyword?: string) {
    const registeredIds = (
      await this.prismaService.registerCourse.findMany({ where: { learnerId }, select: { courseId: true } })
    ).map((register) => register.courseId);
    let orQuery: Prisma.CourseWhereInput[] = [
      keyword ? { name: { contains: keyword, mode: Prisma.QueryMode.insensitive } } : undefined,
      keyword ? { labels: { has: keyword } } : undefined,
    ].filter(Boolean);

    return await this.prismaService.course.findMany({
      where: orQuery.length ? { OR: orQuery, id: { in: registeredIds } } : { id: { in: registeredIds } },
      select: {
        id: true,
        name: true,
        price: true,
        amountOfTime: true,
        description: true,
        avatarId: true,
      },
    });
  }
}
