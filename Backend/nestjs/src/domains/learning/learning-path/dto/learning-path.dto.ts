import { Prisma } from '@prisma/client';

export class LearningPathDTO {
  learningMaterialOrder: number;
  learned: boolean;
  learningMaterialId: number;
  learnerId: number;

  static fromEntity(e: Prisma.LearningPathGetPayload<unknown>): LearningPathDTO {
    return {
      learningMaterialOrder: e.learningMaterialOrder,
      learned: e.learned,
      learningMaterialId: e.learningMaterialId,
      learnerId: e.learnerId,
    };
  }
}
