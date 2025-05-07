import { Test, TestingModule } from '@nestjs/testing';
import { VilleService } from './ville.service';

describe('VilleService', () => {
  let service: VilleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VilleService],
    }).compile();

    service = module.get<VilleService>(VilleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
