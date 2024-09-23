import {
  Body,
  Controller,
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

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return this.userService.detail(id);
  }
  
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
    return this.userService.studiedCourse(query.keyword);
  }
  
  @Get()
  async getAll(@Query('username') username?: string){
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
}
