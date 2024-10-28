import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCourseRating(courseId: number) {
    return await this.prismaService.registerCourse.groupBy({
      by: ['courseId'],
      where: {
        courseId: courseId
      },
      _avg: {
        rating: true
      }
    })
  }

  async getCourseComment(limit: number) {
    return await this.prismaService.registerCourse.findMany({
      take: limit,
      orderBy: {
        ratingAt: 'desc'
      },
      select: {
        rating: true,
        comment: true,
        ratingAt: true
      }
    });
  }

  async getSequenceCourseRating(typeLearnerId: number) {
    return await this.prismaService.learner.groupBy({
      by: ['typeLearnerId'],
      where: {
        typeLearnerId: typeLearnerId
      },
      _avg: {
        sequenceCourseRating: true
      }
    })
  }

  async getSequenceCourseComment(limit: number) {
    return await this.prismaService.learner.findMany({
      take: limit,
      orderBy: {
        sequenceCourseRatingAt: 'desc'
      },
      select: {
        sequenceCourseComment: true,
        sequenceCourseRatingAt: true,
        sequenceCourseRating: true
      }
    });
  }

  async getAverageChatbotPrefered() {
    const preferedNum = await this.prismaService.learner.count({
      where: {
        averageChatbotRating: {
          gte: 3,
          not: null
        }
      }
    })

    const ratingNum = await this.prismaService.learner.count({
      where: {
        averageChatbotRating: {
          not: null
        }
      }
    })

    return preferedNum/ratingNum;
  }
}
