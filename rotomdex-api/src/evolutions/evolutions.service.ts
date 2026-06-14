import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Evolution } from './entities/evolution.entity';
import { EvolutionsQueryDto } from './dto/evolutions-query.dto';

@Injectable()
export class EvolutionsService {
  constructor(
    @InjectRepository(Evolution)
    private evolutionRepository: Repository<Evolution>,
  ) { }

  findAll(query: EvolutionsQueryDto) {
    const qb = this.evolutionRepository.createQueryBuilder('pokemon_evolutions');

    if (query.pokemon_name) qb.andWhere({ pokemon_name: ILike(`%${query.pokemon_name}%`) });
    if (query.pokemon_id) qb.andWhere({ pokemon_id: query.pokemon_id });
    if (query.evolution_stage) qb.andWhere({ evolution_stage: query.evolution_stage });
    if (query.evolves_from_id) qb.andWhere({ evolves_from_id: query.evolves_from_id });
    if (query.is_fully_evolved !== undefined) qb.andWhere('pokemon_evolutions.is_fully_evolved = :is_fully_evolved', { is_fully_evolved: query.is_fully_evolved });
    if (query.evolution_method) qb.andWhere({ evolution_method: ILike(`%${query.evolution_method}%`) });

    return qb.getMany();
  }

  findOneTo(id: number) {
    return this.evolutionRepository.findOneBy({ pokemon_id: id });
  }

  findOneFrom(id: number) {
    return this.evolutionRepository.findBy({ evolves_from_id: id });
  }

  async findOne(id: number) {
    const [root] = await this.evolutionRepository.query(
      `
    WITH RECURSIVE ancestors AS (
        SELECT *
        FROM pokemon_evolutions
        WHERE pokemon_id = $1

        UNION ALL

        SELECT pe.*
        FROM pokemon_evolutions pe
        JOIN ancestors a
          ON a.evolves_from_id = pe.pokemon_id
    )
    SELECT *
    FROM ancestors
    WHERE evolves_from_id IS NULL
    LIMIT 1;
    `,
      [id],
    );

    if (!root) {
      return [];
    }

    return this.evolutionRepository.query(
      `
    WITH RECURSIVE descendants AS (
        SELECT *
        FROM pokemon_evolutions
        WHERE pokemon_id = $1

        UNION ALL

        SELECT pe.*
        FROM pokemon_evolutions pe
        JOIN descendants d
          ON pe.evolves_from_id = d.pokemon_id
    )
    SELECT *
    FROM descendants
    ORDER BY evolution_stage;
    `,
      [root.pokemon_id],
    );
  }cd
}
