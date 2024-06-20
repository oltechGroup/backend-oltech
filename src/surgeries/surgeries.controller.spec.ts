import { Test, TestingModule } from '@nestjs/testing';
import { SurgeriesController } from './surgeries.controller';
import { SurgeriesService } from './surgeries.service';

describe('SurgeriesController', () => {
  let controller: SurgeriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurgeriesController],
      providers: [SurgeriesService],
    }).compile();

    controller = module.get<SurgeriesController>(SurgeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
