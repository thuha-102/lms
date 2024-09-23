import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CourseCreateREQ } from './request/courses-create.request';
import { CourseUpdateREQ } from './request/courses-update.request';
import { CourseListREQ } from './request/courses-list.request';

@Controller('courses')
export class CourseController {
  constructor(public readonly courseService: CourseService) {}

  @Post('')
  async create(@Body() body: CourseCreateREQ) {
    return await this.courseService.create(body);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.detail(id);
  }

  @Get(':id/user/:userId')
  async studiedCourse(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
    return await this.courseService.studiedCourse(id, userId);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: CourseUpdateREQ) {
    await this.courseService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.courseService.delete(id);
  }

  @Get('')
  async getAll(@Query() query: CourseListREQ) {
    return await this.courseService.getAll(query);
  }
}
