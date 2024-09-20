import { Module } from '@nestjs/common';
import { ModelVariationService } from './modelVariation.service';
import { ModelVariationController } from './modelVariation.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ModelVariationService],
  controllers: [ModelVariationController],
})
export class ModelVariationModule {}
