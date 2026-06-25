import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const NATURE_ATTRIBUTES = ['attack', 'defense' , 'special-attack', 'special-defense', 'speed'] as const;

export class NatureQueryDto {
    @ApiPropertyOptional({ enum: NATURE_ATTRIBUTES })
    @IsOptional()
    @IsString()
    @IsIn([...NATURE_ATTRIBUTES], { message: `Attribute type must be one of: ${NATURE_ATTRIBUTES.join(', ')}` })
    decreased_stat?: string;

    @ApiPropertyOptional({ enum: NATURE_ATTRIBUTES })
    @IsOptional()
    @IsString()
    @IsIn([...NATURE_ATTRIBUTES], { message: `Attribute type must be one of: ${NATURE_ATTRIBUTES.join(', ')}` })
    increased_stat?: string;
}
