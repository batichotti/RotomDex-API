import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PokemonMovesService } from './pokemon-moves.service';

@Controller('pokemon-moves')
export class PokemonMovesController {
  constructor(private readonly pokemonMovesService: PokemonMovesService) {}
  @Get()
  findAll() {
    return this.pokemonMovesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonMovesService.findOne(+id);
  }
}
