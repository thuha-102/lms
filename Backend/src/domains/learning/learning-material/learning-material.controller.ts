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
}
