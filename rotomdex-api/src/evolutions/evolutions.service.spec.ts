import { Test, TestingModule } from '@nestjs/testing';
import { EvolutionsService } from './evolutions.service';

describe('EvolutionsService', () => {
  let service: EvolutionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvolutionsService],
    }).compile();

    service = module.get<EvolutionsService>(EvolutionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
