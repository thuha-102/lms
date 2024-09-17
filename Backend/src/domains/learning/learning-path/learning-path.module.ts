import { PrismaModule } from 'src/services/prisma/prisma.module';
import { LearningPathConttroller } from './learning-path.controller';
import { LearningPathService } from './learning-path.service';
import { Module } from '@nestjs/common';
import { OntologyModule } from 'src/services/ontology/ontology.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, OntologyModule, HttpModule],
  controllers: [LearningPathConttroller],
  providers: [LearningPathService],
})
export class LearningPathModule {}
