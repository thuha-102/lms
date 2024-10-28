import { Prisma } from '@prisma/client';
import { connectRelation } from 'src/shared/prisma.helper';

export class QuizCreateREQ {
  length: number;
  questions: string[];
  coverIds: number[];
  correctAnswers: number[];
  answers: string[][];

  static toCreateInput(body: QuizCreateREQ, index: number, lmId: number): Prisma.QuizCreateInput {
    return {
      question: body.questions[index],
      index: index,
      coverId: body.coverIds[index],
      answers: body.answers[index],
      correctAnswer: body.correctAnswers[index],
      LearningMaterial: connectRelation(lmId),
    };
  }
}
