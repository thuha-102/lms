import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';
export class UserUpdateREQ {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  static toUpdateInput(body: UserUpdateREQ): Prisma.UserUpdateInput {
    return leanObject({
      username: body.username,
      password: body.password,
      updatedAt: new Date(),
    });
  }
}
