import { Prisma } from '@prisma/client';

export class AuthLoginRESP {
  id: number;
  username: string;
  accessToken: string;

  static fromEntity(e: Prisma.UserGetPayload<unknown>, jwtToken: string): AuthLoginRESP {
    return {
      id: e.id,
      username: e.username,
      accessToken: jwtToken,
    };
  }
}
