import { Prisma } from '@prisma/client';
import { parseEponch } from 'src/shared/date.helper';
import { leanObject } from 'src/shared/prisma.helper';

export class UserInfoDTO {
  id: number;
  username: string;
  accountType: string;
  registerCourseIds: number[]

  static selectUser(): Prisma.UserSelect {
    return {
      id: true,
      username: true,
      accountType: true,
    };
  }

  static fromEntity(e: Prisma.UserGetPayload<unknown>, registerCourseIds?: number[]) {
    return leanObject({
      id: e.id,
      username: e.username,
      accountType: e.accountType,
      registerCourseIds: registerCourseIds || [],
    });
  }
}
