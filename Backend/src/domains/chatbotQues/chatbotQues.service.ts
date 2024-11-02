import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ChatbotQuesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(ques: string) {
    return await this.prismaService.chatbotQuestion.create({
      data: {
        question: ques
      }
    })
  }

  async getCommonQues(limit: number) {
    return (await this.prismaService.chatbotQuestion.groupBy({
      by: ['question'],
      _count: {
        question: true,
      },
      _max: {
        createdAt: true,
      },
      orderBy: [
        {
          _count: {
            question: 'desc',
          },
        },
        {
          _max: {
            createdAt: 'desc',
          },
        },
      ],
    })).slice(0, limit);
  }

  async getChatbotUsedRate(days: number) {
    return await this.prismaService.chatbotQuestion.count({
      where: {
        createdAt: {
          gte: new Date( new Date().getDate() - days )
        }
      }
    })
  }
}
