import { Module } from '@nestjs/common';
import { PokemonMovesService } from './pokemon-moves.service';
import { PokemonMovesController } from './pokemon-moves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonMoves } from './entities/pokemon-moves.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonMoves])],
  controllers: [PokemonMovesController],
  providers: [PokemonMovesService],
})
export class PokemonMovesModule {}
