import { Controller, Get, Param } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';

@Controller('abilities')
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Get()
  findAll() {
    return this.abilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abilitiesService.findOne(+id);
  }
}
