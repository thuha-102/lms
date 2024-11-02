import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly prismaService = new PrismaService();

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async statisticsLearningMaterial() {
    const learningMaterials = await this.prismaService.learningMaterial.findMany({ select: { id: true, Lesson: true } });
    const updatePromises = learningMaterials.map((lesson): Promise<any> => {
      return this.prismaService.learningMaterial.update({ where: { id: lesson.id }, data: { usedCount: lesson.Lesson.length } });
    });
    await Promise.all(updatePromises);

    this.logger.debug('Usage Statistics for Learning Materials');
  }
}
