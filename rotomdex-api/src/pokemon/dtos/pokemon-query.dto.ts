import { IsOptional, IsIn, IsEnum, IsInt, Min, IsBoolean, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

const POKEMON_TYPES = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] as const;
const POKEMON_TYPES2 = [...POKEMON_TYPES, 'None'] as const;
const POKEMON_ATTRIBUTES = ['id', 'species_id', 'name', 'bst', 'hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed', 'height', 'weight', 'base_experience'] as const;
const POKEMON_ATTRIBUTES_TO_FILL = ['id', 'species_id', 'bst', 'hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed', 'height', 'weight', 'base_experience'] as const;

const GENERATIONS = ['generation-i', 'generation-ii', 'generation-iii', 'generation-iv', 'generation-v', 'generation-vi', 'generation-vii', 'generation-viii', 'generation-ix'] as const;

const EGG_GROUPS = ['monster', 'water1', 'bug', 'flying', 'ground', 'fairy', 'plant', 'humanshape', 'water3', 'mineral', 'indeterminate', 'water2', 'ditto', 'dragon', 'no-eggs'] as const;

const toBoolean = () =>
  Transform(({ value }) => {
    if (value === 'true'  || value === true  || value === 1 || value === '1') return true;
    if (value === 'false' || value === false || value === 0 || value === '0') return false;
    return undefined;
  });

export class PokemonQueryDto {
  @ApiPropertyOptional({ enum: POKEMON_TYPES })
  @IsOptional()
  @IsIn([...POKEMON_TYPES], { message: `First type must be one of: ${POKEMON_TYPES.join(', ')}` })
  type?: string;

  @ApiPropertyOptional({ enum: POKEMON_TYPES2 })
  @IsOptional()
  @IsIn([...POKEMON_TYPES2], { message: `Second type must be one of: ${POKEMON_TYPES2.join(', ')}` })
  type2?: string;

  @ApiPropertyOptional({ description: 'Filtrar pelo nome (parcial, case-insensitive)' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar pelo species_name (parcial, case-insensitive)' })
  @IsOptional()
  speciesName?: string;

  @ApiPropertyOptional({ enum: GENERATIONS })
  @IsOptional()
  @IsIn([...GENERATIONS], { message: `generation must be one of: ${GENERATIONS.join(', ')}` })
  generation?: string;

  @ApiPropertyOptional({ enum: EGG_GROUPS })
  @IsOptional()
  @IsIn([...EGG_GROUPS], { message: `eggGroup1 must be one of: ${EGG_GROUPS.join(', ')}` })
  eggGroup1?: string;

  @ApiPropertyOptional({ enum: EGG_GROUPS })
  @IsOptional()
  @IsIn([...EGG_GROUPS], { message: `eggGroup2 must be one of: ${EGG_GROUPS.join(', ')}` })
  eggGroup2?: string;

  @ApiPropertyOptional({ enum: POKEMON_ATTRIBUTES_TO_FILL })
  @IsOptional()
  @IsIn([...POKEMON_ATTRIBUTES_TO_FILL], { message: `fill must be one of ${POKEMON_ATTRIBUTES_TO_FILL.join(', ')}` })
  fill?: string;

  @ApiPropertyOptional({ minimum: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'min must be an integer' })
  @Min(1, { message: 'min must be at least 1' })
  min?: number;

  @ApiPropertyOptional({ minimum: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'max must be an integer' })
  @Min(1, { message: 'max must be at least 1' })
  max?: number;

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
  @toBoolean()
  @IsBoolean()
  isLegendary?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBoolean()
  @IsBoolean()
  isMythical?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBoolean()
  @IsBoolean()
  isBaby?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBoolean()
  @IsBoolean()
  hasGenderDifferences?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBoolean()
  @IsBoolean()
  formsSwitchable?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBoolean()
  @IsBoolean()
  isMega?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBoolean()
  @IsBoolean()
  isGmax?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBoolean()
  @IsBoolean()
  isRegionalForm?: boolean;
}