import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileDTO, QuizDTO, VideoDTO } from './dto/file.dto';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { LearningMaterialType, Prisma } from '@prisma/client';
import readXlsxFile from 'read-excel-file/node';
import { contains } from 'class-validator';

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
        data: { filepath: fileName, mimetype: mimetype, type: type, name: fileName.split('--')[1].split('.')[0], usedCount: 1 },
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

    if (file.type !== 'QUIZ') return FileDTO.fromEntity(file as any);
    else {
      const lesson = await this.prismaService.lesson.findFirst({ where: { learningMaterialId: file.id }, select: { time: true } });
      const quiz = await this.prismaService.quiz.findMany({
        where: { id: file.id },
        select: {
          question: true,
          answers: true,
          correctAnswer: true,
          coverId: true,
        },
      });

      return QuizDTO.fromEntity(quiz as any, lesson ? lesson.time : 0);
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

  async getAll(condition: { name: string; type: string, used: string}) {
    let name: string = null, type: string[] = null, used: number = null;

    if (condition) {
      name = condition.name ? condition.name : null;
      type = condition.type ? condition.type.split(',') : null;
      used = condition.used ? (condition.used === 'true' ? 1 : -1) : null; 
    }

    const query: Prisma.LearningMaterialWhereInput[] = [
      name ? { name: { contains: name, mode: Prisma.QueryMode.insensitive } } : undefined,
      type ? { type: { in: type as LearningMaterialType[] } } : undefined,
      used ? ( used === 1 ? {usedCount: {gt: 0}} : {usedCount: 0} ) : undefined
    ].filter(Boolean);

    const lms = (
      await this.prismaService.learningMaterial.findMany({
        where: query.length !== 0 ? { OR: query } : undefined,
        select: { id: true, type: true, name: true, filepath: true, usedCount: true },
      })
    ).map((lm) => {
      return { id: lm.id, type: lm.type, name: lm.name !== '' ? lm.name : lm.filepath?.split('--')[1].split('.')[0], usedCount: lm.usedCount };
    });

    return lms;
  }

  async getInformation(id: number) {
    const lm = await this.prismaService.learningMaterial.findFirst({
      where: { id },
      select: { Lesson: { select: { title: true } }, type: true },
    });
    return {
      type: lm.type,
    };
  }

  async getNoUsed() {
    const noUsedList = (
      await this.prismaService.learningMaterial.findMany({
        where: {usedCount: 0},
        select: { id: true, type: true, name: true, filepath: true },
      })
    ).map((lm) => {
      return { id: lm.id, type: lm.type, name: lm.name !== '' ? lm.name : lm.filepath?.split('--')[1] };
    });
    
    return noUsedList;
  }

  async delete(id: number){
    await this.prismaService.learningMaterial.delete({where: {id}})
  }
}
