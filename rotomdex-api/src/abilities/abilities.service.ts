import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Abilities } from './entities/ability.entity';
@Injectable()
export class AbilitiesService {
  constructor(
      @InjectRepository(Abilities)
      private abilitiesRepository: Repository<Abilities>,
    ) {}


  findAll() {
    return this.abilitiesRepository.find();
  }

  findOne(id: number) {
    return this.abilitiesRepository.findOneBy({ id });
  }
}
