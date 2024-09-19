import { IsNotEmpty, IsString } from 'class-validator';

export class AuthREQ {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  password: string;
}
