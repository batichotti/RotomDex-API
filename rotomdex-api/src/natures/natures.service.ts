import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Nature } from './entities/nature.entity';
import { NatureQueryDto } from './dto/nature-query.dto';

@Injectable()
export class NaturesService {
  constructor(
      @InjectRepository(Nature)
      private naturesRepository: Repository<Nature>,
    ) {}

  findAll(query: NatureQueryDto) {
    const qb = this.naturesRepository.createQueryBuilder('natures');

    if(query.decreased_stat) qb.andWhere({decreased_stat: query.decreased_stat});
    
    if(query.increased_stat) qb.andWhere({increased_stat: query.increased_stat});

    return qb.getMany();
  }

  findOne(name: string) {
    return this.naturesRepository.findBy({name: ILike(`%${name}%`)});
  }
}
