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
      include: {
        Course: {
          select: { id: true, name: true, createdAt: true, updatedAt: true, description: true },
        },
      },
      orderBy: orderBy,
    });
  }

  async deleteMany(criteria) {
    return await this.prismaService.sequenceCourse.deleteMany({
      where: criteria,
    });
  }
}
