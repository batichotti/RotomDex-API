import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Moves } from './entities/moves.entity';

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

  findFiltered(power: keyof Moves, order: 'ASC' | 'DESC' = 'DESC', type?: string, pp?: number, effect_chance?: number, damage_class?: string, category?: string, generation_introduced?: string, accuracy?: number, orderby: string | "power"){
    let where: any;

    return this.movesRepository.find({
      where,
      order: {
        [orderby]: order
      }
    });
  }
}
