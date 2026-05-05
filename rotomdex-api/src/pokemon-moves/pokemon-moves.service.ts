import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findByPokemon(id: number) {
      return this.pokemonMovesRepository
        .createQueryBuilder('pokemon_move')
        .leftJoinAndMapOne(
          'pokemon_move.move',
          'moves',
          'move',
          'move.id = pokemon_move.move_id',
        )
        .where('pokemon_move.pokemon_id = :id', { id })
        .getMany();
  }

  findByMove(id: number) {
    return this.pokemonMovesRepository
      .createQueryBuilder('pokemon_move')
      .leftJoinAndMapOne(
          'pokemon_move.pokemon',
          'pokemon',
          'pokemon',
          'pokemon.id = pokemon_move.pokemon_id',
        )
      .where('pokemon_move.move_id = :id', { id })
      .getMany();
  }
}
