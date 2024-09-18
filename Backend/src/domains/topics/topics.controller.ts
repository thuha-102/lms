import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TopicService } from './topics.service';
import { TopicCreateREQ } from './request/topics-create.request';
import { TopicUpdateREQ } from './request/topics-update.request';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  async create(@Body() body: TopicCreateREQ) {
    return await this.topicService.create(body);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return await this.topicService.detail(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.topicService.delete(id);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: TopicUpdateREQ) {
    return await this.topicService.update(id, body);
  }
}
