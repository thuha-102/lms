import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { StatementService } from './statement.service';
import { ForumController } from './forum.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [ForumService, StatementService],
  controllers: [ForumController],
})
export class ForumModule {}
