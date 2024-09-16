import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import {} from './model.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { ModelController } from './model.controller';

@Module({
  imports: [PrismaModule],
  providers: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
