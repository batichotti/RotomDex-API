import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovesService } from './moves.service';
import { MovesQueryDto } from './dtos/moves-query.dto';

@Controller('moves')
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Get()
  findAll(@Query() query: MovesQueryDto) {
    const {type, power, pp, effect_chance, accuracy, min, max, fill, damage_class, category, generation, orderBy, order} = query;
    return this.movesService.findFiltered( orderBy, order, power, type, pp, effect_chance, accuracy, min, max, fill, damage_class, category, generation);
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.movesService.findByName(name);
  }
}
