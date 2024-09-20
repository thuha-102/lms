import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OntologyService } from './ontology.service';
import { OntologyController } from './ontology.controller';
import { AuthModule } from 'src/domains/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, AuthModule, HttpModule],
  controllers: [OntologyController],
  providers: [OntologyService],
})
export class OntologyModule {}
