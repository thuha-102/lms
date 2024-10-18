import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async paymentCheck(@Req() req: any, @Body() body : any) {
    console.log(body)
  }

  @Get('/bank-account')
  async getAccountBank() {
    return this.paymentService.getAccountBank();
  }

  @Patch('/bank-account')
  async updateAccountBank(@Body() body: { bankName: string; bankAccount: string }) {
    return this.paymentService.updateAccountBank(body);
  }
}
