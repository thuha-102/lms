import { Controller, Get } from '@nestjs/common';
import { OntologyService } from './ontology.service';

@Controller('ontology')
export class OntologyController {
  constructor(private readonly ontologyService: OntologyService) {}

  @Get('learners')
  async getLearners() {
    return this.ontologyService.getLearners();
  }

  @Get('learners')
  async getLMs() {
    return this.ontologyService.getLMs();
  }

  @Get('learners')
  async getLogs() {
    return this.ontologyService.getLogs();
  }
}
