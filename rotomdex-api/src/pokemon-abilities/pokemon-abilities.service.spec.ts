import { Test, TestingModule } from '@nestjs/testing';
import { PokemonAbilitiesService } from './pokemon-abilities.service';

describe('PokemonAbilitiesService', () => {
  let service: PokemonAbilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonAbilitiesService],
    }).compile();

    service = module.get<PokemonAbilitiesService>(PokemonAbilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
