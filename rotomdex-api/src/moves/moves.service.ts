import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Moves } from './moves.entity';

@Injectable()
export class MovesService {
  constructor(
    @InjectRepository(Moves)
    private movesRepository: Repository<Moves>,
  ) {}

  findAll() {
    return this.movesRepository.find();
  }

  findByName(name: string) {
    name = name.replace(" ", "-");
    return this.movesRepository.findBy({ name: ILike(`%${name}%`) });
  }
}
