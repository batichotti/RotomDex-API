import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
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

  findFiltered(orderBy: string | 'power', order: 'ASC' | 'DESC' = 'DESC', power?: number, type?: string, pp?: number, effect_chance?: number, accuracy?: number, min?: number, max?: number, fill?: string, damage_class?: string, category?: string, generation_introduced?: string){
    let where: any = {};

    if (orderBy == 'power') {
      where.damage_class = Not(ILike('status'));
    }

    if (type) where.type = ILike(type);

    if (power) where.power = power;

    if (pp) where.pp = pp;

    if (effect_chance) where.effect_chance = ILike(effect_chance);

    if (accuracy) where.accuracy = accuracy;

    if (damage_class) where.damage_class = ILike(damage_class);

    if (category) where.category = ILike(category);

    if (generation_introduced) where.generation_introduced = ILike(generation_introduced);

    if (fill) {
      if (min !== undefined && max !== undefined) {
        where[fill] = Between(min, max);
      } else if (min !== undefined) {
        where[fill] = MoreThanOrEqual(min);
      } else if (max !== undefined) {
        where[fill] = LessThanOrEqual(max);
      }
    }

    return this.movesRepository.find({
      where,
      order: {
        [orderBy]: order
      }
    });
  }
}
