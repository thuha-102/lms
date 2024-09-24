import { Prisma } from '@prisma/client';

export class LessonListREQ {
  id: number;
  title: string;
  order: number;
  lmId: number;
  topicId: number;

  static selectLessonField(): Prisma.LessonSelect {
    return {
      id: true,
      title: true,
      order: true,
      LearningMaterial: {
        select: {
          id: true,
        },
      },
      topicId: true,
    };
  }

  static fromEntity(e: Prisma.LessonGetPayload<{ include: { LearningMaterial: true } }>): LessonListREQ {
    return {
      id: e.id,
      title: e.title,
      order: e.order,
      lmId: e.LearningMaterial.id,
      topicId: e.topicId,
    };
  }
}
