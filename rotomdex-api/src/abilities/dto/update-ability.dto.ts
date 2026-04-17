import { PartialType } from '@nestjs/swagger';
import { CreateAbilityDto } from './create-ability.dto';

export class UpdateAbilityDto extends PartialType(CreateAbilityDto) {}
