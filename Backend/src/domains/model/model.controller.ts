import { Body, Controller, Post, Get, Param, ParseIntPipe, NotFoundException, Put, Query, UseGuards } from '@nestjs/common';
import { ModelService } from './model.service';
import * as ModelDto from './dto/model.dto';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  async create(@Body() body: ModelDto.ModelCreateRequestDto) {
    try {
      const result = await this.modelService.create(ModelDto.ModelCreateRequestDto.toCreateInput(body));
      return JSON.stringify(ModelDto.ModelResponseDto.fromModel(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  async getMany(@Query() queryParams) {
    try {
      if (queryParams.isPublic === 'true') {
        queryParams.isPublic = true;
      }
      if (queryParams.isPublic === 'false') {
        queryParams.isPublic = false;
      }
      if (queryParams.userId) {
        queryParams.userId = +queryParams.userId;
      }
      const result = await this.modelService.getMany(Object.entries(queryParams).map(([key, value]) => {
        return { [key]: value };
      }));
      return JSON.stringify(result.map((f) => ModelDto.ModelResponseDto.fromModel({ ...f, detail: null })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('user/:userId')
  async getAllUserOwned(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.modelService.getMany({ userId: userId });
      return JSON.stringify(result.map((f) => ModelDto.ModelResponseDto.fromModel({ ...f, detail: null })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.modelService.getOne(id);
      if (result == null) {
        throw new NotFoundException(`Model with id ${id} not found`);
      }
      return JSON.stringify(ModelDto.ModelResponseDto.fromModel(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: ModelDto.ModelUpdateRequestDto) {
    try {
      const result = await this.modelService.updateOne(id, ModelDto.ModelUpdateRequestDto.toUpdateInput(body));
      if (result == null) {
        throw new NotFoundException(`Model with id ${id} not found`);
      }
      return JSON.stringify(ModelDto.ModelResponseDto.fromModel(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
