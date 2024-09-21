import { Prisma } from '@prisma/client';
import { LessonDTO } from 'src/domains/lessons/dto/lessons.dto';

export class TopicDTO {
  id: number;
  name: string;
  lesson: LessonDTO[];

  static selectTopicField(): Prisma.TopicSelect {
    return {
      id: true,
      name: true,
    };
  }

  static fromEntity(e: Prisma.TopicGetPayload<unknown>, lesson?: LessonDTO[]): TopicDTO {
    return {
      id: e.id,
      name: e.name,
      lesson: lesson,
    };
  }
}
