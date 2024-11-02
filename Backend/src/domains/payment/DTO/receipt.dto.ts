import { Prisma } from '@prisma/client';

export class ReceiptDTO {
  id: number;
  isPayment: boolean;
  learnerId: number;
  createdAt: string;
  courses: {
    id: number,
    name: string
  }[] ;

  static selectField(): Prisma.ReceiptSelect {
    return {
      id: true,
      learnerId: true,
      createdAt: true,
      Course: {
        select: {
          id: true,
          name: true
        },
      },
      isPayment: true,
    };
  }

  static fromEntity(e: Prisma.ReceiptGetPayload<{ include: { Course: true } }>): ReceiptDTO {
    const courses = e.Course.map((c) => ({id: c.id, name: c.name}));

    return {
      id: e.id,
      createdAt: e.createdAt.toLocaleDateString(),
      isPayment: e.isPayment,
      learnerId: e.learnerId,
      courses: courses,
    };
  }
}
