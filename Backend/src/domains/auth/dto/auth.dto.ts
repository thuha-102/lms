import { Prisma } from '@prisma/client';

export class AuthDTO {
  id: number;
  username: string;
  accountType: string;

  static fromEntity(e: Prisma.UserGetPayload<unknown>): AuthDTO {
    return {
      id: e.id,
      username: e.username,
      accountType: e.accountType,
    };
  }
}
