import { Test, TestingModule } from '@nestjs/testing';
import { PokemonMovesService } from './pokemon-moves.service';

describe('PokemonMovesService', () => {
  let service: PokemonMovesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonMovesService],
    }).compile();

    service = module.get<PokemonMovesService>(PokemonMovesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
