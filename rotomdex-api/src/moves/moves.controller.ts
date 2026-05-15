import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovesService } from './moves.service';
import { MovesQueryDto } from './dtos/moves-query.dto';

@Controller('moves')
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Get()
  findAll(@Query() query: MovesQueryDto) {
    return this.movesService.findFiltered(query);
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.movesService.findByName(name);
  }
}
