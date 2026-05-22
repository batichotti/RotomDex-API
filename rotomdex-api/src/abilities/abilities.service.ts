import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Abilities } from './entities/ability.entity';
import { AbilitiesQueryDto } from './dto/abilities-query.dto';

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
    name = name.replace(/ /g, '-');
    return this.abilitiesRepository.findBy({ name: ILike(`%${name}%`) });
  }

  findFiltered(query: AbilitiesQueryDto ) {
    const qb = this.abilitiesRepository.createQueryBuilder('ability');

    

    if (query.generation_min !== undefined && query.generation_max !== undefined) {
      qb.andWhere('ability.generation_introduced BETWEEN :generation_min AND :generation_max', {
        generation_min: GENERATIONS[query.generation_min],
        generation_max: GENERATIONS[query.generation_max],
      });
    } else if (query.generation_min !== undefined) {
      qb.andWhere('ability.generation_introduced >= :generation_min', {
        generation_min: GENERATIONS[query.generation_min],
      });
    } else if (query.generation_max !== undefined) {
      qb.andWhere('ability.generation_introduced <= :generation_max', {
        generation_max: GENERATIONS[query.generation_max],
      });
    } else if (query.generation !== undefined) {
      qb.andWhere('ability.generation_introduced = :generation', {
        generation: GENERATIONS[query.generation],
      });
    }

    return qb.getMany();
  }
}
