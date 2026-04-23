import { Test, TestingModule } from '@nestjs/testing';
import { PokemonMovesController } from './pokemon-moves.controller';
import { PokemonMovesService } from './pokemon-moves.service';

describe('PokemonMovesController', () => {
  let controller: PokemonMovesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonMovesController],
      providers: [PokemonMovesService],
    }).compile();

    controller = module.get<PokemonMovesController>(PokemonMovesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
