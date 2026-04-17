import { Test, TestingModule } from '@nestjs/testing';
import { AbilitiesService } from './abilities.service';

describe('AbilitiesService', () => {
  let service: AbilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbilitiesService],
    }).compile();

    service = module.get<AbilitiesService>(AbilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
