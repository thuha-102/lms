import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FileController } from './file.controller';

@Module({
  imports: [PrismaModule],
  exports: [FileService],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
