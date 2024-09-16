import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StatementService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.StatementUncheckedCreateInput) {
    return await this.prismaService.statement.create({
      data: data,
    });
  }

  async getOne(id: number) {
    return await this.prismaService.statement.findFirst({
      where: { id: id },
    });
  }

  async updateOne(id: number, data: Prisma.StatementUncheckedUpdateInput) {
    return await this.prismaService.statement.update({
      where: {
        id: id,
      },
      data: data,
    });
  }
}
