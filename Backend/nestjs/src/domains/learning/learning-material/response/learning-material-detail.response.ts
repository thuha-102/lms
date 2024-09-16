import { LearningMaterialType, Prisma } from '@prisma/client';

export class LearningMaterialRESP {
  id: number;
  name: string;
  difficulty: number;
  type: LearningMaterialType;
  rating: number;
  score: number;
  time: number;
  topic: {
    id: number;
    title: string;
  };

  static fromEntity(e: Prisma.LearningMaterialGetPayload<{ include: { Topic: true } }>): LearningMaterialRESP {
    return {
      id: e.id,
      name: e.name,
      difficulty: e.difficulty,
      type: e.type,
      rating: e.rating,
      score: e.score,
      time: e.time,
      topic: {
        id: e.Topic.id,
        title: e.Topic.title,
      },
    };
  }
}
