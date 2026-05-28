import { PartialType } from '@nestjs/swagger';
import { CreateNatureDto } from './create-nature.dto';

export class UpdateNatureDto extends PartialType(CreateNatureDto) {}
