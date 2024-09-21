import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Learner } from '@prisma/client';
import { UserCreateREQ } from './request/user-create.request';

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: UserCreateREQ) {
    return await this.userService.create(body);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UserCreateREQ) {
    return await this.userService.update(id, body);
  }

  @Post(':id/register/:courseId')
  async registerCourse(@Param('id', ParseIntPipe) id: number, @Param('courseId', ParseIntPipe) courseId: number) {
    return await this.userService.registerCourse(id, courseId);
  }
}
