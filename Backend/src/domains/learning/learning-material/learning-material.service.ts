import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LearningMaterialCreateREQ, Quiz, Code } from './request/learning-material-create.request';
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

  async create(body: LearningMaterialCreateREQ) {
    const lm = await this.prismaService.learningMaterial.create({
      data: LearningMaterialCreateREQ.toCreateInput(body),
      select: { id: true },
    });

    if (body.lessonId) {
      const lesson = await this.prismaService.lesson.update({
        where: { id: body.lessonId },
        data: {
          amountOfTime: {
            increment: body.time * 60,
          },
        },
        select: {
          courseId: true,
        },
      });

      await this.prismaService.course.update({
        where: { id: lesson.courseId },
        data: {
          amountOfTime: {
            increment: body.time * 60,
          },
        },
      });
    }

    let score: number = 10;
    if (body.type === LearningMaterialType.CODE || body.type === LearningMaterialType.QUIZ) {
      const exercise = await this.prismaService.exercise.create({ data: {}, select: { id: true } });
      if (body.type === LearningMaterialType.QUIZ) score = await this.createQuiz(body.quiz, exercise.id);
      else {
        score = body.code.inputIds.length;
        await this.createCode(body.code, exercise.id);
      }

      await this.prismaService.learningMaterial.update({
        where: { id: lm.id },
        data: { score: score, Exercise: connectRelation(exercise.id) },
      });
    } else {
      if (body.type === LearningMaterialType.VIDEO) {
        const file = await this.prismaService.file.findFirst({
          where: { id: body.fileId },
          select: { name: true, prefix: true },
        });
        const buffer = await fs.readFile(`uploads/materialFiles/${file.prefix}--${file.name}`);
        const start = buffer.indexOf(Buffer.from('mvhd')) + 16;
        const timeScale = buffer.readUInt32BE(start);
        const duration = buffer.readUInt32BE(start + 4);
        const movieLength = duration / timeScale;

        score = movieLength;
      }

      const other = await this.prismaService.other.create({
        data: { file: connectRelation(body.fileId), content: body.content ? body.content : '' },
        select: { id: true },
      });

      await this.prismaService.learningMaterial.update({
        where: { id: lm.id },
        data: { score, Other: connectRelation(other.id) },
      });
    }

    return { id: lm.id };
  }

  async createQuiz(quiz: Quiz, exerciseId: number) {
    const { duration, shuffle, fileId } = quiz;

    const _quiz = await this.prismaService.quiz.create({
      data: { duration: duration, shuffleQuestions: shuffle, Exercise: connectRelation(exerciseId) },
      select: { id: true },
    });

    const fileName = FileDTO.fromEntity(
      (await this.prismaService.file.findFirst({ where: { id: fileId }, select: { name: true, prefix: true } })) as any,
    ).fileName;

    let score = 1;
    await readXlsxFile(`uploads/materialFiles/${fileName}`).then(async (rows) => {
      for (let i = 1; i < rows.length; i++) {
        const _question = await this.prismaService.question.create({
          data: { content: rows[i][0].toString(), Quiz: connectRelation(_quiz.id) },
          select: { id: true },
        });
        const indexOfCorect = rows[i][1].toString().charCodeAt(0) - 63;

        for (let j = 2; j < rows[i].length; j++) {
          if (!rows[i][j]) break;
          await this.prismaService.answer.create({
            data: { content: rows[i][j].toString(), correctness: j === indexOfCorect, Question: connectRelation(_question.id) },
          });
        }
      }
      score = rows.length - 1;
    });
    await fs.unlink(`uploads/materialFiles/${fileName}`);
    return score;
  }

  async createCode(code: Code, exerciseId: number) {
    // Write the user's Python code to a temporary file
    await fs.writeFile('temp.py', code.truthCode);

    const inputFiles = await this.prismaService.file.findMany({
      where: { id: { in: code.inputIds } },
      select: { name: true, prefix: true },
    });

    for (let i = 0; i < inputFiles.length; i++) {
      // Run code
      const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        exec(
          `python temp.py ${'uploads/materialFiles/' + inputFiles[i].prefix + '--' + inputFiles[i].name}`,
          async (error, stdout, stderr) => {
            // Delete the temporary file
            await fs.unlink('temp.py');
            if (error) {
              reject(error);
              throw new ConflictException(error, 'Code can not run');
            }
            resolve({ stdout, stderr });
          },
        );
      });
      await fs.writeFile(`uploads/materialFiles/${inputFiles[i].prefix + '--output.txt'}`, stdout);
      await this.prismaService.file.create({ data: { name: 'output.txt', prefix: inputFiles[i].prefix, type: 'text/plain' } });
    }

    await this.prismaService.code.create({
      data: {
        question: code.question,
        exampleCode: code.exampleCode,
        truthCode: code.truthCode,
        inputFile: connectManyRelation(code.inputIds),
        Exercise: connectRelation(exerciseId),
      },
    });
  }

  async createMany(body: LearningMaterialCreateREQ[]) {
    body.map(
      async (data) => await this.prismaService.learningMaterial.create({ data: LearningMaterialCreateREQ.toCreateInput(data) }),
    );
  }

  async detail(id: number, learnerId?: number) {
    let type: string = '',
      DTO: CodeDTO | QuizDTO | FileDTO;

    const lm = await this.prismaService.learningMaterial.findFirst({
      where: { id },
      select: {
        name: true,
        type: true,
        time: true,
        Exercise: { select: { quizId: true, codeId: true } },
        Other: { select: { fileId: true } },
      },
    });
    if (!lm) throw new NotFoundException("Couldn't find learning material");

    if (lm.type === LearningMaterialType.CODE) {
      const code = await this.prismaService.code.findFirst({
        where: { id: lm.Exercise.codeId },
        select: { question: true, exampleCode: true, inputFile: true },
      });
      if (!code) throw new NotFoundException("Couldn't find learning material");

      type = 'CODE';
      DTO = CodeDTO.fromEntity(lm.name, code as any);
    } else if (lm.type === LearningMaterialType.QUIZ) {
      const quiz = await this.prismaService.quiz.findFirst({
        where: { id: lm.Exercise.quizId },
        select: { duration: true, shuffleQuestions: true, question: { include: { choice: true } } },
      });

      if (!quiz) throw new NotFoundException("Couldn't find learning material");

      type = 'QUIZ';
      DTO = QuizDTO.fromEntity(lm.name, quiz as any);
    } else {
      const file = await this.prismaService.file.findFirst({ where: { id: lm.Other.fileId } });
      let canSkip = false, rangePassed = 0;
      if (lm.type === LearningMaterialType.VIDEO) {
        const log = await this.prismaService.learnerLog.findFirst({ where: {learningMaterialId: id, learnerId: learnerId }, select: {attempts: true, score: true, time: true}})

        if (log){
          if (log.attempts > 1 || log.score != 0) canSkip = true
          else rangePassed = log.score/log.time
        }
      }

      if (!file) throw new NotFoundException("Couldn't find learning material");

      type = 'OTHER';
      DTO = FileDTO.fromEntity(file as any, canSkip);
    }

    return {
      type,
      DTO,
    };
  }

  async list() {
    const lms = await this.prismaService.learningMaterial.findMany({
      select: {
        id: true,
        name: true,
        time: true,
        type: true,
        Topic: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return lms;
  }

  async infomation(id: number) {
    const lm = await this.prismaService.learningMaterial.findFirst({
      where: { id },
      select: { name: true, difficulty: true, type: true, rating: true, score: true },
    });
    if (!lm) throw new NotFoundException('Not found learning material');
    return InfoLMDTO.fromEntity(lm as any);
  }
}
