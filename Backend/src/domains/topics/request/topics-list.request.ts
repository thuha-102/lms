import { Prisma } from '@prisma/client';

export class TopicListREQ {
  static selectTopicField(): Prisma.TopicSelect {
    return {
      name: true,
      order: true,
      courseId: true,
    };
  }
}
