import { Prisma } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class FileCreatREQ {
  @IsString()
  name: string;
}
