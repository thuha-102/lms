import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { TopicController } from './topics.controller';
import { TopicService } from './topics.service';
import { LessonModule } from '../lessons/lessons.module';

@Module({
  imports: [PrismaModule, LessonModule],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
