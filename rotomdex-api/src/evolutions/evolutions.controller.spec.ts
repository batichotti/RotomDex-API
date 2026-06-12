import { Test, TestingModule } from '@nestjs/testing';
import { EvolutionsController } from './evolutions.controller';
import { EvolutionsService } from './evolutions.service';

describe('EvolutionsController', () => {
  let controller: EvolutionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvolutionsController],
      providers: [EvolutionsService],
    }).compile();

    controller = module.get<EvolutionsController>(EvolutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
