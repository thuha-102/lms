import { Module } from '@nestjs/common';
import { IntroQuestionService } from './introQuestion.service';
import {} from './introQuestion.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { IntroQuestionController } from './introQuestion.controller';

@Module({
  imports: [PrismaModule],
  providers: [IntroQuestionService],
  controllers: [IntroQuestionController],
})
export class IntroQuestionModule {}
