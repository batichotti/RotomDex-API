import { Test, TestingModule } from '@nestjs/testing';
import { NaturesController } from './natures.controller';
import { NaturesService } from './natures.service';

describe('NaturesController', () => {
  let controller: NaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NaturesController],
      providers: [NaturesService],
    }).compile();

    controller = module.get<NaturesController>(NaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
