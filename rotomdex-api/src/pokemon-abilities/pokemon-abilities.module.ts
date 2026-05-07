import { Module } from '@nestjs/common';
import { PokemonAbilitiesService } from './pokemon-abilities.service';
import { PokemonAbilitiesController } from './pokemon-abilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonAbilities } from './entities/pokemon-abilities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonAbilities])],
  controllers: [PokemonAbilitiesController],
  providers: [PokemonAbilitiesService],
})
export class PokemonAbilitiesModule {}
