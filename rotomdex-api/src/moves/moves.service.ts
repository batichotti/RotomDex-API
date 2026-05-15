import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Moves } from './entities/moves.entity';
import { MovesQueryDto } from './dtos/moves-query.dto';

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

  findFiltered(query: MovesQueryDto){
    let where: any = {};

    if (query.orderBy == 'power') {
      where.damage_class = Not(ILike('status'));
    }

    if (query.type) where.type = ILike(query.type);

    if (query.power) where.power = query.power;

    if (query.pp) where.pp = query.pp;

    if (query.effect_chance) where.effect_chance = ILike(query.effect_chance);

    if (query.accuracy) where.accuracy = query.accuracy;

    if (query.damage_class) where.damage_class = ILike(query.damage_class);

    if (query.category) where.category = ILike(query.category);

    if (query.generation) where.generation_introduced = ILike(query.generation);

    if (query.fill) {
      if (query.min !== undefined && query.max !== undefined) {
        where[query.fill] = Between(query.min, query.max);
      } else if (query.min !== undefined) {
        where[query.fill] = MoreThanOrEqual(query.min);
      } else if (query.max !== undefined) {
        where[query.fill] = LessThanOrEqual(query.max);
      }
    }

    return this.movesRepository.find({
      where,
      order: {
        [query.orderBy]: query.order
      }
    });
  }
}
