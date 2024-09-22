import { Module } from '@nestjs/common';
import { IntroQuestionService } from './introQuestion.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { IntroQuestionController } from './introQuestion.controller';

@Module({
  imports: [PrismaModule],
  providers: [IntroQuestionService],
  controllers: [IntroQuestionController],
})
export class IntroQuestionModule {}
