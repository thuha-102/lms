import { Module } from '@nestjs/common';
import { DatasetService } from './dataset.service';
import {} from './dataset.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { DatasetController } from './dataset.controller';

@Module({
  imports: [PrismaModule],
  providers: [DatasetService],
  controllers: [DatasetController],
})
export class DatasetModule {}
