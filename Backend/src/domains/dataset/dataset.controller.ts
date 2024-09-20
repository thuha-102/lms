import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { DatasetService } from './dataset.service';
import * as DatasetDto from './dto/dataset.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { renameSync } from 'fs';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('dataset')
export class DatasetController {
  constructor(private readonly datasetService: DatasetService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      dest: 'uploads/datasets',
    }),
  )
  async create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: DatasetDto.DatasetCreateRequestDto) {
    console.log(files);
    for (const file of files) {
      if (!file) throw new NotFoundException(`File not found`);
    }
    try {
      if (typeof body.userId === 'string') {
        body.userId = +body.userId;
      }
      if (body.isPublic === 'true') {
        body.isPublic = true;
      }
      if (body.isPublic === 'false') {
        body.isPublic = false;
      }
      const result = await this.datasetService.create({
        ...DatasetDto.DatasetCreateRequestDto.toCreateInput(body),
        filesType: files.map((file) => path.extname(file.originalname)),
      });
      files.map((file, idx) => {
        const newPath = `uploads/datasets/${result.id}_${idx}${path.extname(file.originalname)}`;
        renameSync(file.path, newPath);
      });
      return JSON.stringify(DatasetDto.DatasetResponseDto.fromDataset(result));
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
      const result = await this.datasetService.getMany(Object.entries(queryParams).map(([key, value]) => {
        return { [key]: value };
      }));
      return JSON.stringify(result.map((f) => DatasetDto.DatasetResponseDto.fromDataset({ ...f, detail: null })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('user/:userId')
  async getAllUserOwned(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.datasetService.getMany({ userId: userId });
      return JSON.stringify(result.map((f) => DatasetDto.DatasetResponseDto.fromDataset({ ...f, detail: null })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.datasetService.getOne(id);
      if (result == null) {
        throw new NotFoundException(`Dataset with id ${id} not found`);
      }
      return JSON.stringify(DatasetDto.DatasetResponseDto.fromDataset(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: DatasetDto.DatasetUpdateRequestDto) {
    try {
      const result = await this.datasetService.updateOne(id, DatasetDto.DatasetUpdateRequestDto.toUpdateInput(body));
      if (result == null) {
        throw new NotFoundException(`Dataset with id ${id} not found`);
      }
      return JSON.stringify(DatasetDto.DatasetResponseDto.fromDataset(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
