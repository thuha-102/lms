import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntroQuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.IntroQuestionsUncheckedCreateInput) {
    return await this.prismaService.introQuestions.create({
      data: data,
    });
  }

  async getMany(criteria) {
    return await this.prismaService.introQuestions.findMany({
      where: criteria,
    });
  }

  async updateOne(id: number, data: Prisma.IntroQuestionsUncheckedUpdateInput) {
    return await this.prismaService.introQuestions.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteOne(id: number) {
    return await this.prismaService.introQuestions.delete({
      where: { id: id },
    })
  };
}
