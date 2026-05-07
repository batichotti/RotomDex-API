import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const ABILITIES_GENERATION = [3, 4, 5, 6, 7, 8, 9] as const;


export class AbilitiesQueryDto {
    @ApiPropertyOptional({ enum: ABILITIES_GENERATION })
    @IsOptional()
    @Type(() => Number)
    @IsIn([...ABILITIES_GENERATION], {message: `generation must be one of ${ABILITIES_GENERATION.join(', ')}`})
    generation_min?: number;

    @ApiPropertyOptional({ enum: ABILITIES_GENERATION })
    @IsOptional()
    @Type(() => Number)
    @IsIn([...ABILITIES_GENERATION], {message: `generation must be one of ${ABILITIES_GENERATION.join(', ')}`})
    generation?: number;

    @ApiPropertyOptional({ enum: ABILITIES_GENERATION })
    @IsOptional()
    @Type(() => Number)
    @IsIn([...ABILITIES_GENERATION], {message: `generation must be one of ${ABILITIES_GENERATION.join(', ')}`})
    generation_max?: number;
}