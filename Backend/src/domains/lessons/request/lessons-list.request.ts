import { Prisma } from '@prisma/client';

export class LessonListREQ {
  id: number;
  title: string;
  time: number;
  order: number;
  lmId: number;
  topicId: number;
  courseId: number;

  static selectLessonField(): Prisma.LessonSelect {
    return {
      id: true,
      title: true,
      order: true,
      time: true,
      LearningMaterial: {
        select: {
          id: true,
        },
      },
      Topic: {
        select: {
          courseId: true,
        },
      },
      topicId: true,
    };
  }

  static fromEntity(e: Prisma.LessonGetPayload<{ include: { LearningMaterial: true; Topic: true } }>): LessonListREQ {
    return {
      id: e.id,
      time: e.time,
      title: e.title,
      order: e.order,
      lmId: e.LearningMaterial.id,
      topicId: e.topicId,
      courseId: e.Topic.courseId,
    };
  }
}
