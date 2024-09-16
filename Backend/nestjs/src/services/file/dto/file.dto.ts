import { Prisma } from '@prisma/client';

export class FileDTO {
  name: string;
  type: string;
  fileName: string;
  canSkip: boolean;

  static fromEntity(entity: Prisma.FileGetPayload<unknown>, canSkip : boolean = false): FileDTO {
    return {
      name: entity.name,
      fileName: entity.prefix + '--' + entity.name,
      type: entity.type,
      canSkip: canSkip,
    };
  }
}
