import { Controller, Get, Param, Query } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { AbilitiesQueryDto } from './dto/abilities-query.dto';

@Controller('abilities')
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Get()
  findAll(@Query() query: AbilitiesQueryDto) {
    if(!(query.generation_min || query.generation || query.generation_max)) return this.abilitiesService.findAll();
    else return this.abilitiesService.findFiltered(query);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.abilitiesService.findOne(name);
  }
}
