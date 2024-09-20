import { Prisma } from '@prisma/client';
import { Quiz } from '../request/learning-material-create.request';

export class CodeDTO {
  name: string;
  question: string;
  exampleCode: string;
  inputName: string;

  static fromEntity(name: string, entity: Prisma.CodeGetPayload<{ include: { inputFile: true } }>): CodeDTO {
    const { question, exampleCode } = entity;
    return {
      name,
      question,
      exampleCode,
      inputName: entity.inputFile[0].prefix + '--' + entity.inputFile[0].name,
    };
  }
}

export class QuizDTO {
  name: string;
  duration: number;
  shuffle: boolean;
  questions: string[];
  choices: string[][];
  correctAnswers: number[];

  static fromEntity(
    name: string,
    entity: Prisma.QuizGetPayload<{ include: { question: { include: { choice: true } } } }>,
  ): QuizDTO {
    const duration = entity.duration ? Number(entity.duration) : 0;
    const choices = entity.question.map((q) => q.choice.map((c) => c.content));
    const questions = entity.question.map((q) => q.content);
    const correctAnswers = entity.question.map((q) => q.choice.findIndex((c) => c.correctness === true));

    return {
      name: name,
      duration: duration,
      shuffle: entity.shuffleQuestions,
      questions: questions,
      choices: choices,
      correctAnswers,
    };
  }
}

export class InfoLMDTO {
  name: string;
  difficulty: number;
  type: string;
  rating: number;
  score: number;

  static fromEntity(entity: Prisma.LearningMaterialGetPayload<unknown>): InfoLMDTO {
    const { name, difficulty, type, rating, score } = entity;
    return {
      name,
      difficulty,
      type,
      rating,
      score,
    };
  }
}
