import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { LessonService } from './lessons.service';
import { LessonCreateREQ } from './request/lessons-create.request';
import { LessonUpdateREQ } from './request/lessons-update.request';

@Controller('lessons')
export class LessonController {
  constructor(public readonly lessonService: LessonService) {}

  @Post('')
  async create(@Body() body: LessonCreateREQ) {
    return await this.lessonService.create(body);
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.lessonService.detail(id);
  }

  @Patch('order')
  @HttpCode(204)
  async updateOrder(@Body() body: { lessonIds: number[] }) {
    await this.lessonService.updateOrder(body.lessonIds);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: LessonUpdateREQ) {
    await this.lessonService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.lessonService.delete(id);
  }
}
