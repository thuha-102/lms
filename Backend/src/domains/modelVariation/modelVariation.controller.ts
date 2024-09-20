import {
  Body,
  Controller,
  Post,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ModelVariationService } from './modelVariation.service';
import * as ModelVariationDto from './dto/modelVariation.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { renameSync } from 'fs';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('modelVariation')
export class ModelVariationController {
  constructor(private readonly modelVariationService: ModelVariationService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      dest: 'uploads/modelVariations',
    }),
  )
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: ModelVariationDto.ModelVariationCreateRequestDto,
  ) {
    console.log(files);
    for (const file of files) {
      if (!file) throw new NotFoundException(`File not found`);
    }
    try {
      if (typeof body.modelId === 'string') {
        body.modelId = +body.modelId;
      }
      if (typeof body.version === 'string') {
        body.version = +body.version;
      }
      const result = await this.modelVariationService.create({
        ...ModelVariationDto.ModelVariationCreateRequestDto.toCreateInput(body),
        filesType: files.map((file) => path.extname(file.originalname)),
      });
      files.map((file, idx) => {
        const newPath = `uploads/modelVariations/${result.id}_${idx}${path.extname(file.originalname)}`;
        renameSync(file.path, newPath);
      });
      return JSON.stringify(ModelVariationDto.ModelVariationResponseDto.fromModelVariation(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: ModelVariationDto.ModelVariationUpdateRequestDto) {
    try {
      const result = await this.modelVariationService.updateOne(
        id,
        ModelVariationDto.ModelVariationUpdateRequestDto.toUpdateInput(body),
      );
      if (result == null) {
        throw new NotFoundException(`ModelVariation with id ${id} not found`);
      }
      return JSON.stringify(ModelVariationDto.ModelVariationResponseDto.fromModelVariation(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
