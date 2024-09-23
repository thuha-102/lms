import { Prisma } from '@prisma/client';

export class AuthLoginRESP {
  id: number;
  username: string;
  accessToken: string;
  accountType: string;
  registerCourseIds: number[];

  static fromEntity(e: Prisma.UserGetPayload<unknown>, registerCourseIds: number[], jwtToken: string): AuthLoginRESP {
    return {
      id: e.id,
      username: e.username,
      accountType: e.accountType,
      registerCourseIds: registerCourseIds,
      accessToken: jwtToken,
    };
  }
}
