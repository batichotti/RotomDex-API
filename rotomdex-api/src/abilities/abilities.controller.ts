import { Controller, Get, Param, Query } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { AbilitiesQueryDto } from './dto/abilities-query.dto';

@Controller('abilities')
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Get()
  findAll(@Query() query: AbilitiesQueryDto) {
    const {generation_min, generation, generation_max} = query;
    if(!(generation_min || generation || generation_max)) return this.abilitiesService.findAll();
    else return this.abilitiesService.findFiltered(generation_min!, generation!, generation_max!);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.abilitiesService.findOne(name);
  }
}
