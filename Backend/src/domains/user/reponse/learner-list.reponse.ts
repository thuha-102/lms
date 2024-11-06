import { Prisma } from '@prisma/client';

export class LearnerListREPS {
  id: number;
  createdAt: string;
  username: string;
  typeLearner: string;
  avg_score: number;

  static fromEntity(e: Prisma.LearnerGetPayload<{ include: { User: true; TypeLearner: true; HistoryStudiedQuiz: true} }>): LearnerListREPS {
    const date = new Date(e.User.createdAt);
    return {
      id: e.id,
      username: e.User.username,
      createdAt: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')},  ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
      typeLearner: e.TypeLearner?.name,
      avg_score: e.HistoryStudiedQuiz?.reduce((acc, quiz) => acc + quiz.score, 0) / (e.HistoryStudiedQuiz.length || 1)
    };
  }
}
