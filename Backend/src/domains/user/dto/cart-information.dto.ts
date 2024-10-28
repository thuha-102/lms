import { Prisma } from '@prisma/client';

export class CartInforDTO {
  id: number;
  createdAt: Date;
  courseId: number;
  courseName: string;
  price: number;
  salePercent: number;
  // checked: boolean;

  static fromEntity(e: Prisma.CartGetPayload<{ include: { Courses: true } }>): CartInforDTO {
    return {
      id: e.id,
      createdAt: e.createdAt,
      courseId: e.Courses.id,
      courseName: e.Courses.name,
      price: e.Courses.price,
      salePercent: e.Courses.salePercent,
      // checked: e.checked,
    };
  }
}
