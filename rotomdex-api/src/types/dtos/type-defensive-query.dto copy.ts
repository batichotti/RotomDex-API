import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const POKEMON_TYPES = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export class TypeQueryDto {
    @ApiPropertyOptional({ enum: POKEMON_TYPES })
    @IsIn([...POKEMON_TYPES], { message: `First type must be one of: ${POKEMON_TYPES.join(', ')}` })
    type!: string;
    

    @ApiPropertyOptional({ enum: POKEMON_TYPES })
    @IsOptional()
    @IsIn([...POKEMON_TYPES], { message: `First type must be one of: ${POKEMON_TYPES.join(', ')}` })
    type2?: string;
}
