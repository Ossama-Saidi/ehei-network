import { Test, TestingModule } from '@nestjs/testing';
import { PublicationSavesService } from './publication-saves.service';

describe('PublicationSavesService', () => {
  let service: PublicationSavesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationSavesService],
    }).compile();

    service = module.get<PublicationSavesService>(PublicationSavesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
