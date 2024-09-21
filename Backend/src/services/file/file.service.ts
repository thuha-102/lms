import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileDTO, QuizDTO, VideoDTO } from './dto/file.dto';
import * as parseRange from 'range-parser';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { join } from 'path';
import { LearningMaterialType } from '@prisma/client';
import readXlsxFile from 'read-excel-file/node';
import { error } from 'console';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async preprocessQuiz(fileName: string) {
    let questionarie: { question: string; answers: string[]; correctAnswer: number }[] = [];

    await readXlsxFile(('./uploads/materialFiles/' + fileName) as any).then((rows) => {
      rows.map((row, index) => {
        if (index !== 0) {
          questionarie.push({
            question: row[0] as string,
            correctAnswer: Number((row[1] as string).toUpperCase().charCodeAt(0)) - 65,
            answers: row
              .slice(2)
              .filter((ans) => ans)
              .map((ans) => ans as string),
          });
        }
      });
    });

    return questionarie;
  }

  async upLoadFile(fileName: string, mimetype: string, type: LearningMaterialType) {
    return await this.prismaService.$transaction(async (tx) => {
      const file = await tx.learningMaterial.create({
        data: { filepath: fileName, mimetype: mimetype, type: type },
        select: { id: true },
      });

      if (type === 'QUIZ') {
        const questionarie = await this.preprocessQuiz(fileName);

        for (let i = 0; i < questionarie.length; i++) {
          await tx.quiz.create({
            data: QuizDTO.createQuizInput(file.id, i, questionarie[i]),
          });
        }
      }
      return file.id;
    });
  }

  async detail(id: number) {
    const file = await this.prismaService.learningMaterial.findFirst({ where: { id } });
    if (!file) throw new NotFoundException('File not found');

    if (file.type === 'PDF') return FileDTO.fromEntity(file as any);
    else {
      const quiz = await this.prismaService.quiz.findMany({
        where: { id: file.id },
        select: {
          question: true,
          answers: true,
          correctAnswer: true,
        },
      });

      return QuizDTO.fromEntity(quiz as any);
    }
  }

  async streamVideo(id: number, range?: string) {
    const file = await this.prismaService.learningMaterial.findFirst({
      where: { id },
      select: { filepath: true, mimetype: true },
    });
    if (!file) throw new NotFoundException('Video not found');

    const fileSize = (await stat(`uploads/materialFiles/${file.filepath}`)).size;

    const parts = range ? range.replace(/bytes=/, '').split('-') : ['0'];
    const start = parseInt(parts[0], 10);
    const end = Math.min(start + 10 ** 6, fileSize - 1); // send 1MB

    const streamableFile = createReadStream(`uploads/materialFiles/${file.filepath}`, { start, end });

    return VideoDTO.fromEntity(file.mimetype, start, end, fileSize, streamableFile);
  }
}
