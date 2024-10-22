import { Body, Controller, Get, HttpCode, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ReceiptREQ } from './request/receipt.request';
import { PaymentConfirmREQ } from './request/payment-confrim.request';
import { PaymentGateway } from 'src/services/payment-socket';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentSocket: PaymentGateway,
  ) {}

  @Post()
  async paymentConfirm(@Body() body: PaymentConfirmREQ) {
    const receiptInfor = await this.paymentService.paymentConfirm(body.code);
    this.paymentSocket.paymentConfirmed(receiptInfor);
    return;
  }

  @Get('bank-account')
  async getAccountBank() {
    return await this.paymentService.getAccountBank();
  }

  @Get(':id')
  async paymentCheck(@Query('id', ParseIntPipe) id: number) {
    return await this.paymentService.paymentCheck(id);
  }

  @Post('receipt')
  async createReceipt(@Body() body: ReceiptREQ) {
    return await this.paymentService.createReceipt(body);
  }

  @Patch('bank-account')
  async updateAccountBank(@Body() body: { bankName: string; bankAccount: string }) {
    return await this.paymentService.updateAccountBank(body);
  }
}
