import { Module } from '@nestjs/common';
import { LearningMaterialService } from './learning-material.service';
import { LearningMaterialController } from './learning-material.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { AuthModule } from 'src/domains/auth/auth.module';
import { FileModule } from 'src/services/file/file.module';

@Module({
  imports: [PrismaModule, AuthModule, FileModule],
  providers: [LearningMaterialService],
  controllers: [LearningMaterialController],
})
export class LearningMaterialModule {}
