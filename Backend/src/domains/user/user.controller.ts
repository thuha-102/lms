import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateREQ } from './request/user-create.request';
import { PaginationREQ } from 'src/shared/pagination.request';
import { UserUpdateREQ } from './request/user-update.request';
import { AuthGuard } from '../auth/auth.guard';
import { Learner, SubjectType } from '@prisma/client';
import { UserRegisterCourseCreateREQ } from './request/user-register-course-create.request';
import { LearnerHistoryCourseUpdateREQ } from './request/learner-history-course-update.request';

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':learnerId/courses')
  async registerCourse(@Param('learnerId', ParseIntPipe) learnerId: number, @Body() body: UserRegisterCourseCreateREQ) {
    return await this.userService.registerCourse(learnerId, Number(body.courseId));
  }

  @Patch(':learnerId/courses/:courseId')
  async updateHistoryOfCourse(
    @Param('learnerId', ParseIntPipe) learnerId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() body: LearnerHistoryCourseUpdateREQ,
  ) {
    await this.userService.updateHistoryOfCourse(learnerId, courseId, body);
  }

  @Post()
  async create(@Body() body: UserCreateREQ) {
    await this.userService.create(body);
  }

  @Post('batch')
  async createBatch(@Body() body: UserCreateREQ[]) {
    await this.userService.createBatch(body);
  }

  @Get()
  async findAll(@Query() query: PaginationREQ) {
    return await this.userService.findAll(query);
  }

  @Get('base-information/:learnerId')
  async getBaseInfo(@Param('learnerId', ParseIntPipe) learnerId: number) {
    return await this.userService.getBaseInfo(learnerId);
  }

  @Get('profile')
  async profile(@Req() req: any) {
    return req.user;
  }

  @Put('learning-style')
  async updateStyle(@Req() req: any, @Body() body: { learningStyleQA: string[] }) {
    return await this.userService.updateStyle(req.user.id, body.learningStyleQA);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.detail(id);
  }

  @Get(':id/courses')
  async getAllCourses(@Param('id', ParseIntPipe) id: number, @Query() query: { take: number }) {
    return await this.userService.getAllCourses(id, Number(query?.take));
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UserUpdateREQ) {
    return await this.userService.update(id, body);
  }
}
