import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicCreateREQ } from './request/topic-create.request';
import { TopicUpdateREQ } from './request/topic-update.request';
import { TopicLinkDeleteREQ } from './request/topic-link-delete.request';
import { AuthGuard } from '../auth/auth.guard';

// @UseGuards(AuthGuard)
@Controller('topics')
export class TopicController {
  constructor(public readonly topicService: TopicService) {}

  @Post()
  async create(@Body() body: TopicCreateREQ) {
    await this.topicService.create(body);
  }

  @Post('batch')
  async createBatch(@Body() body: TopicCreateREQ[]) {
    await this.topicService.createBatch(body);
  }

  @Get()
  async list() {
    return await this.topicService.list();
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return await this.topicService.detail(id);
  }

  @Delete(':id/topic-links')
  async disactiveLink(@Param('id', ParseIntPipe) id: number, @Body() body: TopicLinkDeleteREQ) {
    await this.topicService.disactiveLink(id, body);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: TopicUpdateREQ) {
    await this.topicService.update(id, body);
  }
}
