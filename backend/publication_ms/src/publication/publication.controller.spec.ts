import { Test, TestingModule } from '@nestjs/testing';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';

describe('PublicationController', () => {
  let controller: PublicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationController],
      providers: [PublicationService],
    }).compile();

    controller = module.get<PublicationController>(PublicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
