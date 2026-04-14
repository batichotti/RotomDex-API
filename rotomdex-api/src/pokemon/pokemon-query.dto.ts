import { IsOptional, IsIn, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const POKEMON_TYPES = ['bug', 'dark', 'dragon', 'eletric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] as const;
const POKEMON_ATTRIBUTES = ['attack', 'bst', 'defense', 'hp', 'id', 'name', 'special_attack', 'special_defense', 'speed', 'height', 'weight'] as const;

export class PokemonQueryDto {
    @ApiPropertyOptional({ enum: POKEMON_TYPES })
    @IsOptional()
    @IsIn([...POKEMON_TYPES], { message: `type must be one of: ${POKEMON_TYPES.join(', ')}` })
    type?: string;

    @ApiPropertyOptional({ enum: POKEMON_TYPES })
    @IsOptional()
    @IsIn([...POKEMON_TYPES], { message: `type2 must be one of: ${POKEMON_TYPES.join(', ')}` })
    type2?: string;

    @ApiPropertyOptional({ enum: POKEMON_ATTRIBUTES, default: 'id' })
    @IsOptional()
    @IsIn([...POKEMON_ATTRIBUTES], { message: `orderBy must be one of: ${POKEMON_ATTRIBUTES.join(', ')}` })
    orderBy?: string = 'id';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
    order?: 'ASC' | 'DESC' = 'DESC';
}