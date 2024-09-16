import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginREQ {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  password: string;
}
