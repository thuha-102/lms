import { BackgroundKnowledgeType, Prisma } from '@prisma/client';
import { CodeDTO, QuizDTO } from 'src/domains/learning/learning-material/dto/learning-material.dto';

export class CourseDTO {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  visibility: boolean;
  rating: number;
  description: string;
  amountOfTime: number;
  level: BackgroundKnowledgeType;
  instructor: {
    id: number;
    name: string;
    email: string;
  };
  lessons: {
    id: number;
    title: string;
  }[];

  static selectFields(): Prisma.CourseSelect {
    return {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      rating: true,
      visibility: true,
      description: true,
      amountOfTime: true,
      level: true,
      Instructor: true,
      Lesson: true,
    };
  }

  static fromEnTity(entity: Prisma.CourseGetPayload<{ include: { Instructor: true; Lesson: true } }>): CourseDTO {
    const lessons = entity.Lesson.map((l) => ({ id: l.id, title: l.title })).sort((a, b) => a.id - b.id);

    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      name: entity.name,
      visibility: entity.visibility,
      rating: entity.rating,
      description: entity.description,
      amountOfTime: entity.amountOfTime,
      level: entity.level,
      instructor: {
        id: entity.Instructor.id,
        name: entity.Instructor.name,
        email: entity.Instructor.email,
      },
      lessons,
    };
  }
}

export class CourseListDTO {
  id: number;
  name: string;
  rating: number;
  level: string;
  amountOfTime: number;
  createdAt: Date;
  updatedAt: Date;
  description: string;

  static fromEntity(entity: Prisma.CourseGetPayload<unknown>): CourseListDTO {
    return {
      id: entity.id,
      name: entity.name,
      rating: entity.rating,
      level: entity.level,
      amountOfTime: entity.amountOfTime,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      description: entity.description,
    };
  }
}
