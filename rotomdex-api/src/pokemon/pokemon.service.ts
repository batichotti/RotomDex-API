import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonQueryDto } from './dtos/pokemon-query.dto';

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
      name: ILike(`%${name}%`),
    });
  }

  findFiltered(query: PokemonQueryDto) {
    const qb = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .orderBy(`pokemon.${String(query.orderBy)}`, query.order);

    if (query.fill) {
      if (query.min !== undefined && query.max !== undefined) {
        qb.andWhere(`pokemon.${query.fill} BETWEEN :min AND :max`, { min: query.min, max: query.max });
      } else if (query.min !== undefined) {
        qb.andWhere(`pokemon.${query.fill} >= :min`, { min: query.min });
      } else if (query.max !== undefined) {
        qb.andWhere(`pokemon.${query.fill} <= :max`, { max: query.max });
      }
    }

    if (query.type && query.type2) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(
            `(pokemon.primary_type ILIKE :type AND pokemon.secondary_type ILIKE :type2)`,
            { type: `%${query.type}%`, type2: `%${query.type2}%` }
          ).orWhere(
            `(pokemon.primary_type ILIKE :type2 AND pokemon.secondary_type ILIKE :type)`,
            { type: `%${query.type}%`, type2: `%${query.type2}%` }
          );
        }),
      );
    } else if (query.type) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(`pokemon.primary_type ILIKE :type`, { type: `%${query.type}%` }).orWhere(`pokemon.secondary_type ILIKE :type`, { type: `%${query.type}%` });
        }),
      );
    }

    return qb.getMany();
  }
}
