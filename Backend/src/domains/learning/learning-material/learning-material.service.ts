import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LearningMaterialCreateREQ } from './request/learning-material-create.request';
import { LearningMaterialType } from '@prisma/client';
import { FileService } from 'src/services/file/file.service';
import { FileDTO } from 'src/services/file/dto/file.dto';
import * as fs from 'fs/promises';
import { exec } from 'child_process';
import readXlsxFile from 'read-excel-file/node';

@Injectable()
export class LearningMaterialService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(body: LearningMaterialCreateREQ) {
    if (body.type === LearningMaterialType.QUIZ) {
      // const questionarie = this.processQuiz()
    } else {
    }

    return;
  }
}
