import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
