import { Controller, Get, Query } from '@nestjs/common';
import { RatingService } from './rating.service';
import { DatetimeService } from 'src/services/datetime/datetime.service';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/course-rating')
  async getCourseRating(@Query() queryParams) {
    try {
      const { courseId } = queryParams;
      const result = await this.ratingService.getCourseRating(courseId);
      return JSON.stringify( {
        rating: result[0]._avg.rating
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/course-comments')
  async getCourseComments(@Query() queryParams) {
    try {
      const { limit } = queryParams;
      const result = await this.ratingService.getCourseComment(limit);
      return JSON.stringify(result.map(c => ({
        comment: c.comment,
        rating: c.rating,
        createdAt: DatetimeService.formatVNTime(c.ratingAt)
      })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/sequence-course-rating')
  async getSequenceCourseRating(@Query() queryParams) {
    try {
      const { typeLearnerId } = queryParams;
      const result = await this.ratingService.getSequenceCourseRating(typeLearnerId);
      return JSON.stringify( {
        rating: result[0]._avg.sequenceCourseRating
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/sequence-course-comments')
  async getSequenceCourseComments(@Query() queryParams) {
    try {
      const { limit } = queryParams;
      const result = await this.ratingService.getSequenceCourseComment(limit);
      return JSON.stringify(result.map(c => ({
        comment: c.sequenceCourseComment,
        rating: c.sequenceCourseRating,
        createdAt: DatetimeService.formatVNTime(c.sequenceCourseRatingAt)
      })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/chatbot-prefered-rate')
  async getChatbotPreferedRate(@Query() queryParams) {
    try {
      const result = await this.ratingService.getAverageChatbotPrefered();
      return JSON.stringify({
        rate: result
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
