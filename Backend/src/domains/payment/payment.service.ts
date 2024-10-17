import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { leanObject } from 'src/shared/prisma.helper';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAccountBank() {
    return await this.prismaService.bankAccount.findFirst({
      where: { actived: true },
      select: { bankAccount: true, bankName: true },
    });
  }

  async updateAccountBank(body: { bankAccount: string; bankName: string }) {
    return await this.prismaService.bankAccount.update({ where: { id: 1 }, data: leanObject(body) });
  }
}
