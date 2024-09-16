import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LearningMaterialModule } from './learning-material/learning-material.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { LearnerLogModule } from './learner-log/learner-log.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaService, AuthModule, LearningMaterialModule, LearningPathModule, LearnerLogModule],
})
export class LearningModule {}
