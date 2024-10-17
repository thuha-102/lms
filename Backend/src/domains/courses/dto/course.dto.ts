import { LevelType, Prisma } from '@prisma/client';
import { TopicDTO } from 'src/domains/topics/dto/topics.dto';

export class CourseDTO {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  visibility: boolean;
  salePercent: number;
  description: string;
  level: LevelType;
  price: number;
  amountOfTime: number;
  avatarId: number;
  topics: TopicDTO[];

  static selectFields(): Prisma.CourseSelect {
    return {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      description: true,
      price: true,
      avatarId: true,
      visibility: true,
      salePercent: true,
      level: true,
      amountOfTime: true,
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
      level: entity.level,
      name: entity.name,
      visibility: entity.visibility,
      description: entity.description,
      salePercent: entity.salePercent,
      price: entity.price,
      avatarId: entity.avatarId,
      amountOfTime: entity.amountOfTime,
      topics: topic,
    };
  }
}

export class CourseListDTO {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  level: LevelType;
  avatarId: number;
  price: number;
  amountOfTime: number;
  salePercent: number;
  visibility: boolean;

  static selectFields(): Prisma.CourseSelect {
    return {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      level: true,
      description: true,
      salePercent: true,
      price: true,
      avatarId: true,
      amountOfTime: true,
      visibility: true,
    };
  }

  static fromEntity(entity: Prisma.CourseGetPayload<unknown>): CourseListDTO {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      level: entity.level,
      updatedAt: entity.updatedAt,
      description: entity.description,
      avatarId: entity.avatarId,
      salePercent: entity.salePercent,
      price: entity.price,
      amountOfTime: entity.amountOfTime,
      visibility: entity.visibility,
    };
  }
}
