import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonAbilitiesService } from './pokemon-abilities.service';
import { ApiQuery } from '@nestjs/swagger';
import { AbilitiesPokemonDto } from './dto/abilities-pokemon-query.dto';


@Controller('pokemon-abilities')
export class PokemonAbilitiesController {
  constructor(private readonly pokemonAbilitiesService: PokemonAbilitiesService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'is_hidden', required: false, type: Boolean })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('is_hidden') is_hidden?: boolean) {
    return this.pokemonAbilitiesService.findAll(Number(page), Number(limit), is_hidden);
  }

  @Get('/pokemon/:id')
  @ApiQuery({ name: 'is_hidden', required: false, type: Boolean })
  findByPokemon(@Param('id') id: string, @Query('is_hidden') is_hidden?: boolean) {
    return this.pokemonAbilitiesService.findByPokemon(+id, is_hidden);
  }
  
  @Get('/ability/:id')
  findByAbility(@Param('id') id: string, @Query() query: AbilitiesPokemonDto) {
    return this.pokemonAbilitiesService.findByAbility(id, query);
  }
}
