import { Module } from "@nestjs/common";
import { PrismaModule } from "src/services/prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [PaymentController],
    providers: [PaymentService]
})
export class PaymentModule{}