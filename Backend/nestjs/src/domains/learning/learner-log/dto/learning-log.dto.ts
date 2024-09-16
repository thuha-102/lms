import { Prisma } from '@prisma/client';

export class LearningLogDTO {
  lmID: number;
  name: string;
  attempt: number;
  score: number;
  time: number;
  topicId: number;
  rating: number;
  maxScore: number;
  maxTime: number;
  difficulty: number;
  type?: string;

  static fromEntity(e: Prisma.LearnerLogGetPayload<{ include: { learningMaterial: true } }>): LearningLogDTO {
    return {
      lmID: e.learningMaterial.id,
      name: e.learningMaterial.name,
      attempt: e.attempts,
      score: e.score,
      time: e.time,
      topicId: e.learningMaterial.topicId,
      rating: e.learningMaterial.rating,
      maxScore: e.learningMaterial.score,
      maxTime: e.learningMaterial.time,
      difficulty: e.learningMaterial.difficulty,
      type: e.learningMaterial.type
    };
  }
}
