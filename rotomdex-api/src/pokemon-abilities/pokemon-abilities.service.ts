import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PokemonAbilities } from './entities/pokemon-abilities.entity';
import { AbilitiesPokemonDto } from './dto/abilities-pokemon-query.dto';

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

  findByPokemon(id: number, is_hidden?: boolean | string) {
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
  
  findByAbility(id: string, query: AbilitiesPokemonDto)  {
    const qb = this.pokemonAbilitiesRepository
      .createQueryBuilder('pokemon_ability')
      .leftJoinAndMapOne(
          'pokemon_ability.pokemon',
          'pokemon',
          'pokemon',
          'pokemon.id = pokemon_ability.pokemon_id',
        )
      .where('pokemon_ability.ability_id = :id', { id });
  
    if (query.is_hidden) qb.andWhere('pokemon_ability.is_hidden = :is_hidden', { is_hidden: query.is_hidden });

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
