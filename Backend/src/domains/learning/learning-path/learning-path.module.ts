import { PrismaModule } from 'src/services/prisma/prisma.module';
import { LearningPathConttroller } from './learning-path.controller';
import { LearningPathService } from './learning-path.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LearningPathConttroller],
  providers: [LearningPathService],
})
export class LearningPathModule {}
