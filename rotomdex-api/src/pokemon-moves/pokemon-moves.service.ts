import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PokemonMoves } from './entities/pokemon-moves.entity';

@Injectable()
export class PokemonMovesService {
  constructor (
    @InjectRepository(PokemonMoves)
    private pokemonMovesRepository: Repository<PokemonMoves>, 
  ) {}

  async findAll(page = 1, limit = 50) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 50);

    const [data, total] = await this.pokemonMovesRepository.findAndCount({
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  findByPokemon(id: string, orderBy?: string, order?: string, learn_method?: string, type?: string, power?: number, pp?: number, effect_chance?: number, accuracy?: number, min?: number, max?: number, fill?: string, damage_class?: string, category?: string, generation?: string) {
    const qb = this.pokemonMovesRepository
      .createQueryBuilder('pokemon_move')
      .leftJoinAndMapOne(
        'pokemon_move.move',
        'moves',
        'move',
        'move.id = pokemon_move.move_id',
      )
      .where('pokemon_move.pokemon_id = :id', { id });

    if (learn_method) qb.andWhere('pokemon_move.move_learn_method = :learn_method', { learn_method });

    // filters similar to MovesService.findFiltered
    if (type) qb.andWhere('move.type ILIKE :type', { type });
    if (power !== undefined) qb.andWhere('move.power = :power', { power });
    if (pp !== undefined) qb.andWhere('move.pp = :pp', { pp });
    if (effect_chance !== undefined) qb.andWhere('move.effect_chance = :effect_chance', { effect_chance });
    if (accuracy !== undefined) qb.andWhere('move.accuracy = :accuracy', { accuracy });
    if (damage_class) qb.andWhere('move.damage_class ILIKE :damage_class', { damage_class });
    if (category) qb.andWhere('move.category ILIKE :category', { category });
    if (generation) qb.andWhere('move.generation_introduced ILIKE :generation', { generation });

    if (fill) {
      if (min !== undefined && max !== undefined) {
        qb.andWhere(`move.${fill} BETWEEN :min AND :max`, { min, max });
      } else if (min !== undefined) {
        qb.andWhere(`move.${fill} >= :min`, { min });
      } else if (max !== undefined) {
        qb.andWhere(`move.${fill} <= :max`, { max });
      }
    }

    if (orderBy) {
      // guard against SQL injection by allowing only certain columns could be added later
      qb.orderBy(`move.${orderBy}`, (order?.toUpperCase() as 'ASC' | 'DESC') || 'ASC');
    }

    return qb.getMany();
  }

  findByMove(id: string, orderBy?: string, order?: string, learn_method?: string, type?: string, type2?: string, min?: number, max?: number, fill?: string) {
    const qb = this.pokemonMovesRepository
      .createQueryBuilder('pokemon_move')
      .leftJoinAndMapOne(
          'pokemon_move.pokemon',
          'pokemon',
          'pokemon',
          'pokemon.id = pokemon_move.pokemon_id',
        )
      .where('pokemon_move.move_id = :id', { id });
  
    if (learn_method) qb.andWhere('pokemon_move.move_learn_method = :learn_method', { learn_method });

    if (fill) {
      if (min !== undefined && max !== undefined) {
        qb.andWhere(`pokemon.${fill} BETWEEN :min AND :max`, { min, max });
      } else if (min !== undefined) {
        qb.andWhere(`pokemon.${fill} >= :min`, { min });
      } else if (max !== undefined) {
        qb.andWhere(`pokemon.${fill} <= :max`, { max });
      }
    }

    if (type && type2) {
      qb.andWhere(
        new Brackets((queryBuilder) => {
          queryBuilder
            .where('(pokemon.primary_type ILIKE :type AND pokemon.secondary_type ILIKE :type2)', { type, type2 })
            .orWhere('(pokemon.primary_type ILIKE :type2 AND pokemon.secondary_type ILIKE :type)', { type, type2 });
        }),
      );
    } else if (type) {
      qb.andWhere(
        new Brackets((queryBuilder) => {
          queryBuilder
            .where('pokemon.primary_type ILIKE :type', { type })
            .orWhere('pokemon.secondary_type ILIKE :type', { type });
        }),
      );
    }

    if (orderBy) {
      qb.orderBy(`pokemon.${orderBy}`, (order?.toUpperCase() as 'ASC' | 'DESC') || 'ASC');
    }

    return qb.getMany();

  }
}
