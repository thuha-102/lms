import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { leanObject } from 'src/shared/prisma.helper';
import { ReceiptREQ } from './request/receipt.request';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { ReceiptDTO } from './DTO/receipt.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
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
      
      let registeredCourse = []
      for (let i = 0; i < willRegister.Course.length; i++){
        await this.userService.registerCourse(willRegister.learnerId, willRegister.Course[i].id);
        
        // cancel receipt have a course that is already bought
        registeredCourse.push(willRegister.Course[i].id);
      }

      const learnerUnpaidReceipts = await tx.receipt.findMany({where: {learnerId: willRegister.learnerId, isPayment: false}, select: {id: true, Course: {select: {id: true}}}})
      const failedReceipts = learnerUnpaidReceipts.filter(unpaidReceipt => unpaidReceipt.Course.some(course => registeredCourse.includes(course.id)))

      for (let i = 0; i < failedReceipts.length; i++)
        await tx.receipt.update({where: {id: failedReceipts[i].id}, data: {isPayment: true, note: "Payment failed because one or more courses are already registered"}})

      return { id: receiptId, isPayment: true };
    });
  }

  async paymentCheck(id: number) {
    const receipt = await this.prismaService.receipt.findUnique({ where: { id }, select: { isPayment: true } });
    return {
      isPayment: receipt.isPayment,
    };
  }

  async createBankAccount(bankAccount: string, bankName: string){
    try{
      const bank = await this.prismaService.bankAccount.findFirst({where: {id: 1}})
      if (bank) return;
  
      await this.prismaService.bankAccount.create({data: {id: 1, bankAccount: bankAccount, bankName: bankName}});
    }
    catch(error){
      return error
    }
  }

  async findAll(query: {learnerName: string, isPayment: string}){
    const condition: Prisma.ReceiptFindManyArgs['where'] = query ? {isPayment: query.isPayment === 'true' ? true : false, Learner: query.learnerName ? {User: {username: query.learnerName }} : undefined} : undefined

    const receipt = await this.prismaService.receipt.findMany({
      where: condition,
      select: ReceiptDTO.selectField()
    })

    return receipt.map(receipt => ReceiptDTO.fromEntity(receipt))
  }

  async findByUser(query: {learnerId: number, isPayment: string}){
    const condition: Prisma.ReceiptFindManyArgs['where'] = {isPayment: query.isPayment === 'true' ? true : query.isPayment === 'false' ? false : undefined, Learner: {User: {id: query.learnerId }}}

    const receipt = await this.prismaService.receipt.findMany({
      where: condition,
      select: ReceiptDTO.selectField()
    })

    return receipt.map(receipt => ReceiptDTO.fromEntity(receipt))
  }
}
