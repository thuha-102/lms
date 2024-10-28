import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SequenceCoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(data: Prisma.SequenceCourseUncheckedCreateInput[]) {
    return await this.prismaService.sequenceCourse.createMany({
      data: data,
    });
  }

  async getMany(criteria, orderBy) {
    return await this.prismaService.sequenceCourse.findMany({
      where: criteria,
      select: {
        Course: {
          select: { id: true, name: true, createdAt: true, updatedAt: true, description: true, totalLessons: true, amountOfTime: true, avatarId: true},
        },
      },
      orderBy: orderBy,
    });
  }

  async getAll() {
    return await this.prismaService.sequenceCourse.findMany({
      select: {
        typeLearnerId: true,
        TypeLearner: {
          select: {
            createdAt: true,
            updatedAt: true,
            name: true,
            startScore: true,
          }
        },
        Course: {
          select: { id: true, name: true, createdAt: true, updatedAt: true, description: true, totalLessons: true, amountOfTime: true, avatarId: true},
        },
      },
      orderBy: [
        {typeLearnerId: 'asc'},
        {order: 'asc'}
      ],
    });
  }

  async getLearnerStudiedSequenceCoursesInfo(learnerId: number) {
    return await this.prismaService.learner.findFirst({
      where: {
        id: learnerId
      },
      select: {
        typeLearnerId: true,
        latestCourseInSequenceId: true
      }
    })
  }

  async getLearnerStudiedCoursesHistory(learnerId: number, courseIds: number[]) {
    return await this.prismaService.registerCourse.findMany({
      where: {
        AND: {
          learnerId: learnerId,
          courseId: {
            in: courseIds
          }
        }
      },
      select: {
        Course: {
          select: {
            id: true,
          }
        },
        percentOfStudying: true,
      }
    })
  }

  async deleteMany(criteria) {
    return await this.prismaService.sequenceCourse.deleteMany({
      where: criteria,
    });
  }
}
