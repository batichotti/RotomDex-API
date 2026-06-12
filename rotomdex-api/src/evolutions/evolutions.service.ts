import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Evolution } from './entities/evolution.entity';

@Injectable()
export class EvolutionsService {
  constructor(
        @InjectRepository(Evolution)
        private evolutionRepository: Repository<Evolution>,
      ) {}
  
  findAll() {
    return this.evolutionRepository.find();
  }

  findOneTo(id: number) {
    return this.evolutionRepository.findOneBy({pokemon_id: id});
  }

  findOneFrom(id: number) {
    return this.evolutionRepository.findBy({evolves_from_id: id});
  }
}
