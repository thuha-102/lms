import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LearningMaterialCreateREQ, Quiz } from './request/learning-material-create.request';
import { LearningMaterialType } from '@prisma/client';
import { CodeDTO, InfoLMDTO, QuizDTO } from './dto/learning-material.dto';
import { connectManyRelation, connectRelation } from 'src/shared/prisma.helper';
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

  async processQuiz(filepath: String) {
    let questionarie: { question: String; answers: String[]; correctAnswer: number }[];
    await readXlsxFile(filepath as any).then((rows) => {
      rows.map((row, index) => {
        if (index !== 0) {
          questionarie.push({
            question: row[0] as string,
            correctAnswer: Number((row[1] as string).toUpperCase().charCodeAt(0)) - 65,
            answers: row.slice(2) as string[],
          });
        }
      });
    });

    return questionarie;
  }

  async create(body: LearningMaterialCreateREQ) {
    if (body.type === LearningMaterialType.QUIZ) {
      // const questionarie = this.processQuiz()
    } else {
    }

    return;
  }
}
