import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';

export class CourseListREQ {
  @IsOptional()
  @IsString()
  keyword: string;

  static toCondition(query: CourseListREQ): Prisma.CourseFindManyArgs['where'] {
    return leanObject({
      name: {
        contains: query.keyword,
      },
      labels: {
        has: query.keyword,
      },
    });
  }
}
