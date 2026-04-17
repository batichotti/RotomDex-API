import { Test, TestingModule } from '@nestjs/testing';
import { MovesController } from './moves.controller';
import { MovesService } from './moves.service';

describe('MovesController', () => {
  let controller: MovesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovesController],
      providers: [MovesService],
    }).compile();

    controller = module.get<MovesController>(MovesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
