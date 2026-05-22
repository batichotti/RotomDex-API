import { IsOptional, IsIn, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

const POKEMON_TYPES = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] as const;
const POKEMON_ATTRIBUTES = ['attack', 'bst', 'defense', 'hp', 'id', 'name', 'special_attack', 'special_defense', 'speed', 'height', 'weight'] as const;
const POKEMON_ATTRIBUTES_TO_FILL = ['attack', 'bst', 'defense', 'hp', 'id', 'special_attack', 'special_defense', 'speed', 'height', 'weight'] as const;

export class AbilitiesPokemonDto{
    @ApiPropertyOptional({ type: Boolean, description: 'Filtra por hidden (true/false)' })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === true || value === 'true') return true;
        if (value === false || value === 'false') return false;
        return value;
    })
    @IsBoolean({ message: 'is_hidden must be true or false' })
    is_hidden?: boolean;

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
    @IsIn([...POKEMON_ATTRIBUTES_TO_FILL], {message: `damage_class must be one of ${POKEMON_ATTRIBUTES_TO_FILL.join(', ')}`})
    fill?: string;

    @ApiPropertyOptional({ enum: POKEMON_ATTRIBUTES, default: 'id' })
    @IsOptional()
    @IsIn([...POKEMON_ATTRIBUTES], { message: `orderBy must be one of: ${POKEMON_ATTRIBUTES.join(', ')}` })
    orderBy?: string = 'id';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
    order?: string;
}
