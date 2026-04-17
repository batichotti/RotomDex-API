import { Injectable } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';

@Injectable()
export class AbilitiesService {
  create(createAbilityDto: CreateAbilityDto) {
    return 'This action adds a new ability';
  }

  findAll() {
    return `This action returns all abilities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ability`;
  }

  update(id: number, updateAbilityDto: UpdateAbilityDto) {
    return `This action updates a #${id} ability`;
  }

  remove(id: number) {
    return `This action removes a #${id} ability`;
  }
}
