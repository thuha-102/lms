import { LearningMaterialType, Prisma } from '@prisma/client';
import { ReadStream } from 'fs';
import { connectRelation } from 'src/shared/prisma.helper';

export class QuizDTO {
  type: string;
  minutes: number;
  questions: string[];
  choices: string[][];
  correctAnswers: number[];
  coverIds: number[];

  static fromEntity(e: Prisma.QuizGetPayload<unknown>[], time: number): QuizDTO {
    const type = 'QUIZ';
    const minutes = time;
    let questions: string[] = [];
    let choices: string[][] = [];
    let correctAnswers: number[] = [];
    let coverIds: number[] = [];

    for (let i = 0; i < e.length; i++) {
      questions.push(e[i].question);
      choices.push(e[i].answers);
      correctAnswers.push(e[i].correctAnswer);
      coverIds.push(e[i].coverId);
    }

    return {
      minutes,
      type,
      questions,
      choices,
      correctAnswers,
      coverIds,
    };
  }

  static createQuizInput(
    fileId: number,
    index: number,
    questionarie: { question: string; answers: string[]; correctAnswer: number },
  ): Prisma.QuizCreateInput {
    return {
      LearningMaterial: connectRelation(fileId),
      index: index,
      question: questionarie.question,
      answers: questionarie.answers,
      correctAnswer: questionarie.correctAnswer,
    };
  }
}

export class InfoLMDTO {
  id: number;
  type: string;

  static fromEntity(entity: Prisma.LearningMaterialGetPayload<unknown>): InfoLMDTO {
    const { id, type } = entity;
    return {
      id,
      type,
    };
  }
}
export class FileDTO {
  filepath: string;
  type: LearningMaterialType;
  mimetype: string;

  static fromEntity(entity: Prisma.LearningMaterialGetPayload<unknown>): FileDTO {
    return {
      filepath: entity.filepath,
      type: entity.type,
      mimetype: entity.mimetype,
    };
  }
}

export class VideoDTO {
  type: string;
  mimetype: string;
  streamableFile: ReadStream;
  start: number;
  end: number;
  fileSize: number;

  static fromEntity(mimetype: string, start: number, end: number, fileSize: number, streamableFile: ReadStream): VideoDTO {
    return {
      type: 'VIDEO',
      start,
      end,
      mimetype,
      streamableFile,
      fileSize,
    };
  }
}

export class QuizAnswers {
  quizId: number;
  answers: number[];
}
