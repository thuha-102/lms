import { AccountType, Prisma } from '@prisma/client';

export class AuthDTO {
  id: number;
  username: string;
  accountType: AccountType;

  static fromEntity(e: Prisma.AuthenticatedUserGetPayload<unknown>) {
    return {
      id: e.id,
      username: e.username,
      accountType: e.accountType,
    };
  }
}
