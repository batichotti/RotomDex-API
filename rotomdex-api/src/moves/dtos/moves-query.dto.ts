import { IsOptional, IsIn, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const MOVES_ATTRIBUTES = ['id', 'name', 'power', 'type', 'pp', 'effect_chance', 'damage_class', 'category', ]
const MOVES_ATTRIBUTES_TO_FILL = [ 'power', 'pp', 'effect_chance' ]
const MOVES_TYPES = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] as const;
const MOVES_DAMAGE_CLASS = ['physical', 'special', 'status']
const MOVES_CATEGORY = ['punching', 'dance', 'slicing', 'wind', 'biting', 'sound-based', 'powder and spore', 'explosive', 'ball and bomb', 'aura and pulse', 'damaging z-move', 'max']
const MOVES_GENERATION = ['generation-i', 'generation-ii', 'generation-iii', 'generation-iv', 'generation-v', 'generation-vi', 'generation-vii', 'generation-viii', 'generation-ix']


export class MovesQueryDto {
    @ApiPropertyOptional({ enum: MOVES_TYPES })
    @IsOptional()
    @IsIn([...MOVES_TYPES], { message: `type must be one of: ${MOVES_TYPES.join(', ')}` })
    type?: string;
    
    @ApiPropertyOptional({ minimum: 0, maximum: 250, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'power must be an integer' })
    @Min(0, { message: 'power must be at least 0' })
    @Max(250, { message: 'power must be at most 250' })
    power?: number;

    @ApiPropertyOptional({ minimum: 0, maximum: 100, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'pp must be an integer' })
    @Min(0, { message: 'pp must be at least 0' })
    @Max(64, { message: 'pp must be at most 64' })
    pp?: number;

    @ApiPropertyOptional({ minimum: 0, maximum: 100, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'effect_chance must be an integer' })
    @Min(0, { message: 'effect_chance must be at least 0' })
    @Max(100, { message: 'effect_chance must be at most 100' })
    effect_chance?: number;

    @ApiPropertyOptional({ minimum: 0, maximum: 100, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'accuracy must be an integer' })
    @Min(0, { message: 'accuracy must be at least 0' })
    @Max(100, { message: 'accuracy must be at most 100' })
    accuracy?: number;

    @ApiPropertyOptional({ minimum: 0, maximum: 250, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'It must be an integer' })
    @Min(0, { message: 'It must be at least 0' })
    @Max(250, { message: 'It must be at most 250' })
    min?: number;

    @ApiPropertyOptional({ minimum: 0, maximum: 250, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'It must be an integer' })
    @Min(0, { message: 'It must be at least 0' })
    @Max(250, { message: 'It must be at most 250' })
    max?: number;

    @ApiPropertyOptional({ enum: MOVES_ATTRIBUTES_TO_FILL })
    @IsOptional()
    @IsIn([...MOVES_ATTRIBUTES_TO_FILL], {message: `fill must be one of ${MOVES_ATTRIBUTES_TO_FILL.join(', ')}`})
    fill?: string;

    @ApiPropertyOptional({ enum: MOVES_DAMAGE_CLASS })
    @IsOptional()
    @IsIn([...MOVES_DAMAGE_CLASS], {message: `damage_class must be one of ${MOVES_DAMAGE_CLASS.join(', ')}`})
    damage_class?: string;

    @ApiPropertyOptional({ enum: MOVES_CATEGORY })
    @IsOptional()
    @IsIn([...MOVES_CATEGORY], {message: `category must be one of ${MOVES_CATEGORY.join(', ')}`})
    category?: string;

    @ApiPropertyOptional({ enum: MOVES_GENERATION })
    @IsOptional()
    @IsIn([...MOVES_GENERATION], {message: `generation must be one of ${MOVES_GENERATION.join(', ')}`})
    generation?: string;

    @ApiPropertyOptional({ enum: MOVES_ATTRIBUTES, default: 'name' })
    @IsOptional()
    @IsIn([...MOVES_ATTRIBUTES], { message: `orderBy must be one of: ${MOVES_ATTRIBUTES.join(', ')}` })
    orderBy: string = 'name';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
    order?: 'ASC' | 'DESC' = 'ASC';
}
