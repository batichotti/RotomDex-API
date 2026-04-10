import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.entity';
import { ApiQuery } from '@nestjs/swagger';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Get()
    @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
    @ApiQuery({ name: 'orderBy', required: false, enum: ['attack', 'bst', 'defense', 'height', 'hp', 'id', 'name', 'special_attack', 'special_defense', 'speed', 'weight'], default: 'id' })
    @ApiQuery({ name: 'type', required: false, enum: ['bug', 'dark', 'dragon', 'eletric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] })
    @ApiQuery({ name: 'type2', required: false, enum: ['bug', 'dark', 'dragon', 'eletric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] })
    findAll(
        @Query('type') type?: string,
        @Query('type2') type2?: string,
        @Query('orderBy') orderBy: keyof Pokemon = 'id',
        @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    ) {
        if (type) {
            return this.pokemonService.findFiltered(type, type2 || '', orderBy, order);
        }
        return this.pokemonService.findAll();
    }

    @Get(':identifier')
    findOne(@Param('identifier') identifier: string) {
        const asNumber = Number(identifier);

        if (!isNaN(asNumber)) {
            if (asNumber < 1 || asNumber > 1025) {
                throw new Error('Pokemon ID must be between 1 and 1025');
            }
            return this.pokemonService.findByDex(asNumber);
        }

        return this.pokemonService.findByName(identifier);
    }
}