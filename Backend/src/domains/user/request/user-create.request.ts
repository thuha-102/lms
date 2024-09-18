import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
export class UserCreateREQ {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  static toCreateInput(body: UserCreateREQ): Prisma.UserCreateInput {
    return {
      password: body.password,
      username: body.username,
    };
  }
}
