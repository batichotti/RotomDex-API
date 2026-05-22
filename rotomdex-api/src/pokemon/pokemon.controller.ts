import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { PokemonQueryDto } from './dtos/pokemon-query.dto';

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Get()
    findAll(@Query() query: PokemonQueryDto) {
        if (query.type2 && !query.type) {
            throw new BadRequestException('Type 2 cannot be used without Type 1');
        }

        return this.pokemonService.findFiltered( query );
    }

    @Get(':identifier')
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

    @Get('species/:identifier')
    findOneBySpecies(@Param('identifier') identifier: string){
        const asNumber = Number(identifier);

        if(!isNaN(asNumber)){
            if (asNumber < 1 || asNumber > 1025) {
                throw new BadRequestException('Pokemon ID must be between 1 and 1025');
            }
            return this.pokemonService.findBySpeciesId(asNumber);
        }
        return this.pokemonService.findBySpeciesName(identifier);
    }
}
