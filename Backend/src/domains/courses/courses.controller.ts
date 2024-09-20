import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CourseCreateREQ } from './request/courses-create.request';
import { CourseUpdateREQ } from './request/courses-update.request';
import { CourseListREQ, CourseOwnListREQ } from './request/courses-list.request';

@Controller('courses')
export class CourseController {
  constructor(public readonly courseService: CourseService) {}

  @Post('')
  async create(@Body() body: CourseCreateREQ) {
    return await this.courseService.create(body);
  }

  @Get(':id/own')
  async ownCourse(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.ownCourse(id);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.detail(id);
  }

  @Get('')
  async getAll(@Body() query: CourseListREQ) {
    return await this.courseService.getAll(query);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: CourseUpdateREQ) {
    await this.courseService.update(id, body);
  }
}
