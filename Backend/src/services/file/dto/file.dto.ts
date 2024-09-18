import { Prisma } from '@prisma/client';

export class FileDTO {
  filepath: string;
  mimetype: string;

  static fromEntity(entity: Prisma.LearningMaterialGetPayload<unknown>): FileDTO {
    return {
      filepath: entity.filepath,
      mimetype: entity.mimetype,
    };
  }
}
