import { IsOptional, IsIn, IsEnum, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

const toBoolean = () =>
  Transform(({ value }) => {
    if (value === 'true'  || value === true  || value === 1 || value === '1') return true;
    if (value === 'false' || value === false || value === 0 || value === '0') return false;
    return undefined;
  });
export class EvolutionsQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    pokemon_name?: string;

    @ApiPropertyOptional({ minimum: 1, type: Number })
    @IsOptional()
    @Type(() => Number)
    @Min(1, {message: 'Pokémon ID must be at least 1'})
    pokemon_id?: number;

    @ApiPropertyOptional({ minimum: 1, type: Number })
    @IsOptional()
    @Type(() => Number)
    @Min(1, {message: 'Species ID must be at least 1'})
    @Max(1025, {message: 'Species ID max 1025'})
    evolves_from_id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    evolution_method?: string;

    @ApiPropertyOptional({ minimum: 1, type: Number})
    @IsOptional()
    @Type(() => Number)
    @Min(1, {message: 'Evolution stage must be at least 1'})
    @Max(3, {message: 'Evolution stage max is 3'})
    evolution_stage?: number;

    @ApiPropertyOptional({ type: Boolean})
    @IsOptional()
    @toBoolean()
    @IsBoolean()
    is_fully_evolved?: boolean;
}
