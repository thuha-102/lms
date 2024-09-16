import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotebookService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.NotebookUncheckedCreateInput) {
    return await this.prismaService.notebook.create({
      data: data,
      include: {
        modelVariations: true,
        datasets: true,
      },
    });
  }

  async getMany(criteria) {
    return await this.prismaService.notebook.findMany({
      where: {
        OR: criteria
      },
      select: {
        id: true,
        title: true,
        labels: true,
        updatedAt: true,
        userId: true,
        isPublic: true,
        votes: true,
      },
      orderBy: {
        votes: 'desc',
      },
    });
  }

  async getOne(id: number) {
    return await this.prismaService.notebook.findFirst({
      where: { id: id },
      include: {
        modelVariations: {
          select: {
            modelVariation: {
              select: {
                id: true,
                slugName: true,
                version: true,
                filesType: true,
                model: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        datasets: {
          select: {
            dataset: {
              select: {
                id: true,
                title: true,
                filesType: true
              }
            }
          },
        },
      },
    });
  }

  async updateOne(id: number, data: Prisma.NotebookUncheckedUpdateInput) {
    return await this.prismaService.$transaction(async (prisma) => {
      data.modelVariations && await prisma.modelVariationsOfNotebooks.deleteMany({
        where: {
          notebookId: id
        }
      })

      data.datasets && await prisma.datasetsOfNotebooks.deleteMany({
        where: {
          notebookId: id
        }
      })

      return await prisma.notebook.update({
        where: { id: id },
        data: data,
        include: {
          modelVariations: {
            select: {
              modelVariation: {
                select: {
                  id: true,
                  slugName: true,
                  version: true,
                  filesType: true,
                  model: {
                    select: {
                      id: true,
                      title: true
                    }
                  }
                }
              }
            }
          },
          datasets: {
            select: {
              dataset: {
                select: {
                  id: true,
                  title: true,
                  filesType: true
                }
              }
            },
          },
        },
      });
    });
  }
}
