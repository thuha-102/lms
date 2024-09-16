import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModelVariationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ModelVariationUncheckedCreateInput) {
    return await this.prismaService.modelVariation.create({
      data: data,
    });
  }

  async updateOne(id: number, data: Prisma.ModelVariationUncheckedUpdateInput) {
    return await this.prismaService.modelVariation.update({
      where: { id: id },
      data: data,
    });
  }
}
