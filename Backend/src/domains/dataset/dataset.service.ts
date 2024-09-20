import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DatasetService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.DatasetUncheckedCreateInput) {
    return await this.prismaService.dataset.create({
      data: data,
    });
  }

  async getMany(criteria) {
    return await this.prismaService.dataset.findMany({
      where: {
        OR: criteria
      },
      select: {
        id: true,
        title: true,
        labels: true,
        description: true,
        updatedAt: true,
        userId: true,
        isPublic: true,
        filesType: true,
        votes: true,
        downloadCount: true,
      },
      orderBy: {
        votes: 'desc',
      },
    });
  }

  async getOne(id: number) {
    return await this.prismaService.dataset.findFirst({
      where: { id: id },
      include: {
        notebooks: {
          select: {
            notebookId: true,
          },
        },
      },
    });
  }

  async updateOne(id: number, data: Prisma.DatasetUncheckedUpdateInput) {
    return await this.prismaService.dataset.update({
      where: { id: id },
      data: data,
    });
  }
}
