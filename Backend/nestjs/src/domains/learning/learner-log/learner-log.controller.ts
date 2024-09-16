import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LearnerLogService } from './learner-log.service';
import { AuthGuard } from 'src/domains/auth/auth.guard';
import { LearnerLogCreateREQ } from './request/learner-log-create.request';

// @UseGuards(AuthGuard)
@Controller('learner-logs')
export class LearnerLogController {
  constructor(private readonly learnerLogService: LearnerLogService) {}

  @Post('batch')
  async createBatch(@Body() body: LearnerLogCreateREQ[]) {
    await this.learnerLogService.createBatch(body);
  }

  @Post(':learnerId')
  async create(@Param('learnerId', ParseIntPipe) learnerId: number, @Body() body: LearnerLogCreateREQ) {
    return await this.learnerLogService.create(learnerId, body);
  }

  @Get(':learnerId')
  async detail(@Param('learnerId', ParseIntPipe) learnerId: number, @Query('lmId') lmId: number) {
    return await this.learnerLogService.detail(learnerId, lmId);
  }

  @HttpCode(204)
  @Patch(':logId')
  async updateLog(@Param('logId', ParseIntPipe) id: number, @Body() body: { rating: number }) {
    return await this.learnerLogService.update(id, body.rating);
  }
}
