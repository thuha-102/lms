import { Prisma } from '@prisma/client';

export class LessonListREQ {
  static selectLessonField(): Prisma.LessonSelect {
    return {
      id: true,
      title: true,
      order: true,
      LearningMaterial: {
        select: {
          id: true,
          filepath: true,
        },
      },
      topicId: true,
    };
  }
}
