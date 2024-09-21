import { Prisma } from '@prisma/client';
import { fromEvent } from 'rxjs';

export class LessonDTO {
  id: number;
  title: string;
  fileId: number;
  // filepath: string;

  static selectLessonField(): Prisma.LessonSelect {
    return {
      id: true,
      title: true,
      LearningMaterial: {
        select: {
          id: true,
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
      // filepath: e.LearningMaterial.filepath,
    };
  }
}
