import { Test, TestingModule } from '@nestjs/testing';
import { AbilitiesController } from './abilities.controller';
import { AbilitiesService } from './abilities.service';

describe('AbilitiesController', () => {
  let controller: AbilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbilitiesController],
      providers: [AbilitiesService],
    }).compile();

    controller = module.get<AbilitiesController>(AbilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
