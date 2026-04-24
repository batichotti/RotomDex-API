import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonMovesService } from './pokemon-moves.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('pokemon-moves')
export class PokemonMovesController {
  constructor(private readonly pokemonMovesService: PokemonMovesService) {}
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pokemonMovesService.findAll(Number(page), Number(limit));
  }

  @Get('/pokemon/:id')
  findByPokemon(@Param('id') id: string) {
    return this.pokemonMovesService.findByPokemon(+id);
  }

  @Get('/moves/:id')
  findByMoves(@Param('id') id: string) {
    return this.pokemonMovesService.findByMove(+id);
  }
}
