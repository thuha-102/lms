import { Prisma } from '@prisma/client';

export class AuthDTO {
  id: number;
  username: string;
  accountType: string;
  registerCourseIds: number[];

  static fromEntity(e: Prisma.UserGetPayload<unknown>, registerCourseIds: number[]): AuthDTO {
    return {
      id: e.id,
      username: e.username,
      accountType: e.accountType,
      registerCourseIds: registerCourseIds,
    };
  }
}
