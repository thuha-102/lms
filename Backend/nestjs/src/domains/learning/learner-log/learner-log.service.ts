import { ConflictException, Injectable } from '@nestjs/common';
import { LearnerLogCreateREQ } from './request/learner-log-create.request';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LearningLogDTO } from './dto/learning-log.dto';
import { LearningMaterialType } from '@prisma/client';
import { CodeDTO, QuizDTO } from '../learning-material/dto/learning-material.dto';
import { FileDTO } from 'src/services/file/dto/file.dto';
import * as fs from 'fs';
import * as fspromises from 'fs/promises';
import { exec } from 'child_process';

@Injectable()
export class LearnerLogService {
  constructor(private readonly prismaService: PrismaService) {}

  async getScoreOfCode(codeId: number, learnerAnswers: string) {
    const inputFile = (
      await this.prismaService.code.findFirst({ where: { id: codeId }, select: { inputFile: true } })
    ).inputFile.map((i) => ({ prefix: i.prefix, name: i.name }));

    await fspromises.writeFile('temp.py', learnerAnswers);
    let score: number = 0;

    for (let i = 0; i < inputFile.length; i++) {
      const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        exec(
          `python temp.py ${'uploads/materialFiles/' + inputFile[i].prefix + '--' + inputFile[i].name}`,
          async (error, stdout, stderr) => {
            await fspromises.unlink('temp.py');
            if (error) {
              reject(error);
              throw new ConflictException(error, 'Code can not run');
            }
            resolve({ stdout, stderr });
          },
        );
      });

      let output: string = await fspromises.readFile(`uploads/materialFiles/${inputFile[i].prefix}--output.txt`, 'utf8');
      if (output === stdout) score += 1;
    }

    return score;
  }

  async getScoreOfQuiz(quizId: number, learnerAnswers: number[]) {
    const quiz = await this.prismaService.quiz.findFirst({
      where: { id: quizId },
      select: { question: { include: { choice: true } } },
    });

    const correctAnswers = QuizDTO.fromEntity('', quiz as any).correctAnswers;
    let score: number = 0;

    for (let i = 0; i < correctAnswers.length; i++) if (correctAnswers[i] === learnerAnswers[i]) score += 1;
    return score;
  }

  async create(userID: number, body: LearnerLogCreateREQ) {
    let log = await this.prismaService.learnerLog.findFirst({
      where: { learnerId: userID, learningMaterialId: body.learningMaterialId },
      select: { id: true, attempts: true, score: true },
    });

    const lm = await this.prismaService.learningMaterial.findFirst({
      where: { id: body.learningMaterialId },
      select: { rating: true, type: true, Exercise: true, Other: true, score: true },
    });

    let score: number = 10;
    if (lm.type === LearningMaterialType.CODE)
      score = await this.getScoreOfCode(lm.Exercise.codeId, body.learnerAnswer as string);
    else if (lm.type === LearningMaterialType.QUIZ)
      score = await this.getScoreOfQuiz(lm.Exercise.quizId, body.learnerAnswer as number[]);
    else if (lm.type === LearningMaterialType.VIDEO) score = body.time;

    if (!log) {
      log = await this.prismaService.learnerLog.create({
        data: LearnerLogCreateREQ.toCreateInput(userID, body, score),
        select: { id: true, attempts: true, score: true },
      });
    } else
      await this.prismaService.learnerLog.updateMany({
        where: {
          learnerId: body.learnerId,
          learningMaterialId: body.learningMaterialId,
          state: true,
        },
        data: { score: Math.max(log.score, score), attempts: { increment: 1 } },
      });

    await this.prismaService.learningPath.updateMany({
      data: { learned: true },
      where: { learningMaterialId: body.learningMaterialId, learnerId: userID },
    });

    const updateRating = (lm.rating + body.rating) / 2;
    await this.prismaService.learningMaterial.update({ where: { id: body.learningMaterialId }, data: { rating: updateRating } });

    return { id: log.id, score: score, maxScore: lm.score };
  }

  async createBatch(body: LearnerLogCreateREQ[]) {
    for (let i = 0; i < body.length; i++) {
      await this.prismaService.learnerLog.create({ data: LearnerLogCreateREQ.toCreateBatchInput(body[i]) });
      await this.prismaService.learningPath.updateMany({ data: { learned: true }, where: { learnerId: body[i].learnerId } });
    }
  }

  async detail(learnerId: number, lmId: number) {
    const log = await this.prismaService.learnerLog.findMany({
      where: { learnerId: learnerId, learningMaterialId: lmId ? Number(lmId) : undefined},
      select: {
        learningMaterialId: true,
        learningMaterialVisittedTime: true,
        attempts: true,
        score: true,
        time: true,
        learningMaterialRating: true,
        learningMaterial: true,
      },
    });

    return log.map((l) => LearningLogDTO.fromEntity(l as any));
  }

  async update(id: number, rating: number) {
    const { learningMaterialId, learningMaterialRating } = await this.prismaService.learnerLog.findFirst({
      where: { id },
      select: { learningMaterialId: true, learningMaterialRating: true },
    });
    const oldRating = (
      await this.prismaService.learningMaterial.findFirst({ where: { id: learningMaterialId }, select: { rating: true } })
    ).rating;
    const newRating = (oldRating * 2 - learningMaterialRating + rating) / 2;

    await this.prismaService.learnerLog.update({ where: { id }, data: { learningMaterialRating: rating } });
    await this.prismaService.learningMaterial.update({ where: { id: learningMaterialId }, data: { rating: newRating } });
  }
}
