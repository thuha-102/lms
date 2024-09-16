import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OntologyModule } from 'src/services/ontology/ontology.module';
import { HttpModule } from '@nestjs/axios';
import { OntologyService } from 'src/services/ontology/ontology.service';

@Module({
  imports: [PrismaModule, OntologyModule, HttpModule],
  controllers: [UserController],
  providers: [UserService, OntologyService],
})
export class UserModule {}
