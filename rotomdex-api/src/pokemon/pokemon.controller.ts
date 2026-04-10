import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.entity';
import { ApiQuery } from '@nestjs/swagger';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Get()
    @ApiQuery({ name: 'type', required: false, enum: ['water', 'fire', 'grass', 'bug', 'eletric', 'normal', 'fighting', 'flying', 'ice', 'rock', 'ground', 'poison', 'ghost', 'psychic', 'dark', 'steel', 'fairy', 'dragon', 'stellar'] })
    @ApiQuery({ name: 'orderBy', required: false, enum: ['id', 'name', 'hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed'], default: 'id' })
    @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
    findAll(
        @Query('type') type?: string,
        @Query('orderBy') orderBy: keyof Pokemon = 'id',
        @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    ) {
        if (type) {
            return this.pokemonService.findFiltered(type, orderBy, order);
        }
        return this.pokemonService.findAll();
    }

    @Get(':identifier')
    findOne(@Param('identifier') identifier: string) {
        const asNumber = Number(identifier);

        if (!isNaN(asNumber)) {
            return this.pokemonService.findByDex(asNumber);
        }

        return this.pokemonService.findByName(identifier);
    }
}