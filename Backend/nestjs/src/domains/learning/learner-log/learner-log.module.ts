import { Module } from '@nestjs/common';
import { LearnerLogService } from './learner-log.service';
import { LearnerLogController } from './learner-log.controller';
import { AuthModule } from 'src/domains/auth/auth.module';
import { PrismaModule } from 'src/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [LearnerLogService],
  controllers: [LearnerLogController],
})
export class LearnerLogModule {}
