import { Prisma } from '@prisma/client';

export class ReceiptDTO {
  id: number;
  learnerId: number;
  courseIds: number[];

  static selectField(): Prisma.ReceiptSelect {
    return {
      id: true,
      learnerId: true,
      Course: {
        select: {
          id: true,
        },
      },
      isPayment: true,
    };
  }

  static fromEntity(e: Prisma.ReceiptGetPayload<{ include: { Course: true } }>): ReceiptDTO {
    const courseIds = e.Course.map((c) => c.id);

    return {
      id: e.id,
      learnerId: e.learnerId,
      courseIds: courseIds,
    };
  }
}
