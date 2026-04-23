import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonMovesService {
  findAll() {
    return `This action returns all pokemonMoves`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemonMove`;
  }
}
