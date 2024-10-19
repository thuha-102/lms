import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from '../user/user.module';
import { PaymentGateway } from 'src/services/payment-socket';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, EventEmitterModule.forRoot()],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentGateway],
})
export class PaymentModule {}
