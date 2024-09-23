import { Prisma } from '@prisma/client';
import { fromEvent } from 'rxjs';

export class LessonDTO {
  id: number;
  title: string;
  fileId: number;
  type: string;
  // filepath: string;

  static selectLessonField(): Prisma.LessonSelect {
    return {
      id: true,
      title: true,
      LearningMaterial: {
        select: {
          id: true,
          type: true,
          filepath: true,
        },
      },
    };
  }

  static fromEntity(e: Prisma.LessonGetPayload<{ include: { LearningMaterial: true } }>): LessonDTO {
    return {
      id: e.id,
      title: e.title,
      fileId: e.LearningMaterial.id,
      type: e.LearningMaterial.type,
      // filepath: e.LearningMaterial.filepath,
    };
  }
}
