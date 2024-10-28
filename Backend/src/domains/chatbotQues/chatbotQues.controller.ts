import { Controller, Get, Body, Post, Query } from '@nestjs/common';
import { ChatbotQuesService } from './chatbotQues.service';
import { DatetimeService } from 'src/services/datetime/datetime.service';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('chatbot-ques')
export class ChatbotQuesController {
  constructor(private readonly chatbotQuesService: ChatbotQuesService) {}

  @Post()
  async getCourseChatbotQues(@Body() body: { question: string }) {
    try {
      const result = await this.chatbotQuesService.create(body.question);
      return JSON.stringify(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/common-ques')
  async getCommonQues(@Query() queryParams) {
    try {
      const { limit } = queryParams;
      const result = await this.chatbotQuesService.getCommonQues(limit);
      return JSON.stringify(result.map(q => ({question: q.question})))
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/used-rate')
  async getChatbotUsedRate(@Query() queryParams) {
    try {
      const { days } = queryParams;
      const result = await this.chatbotQuesService.getChatbotUsedRate(days);
      return JSON.stringify( {
        rate: result
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
