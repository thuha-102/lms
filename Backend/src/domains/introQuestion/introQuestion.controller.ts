import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { IntroQuestionService } from './introQuestion.service';
import * as IntroQuestionDto from './dto/introQuestion.dto';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('introQuestion')
export class IntroQuestionController {
  constructor(private readonly introQuestionService: IntroQuestionService) {}

  @Post()
  async create(@Body() body: IntroQuestionDto.IntroQuestionCreateRequestDto) {
    try {
      const result = await this.introQuestionService.create(body);
      return JSON.stringify(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  async getMany(@Query() queryParams) {
    try {
      const { searchString } = queryParams;
      const result = await this.introQuestionService.getMany(searchString ? {OR: [
        { question: {contains: searchString, mode: 'insensitive'} },
        { answers: {hasSome: [searchString ] }},
      ]} : {});
      return JSON.stringify(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: IntroQuestionDto.IntroQuestionUpdateRequestDto) {
    try {
      const result = await this.introQuestionService.updateOne(id, body);
      if (result == null) {
        throw new NotFoundException(`IntroQuestion with id ${id} not found`);
      }
      return JSON.stringify(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.introQuestionService.deleteOne(id);
      if (result == null) {
        throw new NotFoundException(`IntroQuestion with id ${id} not found`);
      }
      return JSON.stringify(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
