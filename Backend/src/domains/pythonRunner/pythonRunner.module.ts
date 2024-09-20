import { Module } from '@nestjs/common';
import {} from './pythonRunner.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { PythonRunnerController } from './pythonRunner.controller';

@Module({
  imports: [PrismaModule],
  providers: [],
  controllers: [PythonRunnerController],
})
export class PythonRunnerModule {}
