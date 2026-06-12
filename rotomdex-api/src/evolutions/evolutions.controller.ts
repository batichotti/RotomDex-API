import { Controller, Get, Param } from '@nestjs/common';
import { EvolutionsService } from './evolutions.service';

@Controller('pokemon_evolutions')
export class EvolutionsController {
  constructor(private readonly evolutionsService: EvolutionsService) {}

  @Get()
  findAll() {
    return this.evolutionsService.findAll();
  }

  @Get('from/:id')
  findOneFrom(@Param('id') id: string) {
    return this.evolutionsService.findOneFrom(+id);
  }

  @Get('to/:id')
  findOneTo(@Param('id') id: string) {
    return this.evolutionsService.findOneTo(+id);
  }
}
