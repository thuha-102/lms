import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateREQ } from './request/user-update.request';
import { query } from 'express';
import { QuizAnswers } from 'src/services/file/dto/file.dto';
import * as UserRatingREQ from './request/user-rating';
import { sequenceEqual } from 'rxjs';

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/courses/own')
  async ownCourse(
    @Param('id', ParseIntPipe) id: number,
    @Query('keyword') keyword?: string,
    @Query('visibility') visibility?: string,
  ) {
    return this.userService.ownCourse(
      keyword,
      visibility ? (visibility === 'VISIBLE' ? true : visibility === 'NON_VISIBLE' ? false : undefined) : undefined,
    );
  }

  @Get(':id/courses/studied')
  async studiedCourse(@Param('id', ParseIntPipe) id: number, @Query() query?: { keyword: string }) {
    return this.userService.studiedCourse(id, query.keyword);
  }

  @Get(':id/history-quiz/:lmId')
  async historyQuiz(@Param('id', ParseIntPipe) id: number, @Param('lmId', ParseIntPipe) lmId: number) {
    return this.userService.historyQuiz(id, lmId);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return this.userService.detail(id);
  }

  @Get()
  async getAll(@Query('username') username?: string) {
    return await this.userService.getAll(username);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UserUpdateREQ) {
    return await this.userService.update(id, body);
  }

  @Post(':id/register/:courseId')
  async registerCourse(@Param('id', ParseIntPipe) id: number, @Param('courseId', ParseIntPipe) courseId: number) {
    return await this.userService.registerCourse(id, courseId);
  }

  @Post(':id/lesson/:lessonId')
  async studiedLesson(@Param('id', ParseIntPipe) id: number, @Param('lessonId', ParseIntPipe) lessonId: number) {
    return await this.userService.studiedLesson(id, lessonId);
  }

  @Post(':id/quiz')
  async studiedQuiz(@Param('id', ParseIntPipe) id: number, @Body() body: QuizAnswers) {
    return await this.userService.studiedQuiz(id, body);
  }

  @Get(':id/cart')
  async getCart(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getCart(id);
  }

  @Post(':id/cart')
  async addCart(@Param('id', ParseIntPipe) id: number, @Body() body: { courseId: number }) {
    return await this.userService.addCart(id, body.courseId);
  }

  @HttpCode(204)
  @Post(':id/cart/delete-batch')
  async deleteCart(@Param('id', ParseIntPipe) id: number, @Body() body: { courseIds: number[] }) {
    return await this.userService.deleteCart(id, body.courseIds);
  }

  @Put(':id/rating-course')
  async updateRatingCourse(@Param('id', ParseIntPipe) id: number, @Body() body: UserRatingREQ.UserRateCourseREQ) {
    return await this.userService.updateRatingCourse(id, body.courseid, { rating: body.rating, comment: body.comment, ratingAt: new Date() })
  }

  @Put(':id/rating-sequence-course')
  async updateRatingSequenceCourse(@Param('id', ParseIntPipe) id: number, @Body() body: UserRatingREQ.UserRateSquenceCourseREQ) {
    return await this.userService.updateRatingSequenceCourse(id, body.rating, body.comment)
  }

  @Put(':id/rating-chatbot')
  async updateRatingChatbot(@Param('id', ParseIntPipe) id: number, @Body() body: UserRatingREQ.UserRateChatbotREQ) {
    return await this.userService.updateRatingChatbot(id, body.rating)
  }
}
