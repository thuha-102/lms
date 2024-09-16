import { LearningMaterial, Prisma } from '@prisma/client';

export class LessonDTO {
  title: string;
  learningMaterial: {
    id: number;
    name: string;
    type: string;
  }[];
  amountOfTime: number;
  visibility: boolean;
  courseId: number;

  static fromEntity(entity: Prisma.LessonGetPayload<{ include: { LearningMaterial: true } }>): LessonDTO {
    const learningMaterial = entity.LearningMaterial.map((lm) => ({ id: lm.id, name: lm.name, type: lm.type }));
    return {
      title: entity.title,
      learningMaterial: learningMaterial,
      amountOfTime: entity.amountOfTime,
      visibility: entity.visibility,
      courseId: entity.courseId,
    };
  }
}
