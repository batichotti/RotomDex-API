import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PokemonMovesService } from './pokemon-moves.service';

@Controller('pokemon-moves')
export class PokemonMovesController {
  constructor(private readonly pokemonMovesService: PokemonMovesService) {}
  @Get('/moves/')
  findAll() {
    return this.pokemonMovesService.findAll();
  }

  @Get('/pokemon/:id')
  findByPokemon(@Param('id') id: string) {
    return this.pokemonMovesService.findByPokemon(+id);
  }

  @Get('/moves/:id')
  findByMoves(@Param('id') id: string) {
    return this.pokemonMovesService.findByPokemon(+id);
  }
}
