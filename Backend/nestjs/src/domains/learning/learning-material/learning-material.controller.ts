import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { LearningMaterialService } from './learning-material.service';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { LearningMaterialCreateREQ } from './request/learning-material-create.request';
import { FileDTO } from 'src/services/file/dto/file.dto';
import { FileService } from 'src/services/file/file.service';
import { join } from 'path';

@Controller('learning-materials')
export class LearningMaterialController {
  constructor(
    private readonly learningMaterialService: LearningMaterialService,
    private readonly fileService: FileService,
  ) {}

  @Post('batch')
  async createMany(@Body() body: LearningMaterialCreateREQ[]) {
    await this.learningMaterialService.createMany(body);
  }

  @Post()
  async create(@Body() body: LearningMaterialCreateREQ) {
    return await this.learningMaterialService.create(body);
  }

  @Get(':id')
  @Header('Accept-Ranges', 'bytes')
  async detail(
    @Res({ passthrough: true }) res: Response,
    @Headers('range') range: string,
    @Param('id', ParseIntPipe) id: number,
    @Query('learnerId') learnerId?: number,
  ) {
    if (learnerId) learnerId = Number(learnerId)
    const lm = await this.learningMaterialService.detail(id, learnerId);

    if (lm.type === 'OTHER') {
      const filePath = `./uploads/materialFiles/${(lm.DTO as FileDTO).fileName}`;
      if (!existsSync(filePath)) throw new NotFoundException('Can not find file');
      res.set({
        'Content-Type': (lm.DTO as FileDTO).type,
        filename: lm.DTO.name,
      });

      if (!range)
        return new StreamableFile(createReadStream(join(process.cwd(), filePath)), {
          disposition: `inline; filename="${lm.DTO.name}`,
          type: (lm.DTO as FileDTO).type,
        });

      const { streamableFile, contentRange } = await this.fileService.getPartialVideoStream(
        lm.DTO.name,
        (lm.DTO as FileDTO).type,
        filePath,
        range,
      );

      res.status(206);
      res.set({
        'Content-Range': contentRange,
      });

      return streamableFile;
    } else return res.status(200).json(lm.DTO);
  }

  @Get(':id/information')
  async getInfomation(@Param('id', ParseIntPipe) id: number) {
    return this.learningMaterialService.infomation(id);
  }

  @Get()
  async list() {
    return await this.learningMaterialService.list();
  }
}
