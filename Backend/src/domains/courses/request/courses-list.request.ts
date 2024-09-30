import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { leanObject } from 'src/shared/prisma.helper';

export class CourseListREQ {
  @IsOptional()
  @IsString()
  keyword: string;

  static toCondition(query: CourseListREQ): Prisma.CourseFindManyArgs['where'] {
    return leanObject(
      query.keyword && { OR: [
        {
          name: {
            contains: query.keyword ? query.keyword : '',
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          labels: {
            has: query.keyword ? query.keyword : '',
          },
        }
      ],
    })
  }
}
