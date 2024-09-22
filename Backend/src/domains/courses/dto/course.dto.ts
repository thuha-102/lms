import { Prisma } from '@prisma/client';
import { TopicDTO } from 'src/domains/topics/dto/topics.dto';

export class CourseDTO {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  topic: TopicDTO[];

  static selectFields(): Prisma.CourseSelect {
    return {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      description: true,
      Topic: {
        select: {
          id: true,
          name: true,
        },
      },
    };
  }

  static fromEnTity(entity: Prisma.CourseGetPayload<unknown>, topic: TopicDTO[]): CourseDTO {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      name: entity.name,
      description: entity.description,
      topic: topic,
    };
  }
}

export class CourseListDTO {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;

  static fromEntity(entity: Prisma.CourseGetPayload<unknown>): CourseListDTO {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      description: entity.description,
    };
  }
}
