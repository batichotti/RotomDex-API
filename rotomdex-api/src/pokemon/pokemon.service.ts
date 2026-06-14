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
  ) {}

  findAll() {
    return this.pokemonRepository.find({ order: { id: 'ASC' } });
  }

  findByDex(id: number) {
    return this.pokemonRepository.find({
      where: { id },
      order: { id: 'ASC' },
    });
  }

  findByName(name: string) {
    name = name.replace(/ /g, '-');
    return this.pokemonRepository.find({
      where: { name: ILike(`%${name}%`) },
      order: { id: 'ASC' },
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
            { type: `%${query.type}%`, type2: `%${query.type2}%` },
          ).orWhere(
            `(pokemon.primary_type ILIKE :type2 AND pokemon.secondary_type ILIKE :type)`,
            { type: `%${query.type}%`, type2: `%${query.type2}%` },
          );
        }),
      );
    } else if (query.type) {
      qb.andWhere(
        new Brackets((qb) => {
          qb
            .where(`pokemon.primary_type ILIKE :type`, { type: `%${query.type}%` })
            .orWhere(`pokemon.secondary_type ILIKE :type`, { type: `%${query.type}%` });
        }),
      );
    }

    if (query.name) {
      const normalised = query.name.replace(/ /g, '-');
      qb.andWhere('pokemon.name ILIKE :name', { name: `%${normalised}%` });
    }

    if (query.speciesName) {
      const normalised = query.speciesName.replace(/ /g, '-');
      qb.andWhere('pokemon.species_name ILIKE :speciesName', { speciesName: `%${normalised}%` });
    }

    if (query.generation) {
      qb.andWhere('pokemon.generation ILIKE :generation', { generation: `%${query.generation}%` });
    }

    if (query.eggGroup1 && query.eggGroup2) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(
            `(pokemon.egg_group_1 ILIKE :eg1 AND pokemon.egg_group_2 ILIKE :eg2)`,
            { eg1: `%${query.eggGroup1}%`, eg2: `%${query.eggGroup2}%` },
          ).orWhere(
            `(pokemon.egg_group_1 ILIKE :eg2 AND pokemon.egg_group_2 ILIKE :eg1)`,
            { eg1: `%${query.eggGroup1}%`, eg2: `%${query.eggGroup2}%` },
          );
        }),
      );
    } else if (query.eggGroup1) {
      qb.andWhere(
        new Brackets((qb) => {
          qb
            .where(`pokemon.egg_group_1 ILIKE :eg1`, { eg1: `%${query.eggGroup1}%` })
            .orWhere(`pokemon.egg_group_2 ILIKE :eg1`, { eg1: `%${query.eggGroup1}%` });
        }),
      );
    } else if (query.eggGroup2) {
      qb.andWhere(
        new Brackets((qb) => {
          qb
            .where(`pokemon.egg_group_1 ILIKE :eg2`, { eg2: `%${query.eggGroup2}%` })
            .orWhere(`pokemon.egg_group_2 ILIKE :eg2`, { eg2: `%${query.eggGroup2}%` });
        }),
      );
    }

    if (query.isLegendary !== undefined)
      qb.andWhere('pokemon.is_legendary = :isLegendary', { isLegendary: query.isLegendary });

    if (query.isMythical !== undefined)
      qb.andWhere('pokemon.is_mythical = :isMythical', { isMythical: query.isMythical });

    if (query.isBaby !== undefined)
      qb.andWhere('pokemon.is_baby = :isBaby', { isBaby: query.isBaby });

    if (query.hasGenderDifferences !== undefined)
      qb.andWhere('pokemon.has_gender_differences = :hasGenderDifferences', { hasGenderDifferences: query.hasGenderDifferences });

    if (query.formsSwitchable !== undefined)
      qb.andWhere('pokemon.forms_switchable = :formsSwitchable', { formsSwitchable: query.formsSwitchable });

    if (query.isMega !== undefined)
      qb.andWhere('pokemon.is_mega = :isMega', { isMega: query.isMega });

    if (query.isGmax !== undefined)
      qb.andWhere('pokemon.is_gmax = :isGmax', { isGmax: query.isGmax });

    if (query.isRegionalForm !== undefined)
      qb.andWhere('pokemon.is_regional_form = :isRegionalForm', { isRegionalForm: query.isRegionalForm });

    return qb.getMany();
  }

  findBySpeciesId(id: number) {
    return this.pokemonRepository.findOne({
      where: { species_id: id },
      order: { id: 'ASC' },
    });
  }

  async findBySpeciesName(name: string) {
    name = name.replace(/ /g, '-');

    const matched = await this.pokemonRepository.findOne({
      where: { name: ILike(`%${name}%`) },
    });

    if (!matched) return null;

    return this.pokemonRepository.findOne({
      where: { species_id: matched.species_id },
      order: { id: 'ASC' },
    });
  }
}