import { Prisma } from '@prisma/client';
import { LessonDTO } from 'src/domains/lessons/dto/lessons.dto';

export class TopicDTO {
  id: number;
  name: string;
  lessons: LessonDTO[];

  static selectTopicField(): Prisma.TopicSelect {
    return {
      id: true,
      name: true,
    };
  }

  static fromEntity(e: Prisma.TopicGetPayload<unknown>, lessons?: LessonDTO[]): TopicDTO {
    return {
      id: e.id,
      name: e.name,
      lessons: lessons,
    };
  }
}
