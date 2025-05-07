import { Test, TestingModule } from '@nestjs/testing';
import { VilleController } from './ville.controller';
import { VilleService } from './ville.service';

describe('VilleController', () => {
  let controller: VilleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VilleController],
      providers: [VilleService],
    }).compile();

    controller = module.get<VilleController>(VilleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
