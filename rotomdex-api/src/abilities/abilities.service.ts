import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Abilities } from './entities/ability.entity';

const GENERATIONS = ['none', 'generation-i', 'generation-ii', 'generation-iii', 'generation-iv', 'generation-v', 'generation-vi', 'generation-vii', 'generation-viii', 'generation-ix']
@Injectable()
export class AbilitiesService {
  constructor(
      @InjectRepository(Abilities)
      private abilitiesRepository: Repository<Abilities>,
    ) {}


  findAll() {
    return this.abilitiesRepository.find();
  }

  findOne(name: string) {
    return this.abilitiesRepository.findBy({ name: ILike(`%${name}%`) });
  }

  findFiltered(generation_min: number, generation: number, generation_max: number) {
    const query = this.abilitiesRepository.createQueryBuilder('ability');

    

    if (generation_min !== undefined && generation_max !== undefined) {
      query.andWhere('ability.generation_introduced BETWEEN :generation_min AND :generation_max', {
        generation_min: GENERATIONS[generation_min],
        generation_max: GENERATIONS[generation_max],
      });
    } else if (generation_min !== undefined) {
      query.andWhere('ability.generation_introduced >= :generation_min', {
        generation_min: GENERATIONS[generation_min],
      });
    } else if (generation_max !== undefined) {
      query.andWhere('ability.generation_introduced <= :generation_max', {
        generation_max: GENERATIONS[generation_max],
      });
    } else if (generation !== undefined) {
      query.andWhere('ability.generation_introduced = :generation', {
        generation: GENERATIONS[generation],
      });
    }

    return query.getMany();
  }
}
