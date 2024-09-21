import { Prisma } from '@prisma/client';

export class LearningMaterialRESP {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  filepath: String;

  static fromEntity(e: Prisma.LearningMaterialGetPayload<unknown>): LearningMaterialRESP {
    return {
      id: e.id,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      filepath: e.filepath,
    };
  }
}
