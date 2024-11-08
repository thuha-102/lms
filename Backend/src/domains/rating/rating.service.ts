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
      },
      where:{
        comment: {
          not: null
        }
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
      },
      where:{
        sequenceCourseComment: {
          not: null
        }
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

  async getAverageCoursePrefered() {
    const result = await this.prismaService.registerCourse.aggregate({
      _avg: {
        rating: true // Tính trung bình của trường rating
      },
      where: {
        rating: {
          not: null // Bỏ qua những bản ghi có rating NULL
        }
      }
    });
  
    // result._avg.rating sẽ trả về giá trị trung bình hoặc null nếu không có bản ghi nào phù hợp
    return result._avg.rating ?? 0;  // Nếu không có bản ghi, trả về 0 hoặc giá trị phù hợp với bạn
  }

  async getAverageSequencePrefered() {
    const result = await this.prismaService.learner.aggregate({
      _avg: {
        sequenceCourseRating: true // Tính trung bình của trường rating
      },
      where: {
        sequenceCourseRating: {
          not: null // Bỏ qua những bản ghi có rating NULL
        }
      }
    });
  
    // result._avg.rating sẽ trả về giá trị trung bình hoặc null nếu không có bản ghi nào phù hợp
    return result._avg.sequenceCourseRating ?? 0;  // Nếu không có bản ghi, trả về 0 hoặc giá trị phù hợp với bạn
  }
}
