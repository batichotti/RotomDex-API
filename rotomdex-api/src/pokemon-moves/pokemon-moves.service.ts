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

  findAll() {
    return this.pokemonMovesRepository.find();
  }

  findByPokemon(id: number) {
    return `This action returns a #${id} pokemonMove`;
  }

  findByAbility(id: number) {
    return `This action returns a #${id} pokemonMove`;
  }
}
