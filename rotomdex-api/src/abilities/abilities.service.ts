import { Injectable } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';

@Injectable()
export class AbilitiesService {
  findAll() {
    return `This action returns all abilities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ability`;
  }
}
