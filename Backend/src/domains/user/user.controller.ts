import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateREQ } from './request/user-update.request';

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
