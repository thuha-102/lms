import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';

export class CourseUpdateREQ {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  static toUpdateInput(body: CourseUpdateREQ): Prisma.CourseUpdateInput {
    return leanObject({
      name: body.name,
      updatedAt: new Date(),
      description: body.description,
    });
  }
}
