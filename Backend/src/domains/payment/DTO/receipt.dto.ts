import { Prisma } from '@prisma/client';

export class ReceiptDTO {
  id: number;
  isPayment: boolean;
  note: string;
  learnerId: number;
  createdAt: string;
  courses: {
    id: number,
    name: string,
    price: number,
    salePercent: number,
  }[] ;

  static selectField(): Prisma.ReceiptSelect {
    return {
      id: true,
      learnerId: true,
      createdAt: true,
      note: true,
      Course: {
        select: {
          id: true,
          name: true,
          price: true,
          salePercent: true
        },
      },
      isPayment: true,
    };
  }

  static fromEntity(e: Prisma.ReceiptGetPayload<{ include: { Course: true } }>): ReceiptDTO {
    const courses = e.Course.map((c) => ({id: c.id, name: c.name, price: c.price, salePercent: c.salePercent}));

    return {
      id: e.id,
      createdAt: e.createdAt.toLocaleDateString(),
      isPayment: e.isPayment,
      learnerId: e.learnerId,
      note: e.note,
      courses: courses,
    };
  }
}
