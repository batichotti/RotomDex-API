import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';

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
