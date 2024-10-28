import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntroQuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.IntroQuestionUncheckedCreateInput) {
    return await this.prismaService.introQuestion.create({
      data: data,
      select: {
        id: true,
        question: true,
        answers: true,
        scores: true,
      },
    });
  }

  async getMany(criteria) {
    return await this.prismaService.introQuestion.findMany({
      where: criteria,
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        question: true,
        answers: true,
        scores: true,
      },
    });
  }

  async getOne(criteria) {
    return await this.prismaService.introQuestion.findFirst({
      where: criteria,
    });
  }

  async updateOne(id: number, data: Prisma.IntroQuestionUncheckedUpdateInput) {
    return await this.prismaService.introQuestion.update({
      where: { id: id },
      data: data,
      select: {
        id: true,
        question: true,
        answers: true,
        scores: true,
      },
    });
  }

  async deleteOne(id: number) {
    return await this.prismaService.introQuestion.delete({
      where: { id: id },
    });
  }

  async updateMany(criteria, data: Prisma.IntroQuestionUncheckedUpdateInput) {
    return await this.prismaService.introQuestion.updateMany({
      where: criteria,
      data: data,
    });
  }

  async getTypeLearner(score: number) {
    const result = await this.prismaService.typeLearner.findMany({
      where: {
        startScore: {
          lte: score,
        },
      },
      orderBy: {
        startScore: 'desc',
      },
      select: {
        id: true,
      },
    });
    return result[0];
  }

  async registerSequenceCourse(learnerId: number, typeLearnerId: number, latestCourseInSequenceId: number) {
    return await this.prismaService.learner.update({
      where: {
        id: learnerId,
      },
      data: {
        typeLearnerId: typeLearnerId,
        latestCourseInSequenceId: latestCourseInSequenceId,
      },
    });
  }
}
