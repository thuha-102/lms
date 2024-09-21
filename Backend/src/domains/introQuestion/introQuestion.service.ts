import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntroQuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.IntroQuestionUncheckedCreateInput) {
    return await this.prismaService.introQuestion.create({
      data: data,
    });
  }

  async getMany(criteria) {
    return await this.prismaService.introQuestion.findMany({
      where: criteria,
    });
  }

  async updateOne(id: number, data: Prisma.IntroQuestionUncheckedUpdateInput) {
    return await this.prismaService.introQuestion.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteOne(id: number) {
    return await this.prismaService.introQuestion.delete({
      where: { id: id },
    })
  };
}
