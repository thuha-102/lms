import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { TopicController } from './topics.controller';
import { TopicService } from './topics.service';

@Module({
  imports: [PrismaModule],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopiceModule {}
