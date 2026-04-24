import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonMovesService {
  findAll() {
    return `This action returns all pokemonMoves`;
  }

  findByPokemon(id: number) {
    return `This action returns a #${id} pokemonMove`;
  }

  findByAbility(id: number) {
    return `This action returns a #${id} pokemonMove`;
  }
}
