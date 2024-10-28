import { Module } from '@nestjs/common';
import { ChatbotQuesController } from './chatbotQues.controller';
import { ChatbotQuesService } from './chatbotQues.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ChatbotQuesService],
  controllers: [ChatbotQuesController],
})
export class ChatbotQuesModule {}
