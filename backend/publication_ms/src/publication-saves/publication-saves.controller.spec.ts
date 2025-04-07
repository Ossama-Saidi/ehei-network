import { Test, TestingModule } from '@nestjs/testing';
import { PublicationSavesController } from './publication-saves.controller';
import { PublicationSavesService } from './publication-saves.service';

describe('PublicationSavesController', () => {
  let controller: PublicationSavesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationSavesController],
      providers: [PublicationSavesService],
    }).compile();

    controller = module.get<PublicationSavesController>(PublicationSavesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
