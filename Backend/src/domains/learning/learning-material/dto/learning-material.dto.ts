import { Prisma } from '@prisma/client';
import readXlsxFile from 'read-excel-file/node';

export class QuizDTO {
  name: string;
  questions: string[];
  choices: string[][];
  correctAnswers: number[];

  async fromEntity(filepath: String) {
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
