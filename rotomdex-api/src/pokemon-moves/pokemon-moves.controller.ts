import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonMovesService } from './pokemon-moves.service';
import { ApiQuery } from '@nestjs/swagger';
import { PokemonMovesDto } from './dto/pokemon-moves-query.dto';
import { MovesPokemonDto } from './dto/moves-pokemon-query.dto ';

@Controller('pokemon-moves')
export class PokemonMovesController {
  constructor(private readonly pokemonMovesService: PokemonMovesService) {}
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.pokemonMovesService.findAll(Number(page), Number(limit));
  }

  @Get('/pokemon/:id')
  findByPokemon(@Param('id') id: string, @Query() query: PokemonMovesDto) {
    return this.pokemonMovesService.findByPokemon(id, query);
  }

  @Get('/moves/:id')
  findByMoves(@Param('id') id: string, @Query() query: MovesPokemonDto) {
    const {learn_method, type, type2, min, max, fill, orderBy, order} = query;
    return this.pokemonMovesService.findByMove(id, query);
  }
}
