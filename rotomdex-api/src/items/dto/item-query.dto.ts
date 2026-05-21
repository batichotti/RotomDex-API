import { IsOptional, IsIn, IsNumber, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const ITEM_CATEGORIES = [
  'standard-balls',
  'special-balls',
  'healing',
  'status-cures',
  'revival',
  'vitamins',
  'pp-recovery',
  'stat-boosts',
  'spelunking',
  'flutes',
  'collectibles',
  'evolution',
  'loot',
  'mulch',
  'dex-completion',
  'species-specific',
  'all-mail',
  'medicine',
] as const;

export class ItemsQueryDto {
    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    cost_min?: number;

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    cost_max?: number;

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    cost?: number;

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @IsString()
    fling_power?: string;
    
    @ApiPropertyOptional({ enum: ITEM_CATEGORIES })
    @IsOptional()
    @IsIn([...ITEM_CATEGORIES], {message: `category must be one of ${ITEM_CATEGORIES.join(', ')}`})
    category?: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ enum: ['name', 'cost', 'fling_power'] })
    @IsOptional()
    @IsIn(['name', 'cost', 'fling_power'], { message: 'orderBy must be one of: name, cost, fling_power' })
    orderBy?: 'name' | 'cost' | 'fling_power';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsIn(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
    order?: 'ASC' | 'DESC';
}
