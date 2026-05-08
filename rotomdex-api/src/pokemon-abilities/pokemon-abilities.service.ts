import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PokemonAbilities } from './entities/pokemon-abilities.entity';

@Injectable()
export class PokemonAbilitiesService {
  constructor (
      @InjectRepository(PokemonAbilities)
      private pokemonAbilitiesRepository: Repository<PokemonAbilities>, 
    ) {}
  
    async findAll(page = 1, limit = 50, is_hidden?: boolean | string) {
      const safePage = Math.max(1, Number(page) || 1);
      const safeLimit = Math.max(1, Number(limit) || 50);

      const query = this.pokemonAbilitiesRepository
        .createQueryBuilder('pokemon_abilities')
        .orderBy('pokemon_abilities.pokemon_id', 'ASC')
        .skip((safePage - 1) * safeLimit)
        .take(safeLimit);

      if (is_hidden !== undefined && is_hidden !== null && `${is_hidden}` !== '') {
        query.andWhere('pokemon_abilities.is_hidden = :isHidden', { isHidden: true });
      }

      const [data, total] = await query.getManyAndCount();
  
      return {
        data,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      };
    }

  findByPokemon(id: number, is_hidden) {
    const qb = this.pokemonAbilitiesRepository
      .createQueryBuilder('pokemon_ability')
      .leftJoinAndMapOne(
          'pokemon_ability.ability',
          'abilities',
          'ability',
          'ability.id = pokemon_ability.ability_id',
        )
      .where('pokemon_ability.pokemon_id = :id', { id })
      .orderBy('pokemon_ability.ability_slot', 'ASC');

    if (is_hidden) qb.andWhere('pokemon_ability.is_hidden = :is_hidden', { is_hidden });
    
    return qb.getMany();
  }
  
  findByAbility(id: string, orderBy?: string, order?: string, is_hidden?: boolean, type?: string, type2?: string, min?: number, max?: number, fill?: string)  {
    const qb = this.pokemonAbilitiesRepository
      .createQueryBuilder('pokemon_ability')
      .leftJoinAndMapOne(
          'pokemon_ability.pokemon',
          'pokemon',
          'pokemon',
          'pokemon.id = pokemon_ability.pokemon_id',
        )
      .where('pokemon_ability.ability_id = :id', { id });
  
    if (is_hidden) qb.andWhere('pokemon_ability.is_hidden = :is_hidden', { is_hidden });

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
