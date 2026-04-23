import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) { }

  findAll() {
    return this.pokemonRepository.find({
      order: {
        id: "ASC",
      }
    });
  }

  findByDex(id: number) {
    return this.pokemonRepository.findBy({
      id: id,
    });
  }

  findByName(name: string) {
    return this.pokemonRepository.findBy({
      name: ILike(name),
    });
  }

  findFiltered(stat: keyof Pokemon, order: 'ASC' | 'DESC' = 'ASC', type?: string, type2?: string) {
    let where: any;

    if (type && type2) {
      where = [
        { primary_type: ILike(type), secondary_type: ILike(type2) },
        { primary_type: ILike(type2), secondary_type: ILike(type) },
      ];
    } else if (type) {
      where = [
        { primary_type: ILike(type) }, { secondary_type: ILike(type) }
      ];
    }

    if (type) {
      return this.pokemonRepository.find({
        where,
        order: {
          [stat]: order,
        },
      });
    } else {
      return this.pokemonRepository.find({
        order: {
          [stat]: order,
        },
      });
    }
  }
}
