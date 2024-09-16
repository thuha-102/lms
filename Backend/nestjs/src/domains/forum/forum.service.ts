import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { connectRelation } from 'src/shared/prisma.helper';

@Injectable()
export class ForumService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ForumUncheckedCreateInput) {
    return await this.prismaService.forum.create({
      data: data,
    });
  }

  async getMany(criteria) {
    return await this.prismaService.forum.findMany({
      where: criteria,
      select: {
        id: true,
        title: true,
        label: true,
        shortDescription: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        coverImageType: true,
        readTimes: true,
      },
    });
  }

  async getOne(id: number) {
    const forum = await this.prismaService.forum.findFirst({
      where: { id: id },
      include: { statements: true },
    });

    const todayAccess = await this.prismaService.historyAccessForum.findMany({
      orderBy: { createdAt: 'desc' },
      where: { forumId: id },
      select: { createdAt: true },
    });

    if (todayAccess.length === 0) await this.prismaService.historyAccessForum.create({ data: { Forum: connectRelation(id) } });
    else if (
      todayAccess[0].createdAt.getDate() === new Date().getDate() &&
      todayAccess[0].createdAt.getMonth() === new Date().getMonth() &&
      todayAccess[0].createdAt.getFullYear() === new Date().getFullYear()
    ) {
      await this.prismaService.historyAccessForum.update({
        where: { createdAt_forumId: { forumId: id, createdAt: todayAccess[0].createdAt } },
        data: { accessTime: { increment: 1 } },
      });
    } else await this.prismaService.historyAccessForum.create({ data: { Forum: connectRelation(id) } });

    return forum;
  }

  async getAllOwned(userId: number) {
    return await this.prismaService.forum.findMany({
      select: {
        id: true,
        title: true,
        label: true,
        shortDescription: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        coverImageType: true,
        readTimes: true,
      },
      where: { userId: userId },
    });
  }

  async updateOne(id: number, data: Prisma.ForumUncheckedUpdateInput) {
    return await this.prismaService.forum.update({
      where: { id: id },
      data: data,
    });
  }
}
