import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Repository } from 'typeorm';
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
    const query = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .orderBy(`pokemon.${String(orderBy)}`, order);

    if (fill) {
      if (min !== undefined && max !== undefined) {
        query.andWhere(`pokemon.${fill} BETWEEN :min AND :max`, { min, max });
      } else if (min !== undefined) {
        query.andWhere(`pokemon.${fill} >= :min`, { min });
      } else if (max !== undefined) {
        query.andWhere(`pokemon.${fill} <= :max`, { max });
      }
    }

    if (type && type2) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            '(pokemon.primary_type ILIKE :type AND pokemon.secondary_type ILIKE :type2)',
            { type, type2 },
          ).orWhere(
            '(pokemon.primary_type ILIKE :type2 AND pokemon.secondary_type ILIKE :type)',
            { type, type2 },
          );
        }),
      );
    } else if (type) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('pokemon.primary_type ILIKE :type', { type }).orWhere('pokemon.secondary_type ILIKE :type', { type });
        }),
      );
    }

    return query.getMany();
  }
}
