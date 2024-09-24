import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TypeLearnerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.TypeLearnerUncheckedCreateInput) {
    return await this.prismaService.typeLearner.create({
      data: data,
    });
  }

  async getMany() {
    return await this.prismaService.typeLearner.findMany();
  }

  async getOne(criteria) {
    return await this.prismaService.typeLearner.findFirst({
      where: criteria,
    });
  }

  async updateOne(id: number, data: Prisma.TypeLearnerUncheckedUpdateInput) {
    return await this.prismaService.typeLearner.update({
      where: { id: id },
      data: data,
    });
  }

  async delete(id: number) {
    return await this.prismaService.typeLearner.delete({
      where: { id: id },
    });
  }
}
