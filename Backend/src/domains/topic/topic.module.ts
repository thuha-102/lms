import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
