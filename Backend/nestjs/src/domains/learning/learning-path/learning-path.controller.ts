import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { GetRecommendedLearningPathREQ, LearningPathCreateREQ } from './request/learning-path-create.request';
import { AuthGuard } from 'src/domains/auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('learning-path')
export class LearningPathConttroller {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Post('/recommended/:learnerId')
  async getRecommendedOnes(@Param('learnerId', ParseIntPipe) learnerId: number, @Body() body: GetRecommendedLearningPathREQ) {
    const learningPaths = await this.learningPathService.calculateRecommendedOnes(learnerId, body);

    await this.learningPathService.generateGraph(learningPaths, learnerId)

    return learningPaths
  }

  @Post(':learnerId')
  async create(@Param('learnerId', ParseIntPipe) learnerId: number, @Body() body: LearningPathCreateREQ) {
    return await this.learningPathService.create(learnerId, body);
  }

  @Get(':learnerId')
  async detail(@Param('learnerId', ParseIntPipe) learnerId: number) {
    return await this.learningPathService.detail(learnerId);
  }

  @Get('/graph/:learnerId')
  async learningGraph(@Param('learnerId', ParseIntPipe) learnerId: number) {
    return await this.learningPathService.getLearningNodes(learnerId);
  }
}
