import { Controller, Get } from '@nestjs/common';
import { TypeLearnerService } from './typeLearner.service';
import { DatetimeService } from 'src/services/datetime/datetime.service';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('typeLearner')
export class TypeLearnerController {
  constructor(private readonly typeLearnerService: TypeLearnerService) {}

  @Get()
  async getMany() {
    try {
      const result = await this.typeLearnerService.getMany();
      return JSON.stringify(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
