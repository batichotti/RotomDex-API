import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PokemonMoves } from './entities/pokemon-moves.entity';
import { PokemonMovesDto } from './dto/pokemon-moves-query.dto';
import { MovesPokemonDto } from './dto/moves-pokemon-query.dto ';

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

  findByPokemon(id: string, query: PokemonMovesDto) {
    const qb = this.pokemonMovesRepository
      .createQueryBuilder('pokemon_move')
      .leftJoinAndMapOne(
        'pokemon_move.move',
        'moves',
        'move',
        'move.id = pokemon_move.move_id',
      )
      .where('pokemon_move.pokemon_id = :id', { id });

    if (query.learn_method) qb.andWhere('pokemon_move.move_learn_method = :learn_method', { learn_method: query.learn_method });

    // filters similar to MovesService.findFiltered
    if (query.type) qb.andWhere('move.type ILIKE :type', { type: query.type });
    if (query.power !== undefined) qb.andWhere('move.power = :power', { power: query.power });
    if (query.pp !== undefined) qb.andWhere('move.pp = :pp', { pp: query.pp });
    if (query.effect_chance !== undefined) qb.andWhere('move.effect_chance = :effect_chance', { effect_chance: query.effect_chance });
    if (query.accuracy !== undefined) qb.andWhere('move.accuracy = :accuracy', { accuracy: query.accuracy });
    if (query.damage_class) qb.andWhere('move.damage_class ILIKE :damage_class', { damage_class: query.damage_class });
    if (query.category) qb.andWhere('move.category ILIKE :category', { category: query.category });
    if (query.generation) qb.andWhere('move.generation_introduced ILIKE :generation', { generation: query.generation });

    if (query.fill) {
      if (query.min !== undefined && query.max !== undefined) {
        qb.andWhere(`move.${query.fill} BETWEEN :min AND :max`, { min: query.min, max: query.max });
      } else if (query.min !== undefined) {
        qb.andWhere(`move.${query.fill} >= :min`, { min: query.min });
      } else if (query.max !== undefined) {
        qb.andWhere(`move.${query.fill} <= :max`, { max: query.max });
      }
    }

    if (query.orderBy) {
      // guard against SQL injection by allowing only certain columns could be added later
      qb.orderBy(`move.${query.orderBy}`, (query.order?.toUpperCase() as 'ASC' | 'DESC') || 'ASC');
    }

    return qb.getMany();
  }

  findByMove(id: string, query: MovesPokemonDto) {
    const qb = this.pokemonMovesRepository
      .createQueryBuilder('pokemon_move')
      .leftJoinAndMapOne(
          'pokemon_move.pokemon',
          'pokemon',
          'pokemon',
          'pokemon.id = pokemon_move.pokemon_id',
        )
      .where('pokemon_move.move_id = :id', { id });
  
    if (query.learn_method) qb.andWhere('pokemon_move.move_learn_method = :learn_method', { learn_method: query.learn_method });

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
        new Brackets((queryBuilder) => {
          queryBuilder
            .where('(pokemon.primary_type ILIKE :type AND pokemon.secondary_type ILIKE :type2)', { type: query.type, type2: query.type2 })
            .orWhere('(pokemon.primary_type ILIKE :type2 AND pokemon.secondary_type ILIKE :type)', { type: query.type, type2: query.type2 });
        }),
      );
    } else if (query.type) {
      qb.andWhere(
        new Brackets((queryBuilder) => {
          queryBuilder
            .where('pokemon.primary_type ILIKE :type', { type: query.type })
            .orWhere('pokemon.secondary_type ILIKE :type', { type: query.type });
        }),
      );
    }

    if (query.orderBy) {
      qb.orderBy(`pokemon.${query.orderBy}`, (query.order?.toUpperCase() as 'ASC' | 'DESC') || 'ASC');
    }

    return qb.getMany();

  }
}
