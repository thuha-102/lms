import { Prisma } from '@prisma/client';

export class AuthLoginRESP {
  id: number;
  username: string;
  accessToken: string;
  accountType: string;

  static fromEntity(e: Prisma.UserGetPayload<unknown>, jwtToken: string): AuthLoginRESP {
    return {
      id: e.id,
      username: e.username,
      accountType: e.accountType,
      accessToken: jwtToken,
    };
  }
}
