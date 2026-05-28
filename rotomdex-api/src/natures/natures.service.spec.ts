import { Test, TestingModule } from '@nestjs/testing';
import { NaturesService } from './natures.service';

describe('NaturesService', () => {
  let service: NaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NaturesService],
    }).compile();

    service = module.get<NaturesService>(NaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
