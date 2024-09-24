import { Module } from '@nestjs/common';
import { TypeLearnerController } from './typeLearner.controller';
import { TypeLearnerService } from './typeLearner.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TypeLearnerService],
  controllers: [TypeLearnerController],
})
export class SequenceCoursesModule {}
