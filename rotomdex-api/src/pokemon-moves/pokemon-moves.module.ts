import { Module } from '@nestjs/common';
import { PokemonMovesService } from './pokemon-moves.service';
import { PokemonMovesController } from './pokemon-moves.controller';

@Module({
  controllers: [PokemonMovesController],
  providers: [PokemonMovesService],
})
export class PokemonMovesModule {}
