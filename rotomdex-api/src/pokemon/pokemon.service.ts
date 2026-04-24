import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) { }

  findAll() {
    return this.pokemonRepository.find({
      order: {
        id: "ASC",
      }
    });
  }

  findByDex(id: number) {
    return this.pokemonRepository.findBy({
      id: id,
    });
  }

  findByName(name: string) {
    return this.pokemonRepository.findBy({
      name: ILike(name),
    });
  }

  findFiltered(orderBy: keyof Pokemon = 'id', order: 'ASC' | 'DESC' = 'ASC', type?: string, type2?: string, min?: number, max?: number, fill?: string) {
    let where: any = {};

    if (fill) {
          if (min !== undefined && max !== undefined) {
            where[fill] = Between(min, max);
          } else if (min !== undefined) {
            where[fill] = MoreThanOrEqual(min);
          } else if (max !== undefined) {
            where[fill] = LessThanOrEqual(max);
          }
        }

    if (type && type2) {
      where = [
        { primary_type: ILike(type), secondary_type: ILike(type2) },
        { primary_type: ILike(type2), secondary_type: ILike(type) },
      ];
    } else if (type) {
      where = [
        { primary_type: ILike(type) }, { secondary_type: ILike(type) }
      ];
    }

    if (type) {
      return this.pokemonRepository.find({
        where,
        order: {
          [orderBy]: order,
        },
      });
    } else {
      return this.pokemonRepository.find({
        where,
        order: {
          [orderBy]: order,
        },
      });
    }
  }
}
