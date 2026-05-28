import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NaturesService } from './natures.service';

@Controller('natures')
export class NaturesController {
  constructor(private readonly naturesService: NaturesService) {}

  @Get()
  findAll() {
    return this.naturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.naturesService.findOne(+id);
  }

}
