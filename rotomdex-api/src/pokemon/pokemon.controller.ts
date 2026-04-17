import { Controller, Get, Param, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonQueryDto } from './dtos/pokemon-query.dto';

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Get()
    @ApiOperation({ summary: 'List all pokemon with optional filters' })
    @ApiResponse({ status: 200, description: 'Returns a list of pokemon' })
    @ApiResponse({ status: 400, description: 'Invalid query parameters' })
    findAll(@Query() query: PokemonQueryDto) {
        const { type, type2, orderBy, order } = query;

        if (type2 && !type) {
            throw new BadRequestException('Type 2 cannot be used without Type 1');
        }

        if (type) {
            return this.pokemonService.findFiltered( orderBy as keyof Pokemon, order, type, type2 || '' );
        }

        return this.pokemonService.findAll();
    }

    @Get(':identifier')
    @ApiOperation({ summary: 'Find a pokemon by ID or name' })
    @ApiParam({ name: 'identifier', description: 'Pokemon ID (1-1025) or name' })
    @ApiResponse({ status: 200, description: 'Returns the pokemon' })
    @ApiResponse({ status: 400, description: 'Invalid ID range' })
    @ApiResponse({ status: 404, description: 'Pokemon not found' })
    findOne(@Param('identifier') identifier: string) {
        const asNumber = Number(identifier);

        if (!isNaN(asNumber)) {
            if (asNumber < 1 || asNumber > 1025) {
                throw new BadRequestException('Pokemon ID must be between 1 and 1025');
            }
            return this.pokemonService.findByDex(asNumber);
        }

        return this.pokemonService.findByName(identifier);
    }
}