import { Module } from '@nestjs/common';
import { NotebookService } from './notebook.service';
import {} from './notebook.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { NotebookController } from './notebook.controller';

@Module({
  imports: [PrismaModule],
  providers: [NotebookService],
  controllers: [NotebookController],
})
export class NotebookModule {}
