import { Controller, Get, Param, Query } from '@nestjs/common';
import { EvolutionsService } from './evolutions.service';
import { EvolutionsQueryDto } from './dto/evolutions-query.dto';

@Controller('pokemon_evolutions')
export class EvolutionsController {
  constructor(private readonly evolutionsService: EvolutionsService) {}

  @Get()
  findAll(@Query() query: EvolutionsQueryDto) {
    return this.evolutionsService.findAll(query);
  }

  @Get('from/:id')
  findOneFrom(@Param('id') id: string) {
    return this.evolutionsService.findOneFrom(+id);
  }

  @Get('to/:id')
  findOneTo(@Param('id') id: string) {
    return this.evolutionsService.findOneTo(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.evolutionsService.findOne(+id);
  }
}
