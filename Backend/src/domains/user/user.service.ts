import { ConflictException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserCreateREQ } from './request/user-create.request';
import { AccountType, SubjectType } from '@prisma/client';
import { UserLearnerDTO } from './dto/user-learner.dto';
import { UserInfoDTO } from './dto/user-infomation.dto';
import { PaginationREQ } from 'src/shared/pagination.request';
import { UserUpdateREQ } from './request/user-update.request';
import * as bcrypt from 'bcrypt';
import { UserRegisterCourseCreateREQ } from './request/user-register-course-create.request';
import { LearnerHistoryCourseCreateREQ } from './request/learner-history-course-create.request';
import { LearnerHistoryCourseUpdateREQ } from './request/learner-history-course-update.request';
import { register } from 'module';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: UserCreateREQ) {
    body.password = await bcrypt.hash(body.password, 10);
    const existUser = await this.prismaService.authenticatedUser.findFirst({ where: { username: body.username } });
    if (existUser) throw new ConflictException('User already exists', { cause: HttpStatus.CONFLICT });

    this.prismaService.$transaction(async (tx) => {
      const user = await tx.authenticatedUser.create({
        data: UserCreateREQ.toCreateInput(body),
      });

      if (body.accountType === AccountType.LEARNER) {
        await tx.learner.create({
          data: UserLearnerDTO.toCreateInput(user.id, body.learningStyleQA, body.backgroundKnowledge, body.qualification),
        });
      }

      return UserInfoDTO.fromEntity(user as any);
    });
  }

  async createBatch(body: UserCreateREQ[]) {
    body.map(async (user) => await this.create(user));
  }

  async detail(id: number) {
    const user = await this.prismaService.authenticatedUser.findUniqueOrThrow({
      where: { id },
      include: { Course: true, Learner: true },
    });
    const registeCourseIds = (
      await this.prismaService.registerCourse.findMany({ where: { learnerId: user.id }, select: { courseId: true } })
    ).map((register) => register.courseId);
    return UserInfoDTO.fromEntity(user as any, registeCourseIds);
  }

  async findAll(query: PaginationREQ) {
    const users = await this.prismaService.authenticatedUser.findMany({
      ...PaginationREQ.paging(query),
      select: UserInfoDTO.selectUser(),
    });

    return users.map((user) => UserInfoDTO.fromEntity(user));
  }

  async update(id: number, body: UserUpdateREQ) {
    return await this.prismaService.authenticatedUser.update({
      where: { id },
      data: UserUpdateREQ.toUpdateInput(body),
    });
  }

  async updateStyle(id: number, learningStyleQA: string[]) {
    const style = UserLearnerDTO.learningStyle(learningStyleQA);

    await this.prismaService.learner.update({
      where: { id },
      data: {
        activeReflective: style.activeReflective,
        sensitiveIntuitive: style.sensitiveIntuitive,
        visualVerbal: style.visualVerbal,
        sequentialGlobal: style.sequentialGlobal,
      },
    });
  }

  async getBaseInfo(learnerId: number) {
    const learner = await this.prismaService.learner.findFirstOrThrow({
      where: { id: learnerId },
      select: {
        activeReflective: true,
        sensitiveIntuitive: true,
        visualVerbal: true,
        sequentialGlobal: true,
        backgroundKnowledge: true,
        qualification: true,
      },
    });

    return {
      learningStyle: [learner.activeReflective, learner.sensitiveIntuitive, learner.visualVerbal, learner.sequentialGlobal],
      backgroundKnowledge: learner.backgroundKnowledge,
      qualification: learner.qualification,
    };
  }

  async registerCourse(learnerId: number, courseId: number) {
    const existRegister = await this.prismaService.registerCourse.findFirst({
      where: { learnerId: learnerId, courseId: courseId },
    });
    if (existRegister) throw new ConflictException('You have already registered this course');

    const register = await this.prismaService.registerCourse.create({
      data: UserRegisterCourseCreateREQ.toCreateInput(learnerId, courseId),
      select: { id: true },
    });

    await this.prismaService.historyOfCourse.create({
      data: LearnerHistoryCourseCreateREQ.toCreateInput({ learnerId, courseId }),
    });

    return { id: register.id };
  }

  async updateHistoryOfCourse(learnerId: number, courseId: number, body: LearnerHistoryCourseUpdateREQ) {
    const lessons = (
      await this.prismaService.course.findFirst({ where: { id: courseId }, select: { Lesson: { select: { id: true } } } })
    ).Lesson.map((l) => l.id).sort();
    if (!lessons.includes(body.lessonId)) throw new NotFoundException('Can not find a suitable lesson');

    const register = await this.prismaService.registerCourse.findFirst({ where: { learnerId: learnerId, courseId: courseId } });
    if (!register) throw new ConflictException('Learner doese not register this course');

    const percentComplete = Math.round((lessons.findIndex((id) => id === body.lessonId) * 100) / lessons.length);

    await this.prismaService.historyOfCourse.update({
      where: { learnerId_courseId: { learnerId, courseId } },
      data: LearnerHistoryCourseUpdateREQ.toUpdateInput(body, percentComplete),
    });
  }

  async getAllCourses(learnerId: number, take: number) {
    const courses = await this.prismaService.historyOfCourse.findMany({
      ...(take && { take: take }),
      where: { learnerId: learnerId, course: { visibility: true } },
      orderBy: { lastestStudyTime: 'desc' },
      select: {
        lastestLessonMinuteComplete: true,
        lastestLesson: { select: { id: true, title: true, amountOfTime: true } },
        course: { select: { id: true, name: true, description: true, amountOfTime: true, visibility: true } },
      },
    });
    return courses;
  }
}
