import { IsOptional, IsIn, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const POKEMON_TYPES = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] as const;
const POKEMON_ATTRIBUTES = ['id', 'species_id', 'name', 'bst', 'hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed', 'height', 'weight'] as const;
const POKEMON_ATTRIBUTES_TO_FILL = ['id', 'species_id', 'bst', 'hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed', 'height', 'weight'] as const;

export class PokemonQueryDto {
    @ApiPropertyOptional({ enum: POKEMON_TYPES })
    @IsOptional()
    @IsIn([...POKEMON_TYPES], { message: `First type must be one of: ${POKEMON_TYPES.join(', ')}` })
    type?: string;

    @ApiPropertyOptional({ enum: POKEMON_TYPES })
    @IsOptional()
    @IsIn([...POKEMON_TYPES], { message: `Second type must be one of: ${POKEMON_TYPES.join(', ')}` })
    type2?: string;

    @ApiPropertyOptional({ minimum: 1, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'It must be an integer' })
    @Min(1, { message: 'It must be at least 1' })
    min?: number;

    @ApiPropertyOptional({ minimum: 1, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'It must be an integer' })
    @Min(1, { message: 'It must be at least 1' })
    max?: number;

    @ApiPropertyOptional({ enum: POKEMON_ATTRIBUTES_TO_FILL })
    @IsOptional()
    @IsIn([...POKEMON_ATTRIBUTES_TO_FILL], {message: `fill must be one of ${POKEMON_ATTRIBUTES_TO_FILL.join(', ')}`})
    fill?: string;

    @ApiPropertyOptional({ enum: POKEMON_ATTRIBUTES, default: 'id' })
    @IsOptional()
    @IsIn([...POKEMON_ATTRIBUTES], { message: `orderBy must be one of: ${POKEMON_ATTRIBUTES.join(', ')}` })
    orderBy?: string = 'id';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
    order?: 'ASC' | 'DESC' = 'ASC';

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isLegendary?: boolean;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isMythical?: boolean;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isBaby?: boolean;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    hasGenderDifferences?: boolean;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    formsSwitchable?: boolean;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isMega?: boolean;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isGmax?: boolean;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isRegionalForm?: boolean;
}
