import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovesService } from './moves.service';

@Controller('moves')
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Get()
  findAll() {
    return this.movesService.findAll();
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.movesService.findByName(name);
  }
  
}
