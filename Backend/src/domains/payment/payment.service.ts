import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { leanObject } from 'src/shared/prisma.helper';
import { ReceiptREQ } from './request/receipt.request';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  async getAccountBank() {
    return await this.prismaService.bankAccount.findFirst({
      where: { id: 1 },
      select: { bankAccount: true, bankName: true },
    });
  }

  async updateAccountBank(body: { bankAccount: string; bankName: string }) {
    return await this.prismaService.bankAccount.update({ where: { id: 1 }, data: leanObject(body) });
  }

  async createReceipt(body: ReceiptREQ) {
    return await this.prismaService.$transaction(async (tx) => {
      const receipt = await tx.receipt.create({ data: ReceiptREQ.toCreateInput(body), select: { id: true } });
      return { id: receipt.id };
    });
  }

  async paymentConfirm(code: string) {
    const receiptId = parseInt(code.slice(2), 10);

    return await this.prismaService.$transaction(async (tx) => {
      const willRegister = await tx.receipt.update({
        where: { id: receiptId },
        data: { isPayment: true },
        select: { learnerId: true, Course: { select: { id: true } } },
      });

      for (let i = 0; i < willRegister.Course.length; i++)
        await this.userService.registerCourse(willRegister.learnerId, willRegister.Course[i].id);

      return { id: receiptId, isPayment: true };
    });
  }

  async paymentCheck(id: number) {
    const receipt = await this.prismaService.receipt.findUnique({ where: { id }, select: { isPayment: true } });
    return {
      isPayment: receipt.isPayment,
    };
  }
}
